import { NextResponse } from "next/server";
import { Resend } from "resend";

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
// Best-effort limiter: per server instance. Swap for a shared store (e.g. Upstash) at scale.
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
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

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contact] Not configured: set RESEND_API_KEY and CONTACT_TO_EMAIL.");
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  const { name, email, company, service, message, locale } = parsed.data;
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
