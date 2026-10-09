import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";

import { AccentText } from "@/components/ui/AccentText";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { StarBackdrop } from "@/components/ui/StarBackdrop";
import { ToolPill } from "@/components/ui/ToolPill";
import { ProjectShot } from "@/components/work/ProjectShot";
import { ZoomImage } from "@/components/work/ZoomImage";
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
            data-reveal="rise"
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
            <li className="border-b border-line">
              <a
                href="#automation"
                className="group flex items-center gap-4 py-3.5 text-sm text-dim transition-colors hover:text-ink"
              >
                <span aria-hidden="true" className="w-6 text-xs">+</span>
                <span className="flex-1">{c.automationJump}</span>
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-lav/25 transition-[background-color,box-shadow] group-hover:bg-lav group-hover:shadow-[0_0_10px_#a67bff]"
                />
              </a>
            </li>
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
                  <span dir="ltr">
                    {String(i + 1).padStart(2, "0")} / {String(c.projects.length).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="h-px w-8 bg-[linear-gradient(90deg,transparent,#a67bff)] rtl:-scale-x-100" />
                  <span className="tracking-[0.12em] text-lav">{p.category}</span>
                </p>
                <h2
                  data-reveal="rise"
                  style={delay(80)}
                  className="mt-4 font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1.02] tracking-[-0.035em]"
                >
                  {p.name}
                </h2>
                <p data-reveal style={delay(140)} className="mt-4 max-w-[28em] text-xl text-lav">
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

            <div data-reveal style={delay(120)} className="mt-12 lg:mt-16">
              <ProjectShot project={p} zoomHint={c.zoomHint} closeLabel={c.closeLabel} priority={i === 0} />
            </div>

            {/* The full story lives on the project's own page. */}
            <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <h3 data-reveal className={label}>
                  {c.problemLabel}
                </h3>
                <p data-reveal style={delay(60)} className="mt-4 text-[17px] leading-relaxed text-muted">
                  {p.problem}
                </p>
              </div>
              <div data-reveal style={delay(120)} className="lg:col-span-4 lg:col-start-9 lg:text-end">
                <Button href={href(lang, `/work/${p.slug}`)} arrow>
                  {c.readCaseStudy}
                </Button>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* A smaller automation example, after the three projects */}
      <section id="automation" className="scroll-mt-24 border-t border-line">
        <div className={`${shell} grid gap-12 py-20 lg:grid-cols-12 lg:items-center lg:py-28`}>
          <div className="lg:col-span-5">
            <p data-reveal className="eyebrow">
              {c.automation.eyebrow}
            </p>
            <h2
              data-reveal="rise"
              style={delay(80)}
              className="mt-6 font-display text-[clamp(28px,3vw,44px)] font-semibold leading-[1.05] tracking-[-0.03em]"
            >
              {c.automation.name}
            </h2>
            <p data-reveal style={delay(120)} className="mt-3 text-sm tracking-[0.12em] text-lav">
              {c.automation.category}
            </p>
            <p data-reveal style={delay(160)} className="mt-6 text-[17px] leading-relaxed text-soft">
              {c.automation.body}
            </p>
            <ol data-reveal style={delay(200)} className="mt-8 flex flex-col items-start gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-3">
              {c.automation.flow.map((step, j, all) => (
                <li key={step} className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
                  <span className="inline-flex h-8 items-center rounded-pill border border-lav/30 bg-violet/10 px-3.5 text-[13px] text-ink">
                    {step}
                  </span>
                  {j < all.length - 1 && <ArrowIcon className="size-3 text-lav max-sm:rotate-90 max-sm:rtl:-rotate-90" />}
                </li>
              ))}
            </ol>
            <div data-reveal style={delay(240)} className="mt-8">
              <p className={label}>{c.techLabel}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.automation.tech.map((t) => (
                  <ToolPill key={t} name={t} />
                ))}
              </div>
            </div>
          </div>

          <div data-reveal style={delay(120)} className="relative lg:col-span-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-y-8 inset-x-0 rounded-[40px] bg-[radial-gradient(60%_55%_at_50%_50%,rgb(124_77_255/0.3),transparent_75%)] blur-2xl sm:-inset-x-4"
            />
            <div className="work-tilt relative rounded-[18px] border border-white/12 bg-surface/80 p-1.5 shadow-[0_40px_100px_-40px_rgb(124_77_255/0.55)] sm:p-2">
              <ZoomImage full={c.automation.image} alt={c.automation.imageAlt} hint={c.zoomHint} close={c.closeLabel}>
                <Image
                  src={c.automation.image}
                  alt={c.automation.imageAlt}
                  placeholder="blur"
                  sizes="(min-width: 1440px) 760px, (min-width: 1024px) 55vw, calc(100vw - 32px)"
                  className="h-auto w-full rounded-[12px]"
                />
              </ZoomImage>
            </div>
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
