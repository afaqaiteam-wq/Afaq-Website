import { NextResponse } from "next/server";
import { Resend } from "resend";

import { getDictionary } from "@/i18n/dictionaries";
import { contactSchema } from "@/lib/contact-schema";

/*
 * POST /api/contact — validates an enquiry on the server and emails it to the team.
 *
 * Required env (set in Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY      API key from resend.com
 *   CONTACT_TO_EMAIL    where enquiries are delivered
 *   CONTACT_FROM_EMAIL  optional; a verified sender, e.g. "Afaq AI <hello@your-domain>"
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
// A real enquiry is a few KB at most (the message is capped at 5,000 characters).
const MAX_BODY = 32 * 1024;
// Best-effort limiter: per server instance. Swap for a shared store (e.g. Upstash) at scale.
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  // forget addresses that have gone quiet, so the map can't grow without bound
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (now - times[times.length - 1] >= WINDOW_MS) hits.delete(key);
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

// The services a visitor can pick, in either language; anything else isn't from our form.
const SERVICES = new Set([...getDictionary("en").contact.services, ...getDictionary("ar").contact.services]);
// Names and the like go into the email subject: keep them on one line.
const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();

export async function POST(request: Request) {
  // Only our own pages post here, and only as JSON. A form on another site can't post JSON
  // without a preflight, but it can post text that parses as JSON, so check both.
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host && !(URL.canParse(origin) && new URL(origin).host === host)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ ok: false, error: "unsupported_media_type" }, { status: 415 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Bots fill the hidden field; answer as if it worked and drop the message.
  if (typeof body === "object" && body !== null && "website" in body && (body as { website?: string }).website) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fields = Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message]));
    return NextResponse.json({ ok: false, error: "validation", fields }, { status: 422 });
  }

  if (!SERVICES.has(parsed.data.service)) {
    return NextResponse.json({ ok: false, error: "validation", fields: { service: "serviceRequired" } }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contact] Not configured: set RESEND_API_KEY and CONTACT_TO_EMAIL.");
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  const { email, message, locale } = parsed.data;
  const name = oneLine(parsed.data.name);
  const company = oneLine(parsed.data.company);
  const service = oneLine(parsed.data.service);
  const from = process.env.CONTACT_FROM_EMAIL || "Afaq AI Website <onboarding@resend.dev>";
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || "—"}`,
    `Service: ${service}`,
    `Language: ${locale}`,
    "",
    message,
  ].join("\n");

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to,
    replyTo: email,
    subject: `New enquiry: ${service} — ${name}`,
    text,
  });

  if (error) {
    console.error("[contact] Resend failed:", error);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
