import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";

import { AccentText } from "@/components/ui/AccentText";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { StarBackdrop } from "@/components/ui/StarBackdrop";
import { ToolPill } from "@/components/ui/ToolPill";
import { workContent } from "@/content/work";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/work">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = workContent[lang];
  return pageMetadata(lang, "/work", { title: c.metaTitle, description: c.metaDescription });
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = workContent[lang];
  const { common } = getDictionary(lang);
  const shell = "mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14";
  const label = "text-xs font-medium uppercase tracking-[0.2em] text-dim";

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
          <p data-reveal style={delay(220)} className="mt-4 max-w-[40em] text-sm text-dim">
            {c.blurNote}
          </p>
        </div>
        <nav data-reveal style={delay(240)} aria-label={c.jumpTo} className="lg:col-span-4 lg:self-end">
          <p className={label}>{c.jumpTo}</p>
          <ol className="mt-4 border-t border-line">
            {c.projects.map((p, i) => (
              <li key={p.slug} className="border-b border-line">
                <a
                  href={`#${p.slug}`}
                  className="group flex items-center gap-4 py-3.5 text-muted transition-colors hover:text-ink"
                >
                  <span className="w-6 text-xs text-dim">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">{p.name}</span>
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

      {/* The projects */}
      {c.projects.map((p, i) => (
        <section key={p.slug} id={p.slug} className="scroll-mt-24 border-t border-line">
          <div className={`${shell} py-20 lg:py-28`}>
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p data-reveal className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium tracking-[0.2em] text-dim">
                  <span>
                    {String(i + 1).padStart(2, "0")} / {String(c.projects.length).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="h-px w-8 bg-[linear-gradient(90deg,transparent,#a67bff)] rtl:-scale-x-100" />
                  <span className="tracking-[0.12em] text-[#c6adff]">{p.category}</span>
                </p>
                <h2
                  data-reveal
                  style={delay(80)}
                  className="mt-4 font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1.02] tracking-[-0.035em]"
                >
                  {p.name}
                </h2>
                <p data-reveal style={delay(140)} className="mt-4 max-w-[28em] text-xl text-[#c6adff]">
                  {p.oneLiner}
                </p>
              </div>
              {p.client && (
                <div data-reveal style={delay(200)} className="lg:col-span-4 lg:text-end">
                  <p className={label}>{c.clientLabel}</p>
                  <p className="mt-2 text-lg text-ink">{p.client}</p>
                </div>
              )}
            </div>

            {/* Screenshot: a subtle tilt that straightens as it reveals (globals.css .work-tilt) */}
            <div data-reveal style={delay(120)} className="relative mt-12 lg:mt-16">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-y-10 inset-x-0 rounded-[48px] sm:-inset-x-6 bg-[radial-gradient(60%_55%_at_50%_45%,rgb(124_77_255/0.38),transparent_75%)] blur-2xl"
              />
              <div className="work-tilt relative rounded-[18px] border border-white/12 bg-surface/80 p-1.5 shadow-[0_50px_120px_-40px_rgb(124_77_255/0.6),0_0_0_1px_rgb(200_168_255/0.08)] sm:rounded-[22px] sm:p-2">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,#c8a8ff,transparent)]"
                />
                <Image
                  src={p.image}
                  alt={p.imageAlt}
                  placeholder="blur"
                  sizes="(min-width: 1440px) 1330px, calc(100vw - 32px)"
                  priority={i === 0}
                  className="h-auto w-full rounded-[12px] sm:rounded-[16px]"
                />
              </div>
            </div>

            <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <h3 data-reveal className={label}>
                  {c.problemLabel}
                </h3>
                <p data-reveal style={delay(60)} className="mt-4 text-[17px] leading-relaxed text-muted">
                  {p.problem}
                </p>
                <h3 data-reveal className={`${label} mt-10`}>
                  {c.builtLabel}
                </h3>
                <p data-reveal style={delay(60)} className="mt-4 text-[clamp(18px,1.4vw,20px)] leading-relaxed text-soft">
                  {p.built}
                </p>

                {p.tech && (
                  <div data-reveal className="mt-10">
                    <p className={label}>{c.techLabel}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tech.map((t) => (
                        <ToolPill key={t} name={t} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-6 lg:col-start-7">
                <h3 data-reveal className={label}>
                  {c.capabilitiesLabel}
                </h3>
                <ul className="mt-4 border-t border-line">
                  {p.capabilities.map((cap, j) => (
                    <li
                      key={cap}
                      data-reveal
                      style={delay(50 * j)}
                      className="flex gap-4 border-b border-line py-3.5 text-[16px] text-ink"
                    >
                      <span aria-hidden="true" className="mt-[9px] size-1.5 shrink-0 rounded-full bg-lav shadow-[0_0_8px_#a67bff]" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {p.flow && (
              <div data-reveal className="mt-14">
                <h3 className={label}>{c.flowLabel}</h3>
                <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-3">
                  {p.flow.map((step, j, all) => (
                    <li key={step} className="flex items-center gap-2">
                      <span className="inline-flex h-9 items-center rounded-pill border border-lav/30 bg-violet/10 px-4 text-[14px] text-ink shadow-[inset_0_0_12px_rgb(124_77_255/0.15)]">
                        {step}
                      </span>
                      {j < all.length - 1 && <ArrowIcon className="size-3.5 text-lav" />}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>
      ))}

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
