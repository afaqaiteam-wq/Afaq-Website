import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";

import { ProcessTrack } from "@/components/services/ProcessTrack";
import { AccentText } from "@/components/ui/AccentText";
import { Button } from "@/components/ui/Button";
import { StarBackdrop } from "@/components/ui/StarBackdrop";
import { ToolPill } from "@/components/ui/ToolPill";
import { servicesContent } from "@/content/services";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = servicesContent[lang];
  return pageMetadata(lang, "/services", { title: c.metaTitle, description: c.metaDescription });
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = servicesContent[lang];
  const { common } = getDictionary(lang);
  const shell = "mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14";

  return (
    <>
      <StarBackdrop />

      {/* Opening */}
      <section className={`${shell} grid gap-14 pb-20 pt-40 lg:grid-cols-12 lg:pb-28`}>
        <div className="lg:col-span-8">
          <p data-reveal className="eyebrow">
            {c.eyebrow}
          </p>
          <h1
            data-reveal
            style={delay(80)}
            className="mt-6 font-display text-[clamp(44px,6.4vw,96px)] font-semibold leading-[0.98] tracking-[-0.04em]"
          >
            {c.title} <span className="block"><AccentText text={c.titleAccent} /></span>
          </h1>
          <p data-reveal style={delay(160)} className="mt-8 max-w-[34em] text-lg text-muted">
            {c.lead}
          </p>
        </div>
        <nav data-reveal style={delay(240)} aria-label={c.jumpTo} className="lg:col-span-4 lg:self-end">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-dim">{c.jumpTo}</p>
          <ol className="mt-4 border-t border-line">
            {c.services.map((s, i) => (
              <li key={s.slug} className="border-b border-line">
                <a
                  href={`#${s.slug}`}
                  className="group flex items-center gap-4 py-3.5 text-muted transition-colors hover:text-ink"
                >
                  <span className="w-6 text-xs text-dim">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">{s.name}</span>
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-lav/40 transition-[background-color,box-shadow] group-hover:bg-lav group-hover:shadow-[0_0_10px_#a67bff]"
                  />
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      {/* The six services */}
      {c.services.map((s, i) => (
        <section key={s.slug} id={s.slug} className="scroll-mt-24 border-t border-line">
          <div className={`${shell} grid gap-12 py-20 lg:grid-cols-12 lg:py-28`}>
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <p data-reveal className="text-xs font-medium tracking-[0.2em] text-dim">
                  {String(i + 1).padStart(2, "0")} / {String(c.services.length).padStart(2, "0")}
                </p>
                <h2
                  data-reveal
                  style={delay(80)}
                  className="mt-4 font-display text-[clamp(32px,3.8vw,56px)] font-semibold leading-[1.02] tracking-[-0.035em]"
                >
                  {s.name}
                </h2>
                <p data-reveal style={delay(140)} className="mt-4 max-w-[22em] text-xl text-[#c6adff]">
                  {s.promise}
                </p>
                <div data-reveal style={delay(200)} className="mt-8">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-dim">{c.techLabel}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.tech.map((t) => (
                      <ToolPill key={t} name={t} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <p data-reveal className="text-[clamp(18px,1.5vw,21px)] leading-relaxed text-soft">
                {s.overview}
              </p>

              <h3 data-reveal className="mt-12 text-xs font-medium uppercase tracking-[0.2em] text-dim">
                {c.buildLabel}
              </h3>
              <ul className="mt-4 border-t border-line">
                {s.build.map((b, j) => (
                  <li
                    key={b}
                    data-reveal
                    style={delay(60 * j)}
                    className="flex gap-4 border-b border-line py-4 text-[16px] text-ink"
                  >
                    <span aria-hidden="true" className="mt-[9px] size-1.5 shrink-0 rounded-full bg-lav shadow-[0_0_8px_#a67bff]" />
                    {b}
                  </li>
                ))}
              </ul>

              <h3 data-reveal className="mt-12 text-xs font-medium uppercase tracking-[0.2em] text-dim">
                {c.outcomesLabel}
              </h3>
              <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {s.outcomes.map((o, j) => (
                  <li key={o} data-reveal style={delay(60 * j)} className="flex items-center gap-3 text-muted">
                    <span aria-hidden="true" className="h-px w-5 shrink-0 bg-[linear-gradient(90deg,transparent,#a67bff)]" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      {/* How every engagement runs */}
      <section className="border-t border-line">
        <div className={`${shell} py-24 lg:py-32`}>
          <p data-reveal className="eyebrow">
            {c.process.eyebrow}
          </p>
          <h2
            data-reveal
            style={delay(80)}
            className="mt-6 max-w-[18em] font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1.02] tracking-[-0.035em]"
          >
            {c.process.title} <span className="block"><AccentText text={c.process.titleAccent} /></span>
          </h2>
          <ProcessTrack steps={c.process.steps} />
        </div>
      </section>

      {/* Closing */}
      <section className="border-t border-line">
        <div className={`${shell} flex flex-col items-center py-28 text-center lg:py-36`}>
          <h2
            data-reveal
            className="max-w-[16em] font-display text-[clamp(34px,4.8vw,72px)] font-semibold leading-[1.02] tracking-[-0.035em]"
          >
            {c.cta.title} <span className="block"><AccentText text={c.cta.titleAccent} /></span>
          </h2>
          <p data-reveal style={delay(100)} className="mt-6 max-w-[32em] text-lg text-muted">
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
