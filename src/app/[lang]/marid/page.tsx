import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";

import logo from "@/assets/marid/logo.webp";
import { MaridDemo } from "@/components/marid/MaridDemo";
import { AccentText } from "@/components/ui/AccentText";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { StarBackdrop } from "@/components/ui/StarBackdrop";
import { ToolPill } from "@/components/ui/ToolPill";
import { maridContent } from "@/content/marid";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/marid">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = maridContent[lang];
  return pageMetadata(lang, "/marid", {
    title: c.metaTitle,
    description: c.metaDescription,
    image: { url: `/${lang}/marid/opengraph-image`, alt: c.orbAlt },
  });
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// The glassy card the rest of the site uses, a warmer one for Marid himself, and their lines of light.
const glass = "relative overflow-hidden rounded-[28px] border";
const card = `${glass} border-line bg-[linear-gradient(180deg,rgb(255_255_255/0.035),rgb(255_255_255/0.008))] shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]`;
const goldCard = `${glass} border-gold/35 bg-[linear-gradient(180deg,rgb(245_185_66/0.08),rgb(245_185_66/0.015))] shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_40px_100px_-50px_rgb(245_185_66/0.6)]`;
const topLight = "absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,#c8a8ff,transparent)]";
const goldLight = "absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,#f5b942,transparent)]";

/**
 * Marid, our own voice assistant: what it is (with the app's living orb answering real lines),
 * what you can say to it, what it does, how a reply works, how it compares with Siri and Bixby,
 * the limits it keeps, where it stands today, and an invitation to build one for your business.
 */
