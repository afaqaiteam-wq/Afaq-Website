import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";

import { AccentText } from "@/components/ui/AccentText";
import { Button } from "@/components/ui/Button";
import { StarBackdrop } from "@/components/ui/StarBackdrop";
import { TeamConstellation } from "@/components/about/TeamConstellation";
import { aboutContent } from "@/content/about";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = aboutContent[lang];
  return pageMetadata(lang, "/about", { title: c.metaTitle, description: c.metaDescription });
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = aboutContent[lang];
  const { common } = getDictionary(lang);
  const shell = "mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14";
  const team = [...c.team.people].sort((a, b) => a.tier - b.tier);
  // Arabic quotes with guillemets; English with curly quotes.
  const [open, close] = lang === "ar" ? ["«", "»"] : ["“", "”"];

  return (
    <>
      <StarBackdrop />

      {/* The name, with the story beside it rather than below an empty half */}
      <section className={`${shell} pt-40`}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p data-reveal className="eyebrow">
              {c.eyebrow}
            </p>
            <h1
              data-reveal="rise"
              style={delay(80)}
              className="mt-6 font-display text-[clamp(44px,5.4vw,84px)] font-semibold leading-[0.98] tracking-[-0.04em]"
            >
              {c.title} <span className="block"><AccentText text={c.titleAccent} /></span>
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            {c.story.map((p, i) => (
              <p
                key={i}
                data-reveal
                style={delay(200 + i * 90)}
                className={
                  i === 0
                    ? "font-display text-[clamp(20px,1.8vw,26px)] leading-snug tracking-[-0.015em] text-ink"
                    : "mt-5 text-[17px] leading-relaxed text-muted"
                }
              >
                {p}
              </p>
            ))}
          </div>
        </div>
        {/* the horizon itself: a thin line of light under the name */}
        <div
          data-reveal="line"
          style={delay(160)}
          aria-hidden="true"
          className="mt-16 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(166,123,255,.8)_50%,transparent)] shadow-[0_0_24px_rgba(140,92,255,.6)] lg:mt-20"
        />
      </section>

      {/* Principles: four lines, side by side (the horizon line above already divides) */}
      <section>
        <div className={`${shell} py-24 lg:py-32`}>
          <p data-reveal className="eyebrow">
            {c.principles.eyebrow}
          </p>
          <h2
            data-reveal="rise"
            style={delay(80)}
            className="mt-6 font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1.02] tracking-[-0.035em]"
          >
            {c.principles.title} <span className="block"><AccentText text={c.principles.titleAccent} /></span>
          </h2>
          {/* Four lines, literally: the frame and the dividers draw in, then each cell's words arrive */}
          <ol data-reveal="draw" className="relative mt-14 grid sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            <span aria-hidden="true" className="draw-x absolute inset-x-0 top-0 h-px bg-lav/30" />
            <span aria-hidden="true" className="draw-x from-end absolute inset-x-0 bottom-0 h-px bg-lav/30 [--ld:300ms]" />
            <span aria-hidden="true" className="draw-y absolute inset-y-0 start-0 w-px bg-lav/30 [--ld:150ms]" />
            <span aria-hidden="true" className="draw-y from-end absolute inset-y-0 end-0 w-px bg-lav/30 [--ld:150ms]" />
            {c.principles.items.map((item, i) => (
              <li key={item.title} data-spotlight className="group relative p-7 sm:p-8 lg:min-h-[260px]">
                {/* dividers: between rows on phones, a 2×2 cross on tablets, columns on desktop */}
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className={`draw-x absolute inset-x-0 top-0 h-px bg-lav/20 [--ld:450ms] ${i === 1 ? "sm:hidden" : "lg:hidden"}`}
                  />
                )}
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className={`draw-y absolute inset-y-0 start-0 hidden w-px bg-lav/20 [--ld:450ms] ${i === 2 ? "lg:block" : "sm:block"}`}
                  />
                )}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 z-[1] h-px origin-center scale-x-0 bg-[linear-gradient(90deg,transparent,#c8a8ff,transparent)] transition-transform duration-700 ease-out group-hover:scale-x-100"
                />
                <span
                  dir="ltr"
                  style={{ "--cd": `${700 + 140 * i}ms` } as CSSProperties}
                  className="draw-in block font-display text-sm tabular-nums tracking-[0.12em] text-lav/70 rtl:text-right"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div style={{ "--cd": `${800 + 140 * i}ms` } as CSSProperties} className="draw-in">
                  <h3 className="mt-8 font-display text-[clamp(21px,1.7vw,25px)] font-semibold leading-tight tracking-[-0.02em] lg:mt-10">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team: the A of the logo as a constellation, one star per person */}
      <section className="border-t border-line">
        <div className={`${shell} py-24 lg:py-32`}>
          <p data-reveal className="eyebrow">
            {c.team.eyebrow}
          </p>
          <h2
            data-reveal="rise"
            style={delay(80)}
            className="mt-6 font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1.02] tracking-[-0.035em]"
          >
            {c.team.title} <span className="block"><AccentText text={c.team.titleAccent} /></span>
          </h2>

          <TeamConstellation people={team} lang={lang} labels={{ quoteOpen: open, quoteClose: close }} />
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