export default async function MaridPage({ params }: PageProps<"/[lang]/marid">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = maridContent[lang];
  const { common } = getDictionary(lang);
  const shell = "mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14";
  const h2 = "mt-6 font-display text-[clamp(32px,4.2vw,60px)] font-semibold leading-[1.03] tracking-[-0.035em]";
  const label = "text-xs font-medium uppercase tracking-[0.2em] text-dim";
  const arabic = (text: string) => (
    <span lang="ar" dir="rtl" className="font-arabic">
      «{text}»
    </span>
  );

  return (
    <>
      <StarBackdrop />

      {/* Opening: the name and the promise, with Marid himself answering beside them */}
      <section className={`${shell} grid items-center gap-12 pb-16 pt-36 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-40`}>
        <div className="lg:col-span-6">
          <div data-reveal className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">{c.eyebrow}</p>
            <span className="inline-flex h-7 items-center gap-2 rounded-pill border border-gold/30 bg-gold/10 px-3 text-xs font-medium text-gold-soft">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-gold shadow-[0_0_8px_#f5b942]" />
              {c.badge}
            </span>
          </div>
          <h1
            data-reveal="rise"
            style={delay(80)}
            className="mt-6 font-display text-[clamp(44px,5.6vw,88px)] font-semibold leading-[0.98] tracking-[-0.04em]"
          >
            {c.title} <span className="block"><AccentText text={c.titleAccent} /></span>
          </h1>
          <p data-reveal style={delay(160)} className="mt-8 max-w-[34em] text-lg text-muted">
            {c.lead}
          </p>
          <p
            data-reveal
            style={delay(220)}
            className="mt-6 max-w-[34em] border-s-2 border-gold/50 ps-4 text-[17px] leading-relaxed text-soft"
          >
            {c.goal}
          </p>
          <div data-reveal style={delay(280)} className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="#abilities" arrow>
              {c.abilitiesJump}
            </Button>
            <Button href="#compare" variant="ghost">
              {c.compareJump}
            </Button>
          </div>
        </div>
        <div data-reveal style={delay(120)} className="lg:col-span-6">
          <MaridDemo
            turns={c.demo.turns}
            you={c.demo.you}
            marid={c.demo.marid}
            alt={c.orbAlt}
            showGloss={lang === "en"}
          />
        </div>
      </section>

      {/* What you can say: real lines, in Egyptian Arabic, grouped by what they touch */}
      <section className="border-t border-line">
        <div className={`${shell} py-20 lg:py-28`}>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <p data-reveal className="eyebrow">
                {c.examples.eyebrow}
              </p>
              <h2 data-reveal="rise" style={delay(80)} className={h2}>
                {c.examples.title} <span className="block"><AccentText text={c.examples.titleAccent} /></span>
              </h2>
            </div>
            <p data-reveal style={delay(160)} className="max-w-[30em] text-lg text-muted lg:col-span-5">
              {c.examples.lead}
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 xl:grid-cols-4">
            {c.examples.groups.map((g, i) => (
              <div key={g.name} data-reveal style={delay(70 * i)} className={`${card} p-6 sm:p-7`}>
                <div aria-hidden="true" className={topLight} />
                <h3 className={label}>{g.name}</h3>
                <ul className="mt-5 grid gap-5">
                  {g.items.map((it) => (
                    <li key={it.say} className="grid gap-1.5">
                      <p className="text-[19px] leading-snug text-ink">{arabic(it.say)}</p>
                      {it.gloss && <p className="text-sm text-dim">{it.gloss}</p>}
                      <p className="flex items-start gap-2 text-[15px] text-muted">
                        <ArrowIcon className="mt-1.5 size-3 shrink-0 text-gold" />
                        {it.does}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What it does */}
      <section id="abilities" className="scroll-mt-24 border-t border-line">
        <div className={`${shell} py-20 lg:py-28`}>
          <p data-reveal className="eyebrow">
            {c.abilities.eyebrow}
          </p>
          <h2 data-reveal="rise" style={delay(80)} className={h2}>
            {c.abilities.title} <span className="block"><AccentText text={c.abilities.titleAccent} /></span>
          </h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {c.abilities.items.map((a, i) => (
              <li
                key={a.title}
                data-reveal
                data-spotlight
                style={delay(50 * (i % 3))}
                className={`${card} group flex flex-col p-6 transition-colors duration-500 hover:border-gold/30 sm:p-8`}
              >
                <div aria-hidden="true" className={`${goldLight} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                <span dir="ltr" className="text-xs tracking-[0.2em] text-gold/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-[clamp(21px,1.7vw,25px)] font-semibold leading-tight tracking-[-0.02em]">
                  {a.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted md:text-base">{a.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* How a reply works: five numbered stops along one line that draws itself */}
      <section className="border-t border-line">
        <div className={`${shell} py-20 lg:py-28`}>
          <p data-reveal className="eyebrow">
            {c.steps.eyebrow}
          </p>
          <h2 data-reveal="rise" style={delay(80)} className={h2}>
            {c.steps.title} <span className="block"><AccentText text={c.steps.titleAccent} /></span>
          </h2>
          <ol data-reveal="draw" className="relative mt-12 grid gap-0 lg:mt-16 lg:grid-cols-5 lg:gap-6">
            <span
              aria-hidden="true"
              className="draw-x absolute inset-x-[10%] top-[18px] hidden h-px bg-[linear-gradient(90deg,rgb(245_185_66/0.5),rgb(200_168_255/0.5))] lg:block"
            />
            {c.steps.items.map((s, j, all) => (
              <li
                key={s.name}
                style={{ "--cd": `${150 + 120 * j}ms`, "--ld": `${250 + 120 * j}ms` } as CSSProperties}
                className="relative flex gap-5 pb-8 last:pb-0 lg:flex-col lg:items-center lg:gap-4 lg:pb-0 lg:text-center"
              >
                {j < all.length - 1 && (
                  <span aria-hidden="true" className="draw-y absolute start-[17.5px] top-10 bottom-0 w-px bg-gold/30 lg:hidden" />
                )}
                <span
                  aria-hidden="true"
                  className="draw-in relative inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-surface text-xs font-medium text-gold shadow-[0_0_20px_-6px_rgb(245_185_66/0.7)]"
                >
                  {String(j + 1).padStart(2, "0")}
                </span>
                <div className="draw-in">
                  <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">{s.name}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Siri, Bixby and Marid: what each does well, where it stops, and what Marid takes and adds */}
      <section id="compare" className="scroll-mt-24 border-t border-line">
        <div className={`${shell} py-20 lg:py-28`}>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <p data-reveal className="eyebrow">
                {c.compare.eyebrow}
              </p>
              <h2 data-reveal="rise" style={delay(80)} className={h2}>
                {c.compare.title} <span className="block"><AccentText text={c.compare.titleAccent} /></span>
              </h2>
            </div>
            <p data-reveal style={delay(160)} className="max-w-[32em] text-lg text-muted lg:col-span-5">
              {c.compare.lead}
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-3">
            {c.compare.rivals.map((r, i) => (
              <article key={r.name} data-reveal style={delay(80 * i)} className={`${card} p-6 sm:p-8`}>
                <h3 dir="ltr" className="font-display text-[28px] font-semibold tracking-[-0.03em] rtl:text-end">
                  {r.name}
                </h3>
                <p className={`${label} mt-6`}>{c.compare.labels.good}</p>
                <ul className="mt-3 grid gap-2.5">
                  {r.good.map((x) => (
                    <li key={x} className="flex gap-3 text-[15px] text-soft">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-lav/70" />
                      {x}
                    </li>
                  ))}
                </ul>
                <p className={`${label} mt-7`}>{c.compare.labels.stops}</p>
                <ul className="mt-3 grid gap-2.5">
                  {r.stops.map((x) => (
                    <li key={x} className="flex gap-3 text-[15px] text-muted">
                      <span aria-hidden="true" className="mt-[9px] h-px w-2.5 shrink-0 bg-dim" />
                      {x}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
            <article
              data-reveal
              style={delay(160)}
              className={`${goldCard} p-6 sm:p-8`}
            >
              <div aria-hidden="true" className={goldLight} />
              <h3 className="font-display text-[28px] font-semibold tracking-[-0.03em] text-gold-soft">{c.compare.marid.name}</h3>
              <p className={`${label} mt-6`}>{c.compare.labels.takes}</p>
              <ul className="mt-3 grid gap-2.5">
                {c.compare.marid.takes.map((x) => (
                  <li key={x} className="flex gap-3 text-[15px] text-soft">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                    {x}
                  </li>
                ))}
              </ul>
              <p className={`${label} mt-7`}>{c.compare.labels.fixes}</p>
              <ul className="mt-3 grid gap-2.5">
                {c.compare.marid.fixes.map((x) => (
                  <li key={x} className="flex gap-3 text-[15px] text-ink">
                    <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {x}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          {/* The same facts side by side: a table from tablets up, one card per fact on phones */}
          <div data-reveal className="mt-4 grid gap-3 md:hidden">
            <p className={`${label} pt-4`}>{c.compare.table.caption}</p>
            {c.compare.table.rows.map(([name, ...cells]) => (
              <div key={name} className={`${card} p-5`}>
                <h3 className="font-medium text-soft">{name}</h3>
                <dl className="mt-3 grid gap-2.5 text-[15px]">
                  {cells.map((v, j) => (
                    <div key={j} className="flex items-baseline justify-between gap-4">
                      <dt className={j === 2 ? "text-gold-soft" : "text-dim"}>
                        {c.compare.table.head[j + 1]}
                      </dt>
                      <dd className={`text-end ${j === 2 ? "text-ink" : "text-muted"}`}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
          <div data-reveal className={`${card} mt-4 hidden md:block`}>
            <table className="w-full border-collapse text-start text-[15px]">
              <caption className={`${label} px-6 pb-2 pt-6 text-start sm:px-8`}>{c.compare.table.caption}</caption>
              <thead>
                <tr className="border-b border-line">
                  {c.compare.table.head.map((h, j) => (
                    <th
                      key={j}
                      scope="col"
                      className={`px-6 py-4 text-start font-display text-base font-semibold sm:px-8 ${j === 3 ? "text-gold-soft" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.compare.table.rows.map(([name, ...cells]) => (
                  <tr key={name} className="border-b border-line last:border-0">
                    <th scope="row" className="px-6 py-4 text-start font-medium text-soft sm:px-8">
                      {name}
                    </th>
                    {cells.map((v, j) => (
                      <td key={j} className={`px-6 py-4 sm:px-8 ${j === 2 ? "bg-gold/[0.05] text-ink" : "text-muted"}`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p data-reveal className="mt-8 max-w-[52em] text-[17px] text-soft">
            {c.compare.honest}
          </p>
          <div data-reveal className="mt-4 max-w-[52em] text-sm text-dim">
            <p>{c.compare.note}</p>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <span>{c.compare.sourcesLabel}:</span>
              {c.compare.sources.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-soft underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-current"
                >
                  {s.label}
                </a>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* The limits it keeps */}
      <section className="border-t border-line">
        <div className={`${shell} grid gap-12 py-20 lg:grid-cols-12 lg:py-28`}>
          <div className="lg:col-span-4">
            <p data-reveal className="eyebrow">
              {c.safety.eyebrow}
            </p>
            <h2 data-reveal="rise" style={delay(80)} className={h2}>
              {c.safety.title} <span className="block"><AccentText text={c.safety.titleAccent} /></span>
            </h2>
          </div>
          <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
            {c.safety.items.map((s, i) => (
              <li key={s.title} data-reveal style={delay(60 * i)} className="flex gap-4 border-t border-line py-6">
                <svg
                  viewBox="0 0 24 24"
                  className="mt-0.5 size-6 shrink-0 text-gold"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M12 3l7.5 3v5.5c0 4.4-3.1 8.4-7.5 9.5-4.4-1.1-7.5-5.1-7.5-9.5V6L12 3z" strokeLinejoin="round" />
                  <path d="M8.8 12.2l2.2 2.2 4.2-4.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-[-0.015em]">{s.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Where it stands: honest status, with the app's own icon */}
      <section className="border-t border-line">
        <div className={`${shell} py-20 lg:py-28`}>
          <div data-reveal className={`${card} grid gap-10 p-7 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-14`}>
            <div aria-hidden="true" className={goldLight} />
            <div className="lg:col-span-7">
              <p className="eyebrow">{c.status.eyebrow}</p>
              <h2 className={h2}>
                {c.status.title} <span className="block"><AccentText text={c.status.titleAccent} /></span>
              </h2>
              {c.status.body.map((p) => (
                <p key={p} className="mt-6 max-w-[36em] text-[17px] leading-relaxed text-soft">
                  {p}
                </p>
              ))}
              <p className={`${label} mt-8`}>{c.status.techLabel}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.status.tech.map((t) => (
                  <ToolPill key={t} name={t} />
                ))}
              </div>
            </div>
            <figure className="flex flex-col items-center gap-5 lg:col-span-5">
              <Image
                src={logo}
                alt={c.status.logoAlt}
                sizes="(min-width: 1024px) 340px, 260px"
                className="w-[260px] rounded-[36px] border border-gold/20 shadow-[0_40px_100px_-30px_rgb(245_185_66/0.45)] lg:w-[340px]"
              />
              <figcaption className="flex items-center gap-2.5 text-sm text-soft">
                {c.status.appName}
                <span className="inline-flex h-6 items-center rounded-pill border border-gold/30 bg-gold/10 px-2.5 text-xs text-gold-soft">
                  {c.badge}
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="border-t border-line">
        <div className={`${shell} flex flex-col items-center py-28 text-center lg:py-36`}>
          <h2
            data-reveal="rise"
            className="max-w-[16em] font-display text-[clamp(34px,4.8vw,72px)] font-semibold leading-[1.02] tracking-[-0.035em]"
          >
            {c.cta.title} <span className="block"><AccentText text={c.cta.titleAccent} /></span>
          </h2>
          <p data-reveal style={delay(100)} className="mt-6 max-w-[34em] text-lg text-muted">
            {c.cta.lead}
          </p>
          <div data-reveal style={delay(180)} className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href={site.bookingUrl} external arrow>
              {common.bookCall}
            </Button>
            <Button href={href(lang, "/contact")} variant="ghost">
              {c.cta.secondary}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
