import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";

import { AccentText } from "@/components/ui/AccentText";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { StarBackdrop } from "@/components/ui/StarBackdrop";
import { ToolPill } from "@/components/ui/ToolPill";
import { ProjectShot } from "@/components/work/ProjectShot";
import { workContent } from "@/content/work";
import { isWorkSlug, workSlugs } from "@/content/work-slugs";
import { href, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

// Every project page is built ahead of time; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => workSlugs.map((slug) => ({ lang, slug })));
}

function findProject(lang: string, slug: string) {
  if (!isLocale(lang) || !isWorkSlug(slug)) return null;
  const c = workContent[lang];
  const index = c.projects.findIndex((p) => p.slug === slug);
  return index === -1 ? null : { lang, c, index, project: c.projects[index] };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const found = findProject(lang, slug);
  if (!found) return {};
  const { project: p } = found;
  return pageMetadata(found.lang, `/work/${p.slug}`, { title: p.name, description: `${p.oneLiner} ${p.problem}` });
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default async function ProjectPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { lang: rawLang, slug } = await params;
  const found = findProject(rawLang, slug);
  if (!found) notFound();
  const { lang, c, index, project: p } = found;
  const next = c.projects[(index + 1) % c.projects.length];
  const { common, nav } = getDictionary(lang);
  const shell = "mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14";
  const label = "text-xs font-medium uppercase tracking-[0.2em] text-dim";

  // Breadcrumbs for search results: Home › Work › this project.
  const abs = (path: string) => new URL(href(lang, path), site.url).toString();
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: nav.home, item: abs("/") },
      { "@type": "ListItem", position: 2, name: c.metaTitle, item: abs("/work") },
      { "@type": "ListItem", position: 3, name: p.name, item: abs(`/work/${p.slug}`) },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }}
      />
      <StarBackdrop />

      {/* Opening */}
      <section className={`${shell} pb-16 pt-36 lg:pb-20 lg:pt-40`}>
        <Link
          href={href(lang, "/work")}
          data-reveal
          className="group inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
        >
          {/* The arrow points back: left in English, right in Arabic (ArrowIcon already mirrors for RTL). */}
          <span className="inline-flex -scale-x-100 transition-[translate] group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5">
            <ArrowIcon className="size-3.5" />
          </span>
          {c.allWork}
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p data-reveal className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium tracking-[0.2em] text-dim">
              <span>
                {String(index + 1).padStart(2, "0")} / {String(c.projects.length).padStart(2, "0")}
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-[linear-gradient(90deg,transparent,#a67bff)] rtl:-scale-x-100" />
              <span className="tracking-[0.12em] text-lav">{p.category}</span>
            </p>
            <h1
              data-reveal="rise"
              style={delay(80)}
              className="mt-5 font-display text-[clamp(38px,5.6vw,84px)] font-semibold leading-[1] tracking-[-0.04em]"
            >
              {p.name}
            </h1>
            <p data-reveal style={delay(140)} className="mt-5 max-w-[28em] text-xl text-lav">
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
      </section>

      <section className={`${shell} pb-20 lg:pb-28`}>
        <div data-reveal style={delay(120)}>
          <ProjectShot project={p} zoomHint={c.zoomHint} closeLabel={c.closeLabel} priority />
        </div>
        <p data-reveal className="mt-6 text-sm text-dim">
          {c.blurNote}
        </p>

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 data-reveal className={label}>
              {c.problemLabel}
            </h2>
            <p data-reveal style={delay(60)} className="mt-4 text-[17px] leading-relaxed text-muted">
              {p.problem}
            </p>
            <h2 data-reveal className={`${label} mt-10`}>
              {c.builtLabel}
            </h2>
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
            <h2 data-reveal className={label}>
              {c.capabilitiesLabel}
            </h2>
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
            <h2 className={label}>{c.flowLabel}</h2>
            <ol className="mt-4 flex flex-col items-start gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-3">
              {p.flow.map((step, j, all) => (
                <li key={step} className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
                  <span className="inline-flex h-9 items-center rounded-pill border border-lav/30 bg-violet/10 px-4 text-[14px] text-ink shadow-[inset_0_0_12px_rgb(124_77_255/0.15)]">
                    {step}
                  </span>
                  {j < all.length - 1 && <ArrowIcon className="size-3.5 text-lav max-sm:rotate-90 max-sm:rtl:-rotate-90" />}
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      {/* Next project */}
      <section className="border-t border-line">
        <Link
          href={href(lang, `/work/${next.slug}`)}
          className={`${shell} group flex flex-col gap-3 py-16 sm:flex-row sm:items-center sm:justify-between lg:py-20`}
        >
          <span>
            <span className={label}>{c.nextProject}</span>
            <span className="mt-3 block font-display text-[clamp(26px,3.2vw,44px)] font-semibold leading-[1.1] tracking-[-0.03em] transition-colors group-hover:text-lav">
              {next.name}
            </span>
            <span className="mt-2 block text-muted">{next.oneLiner}</span>
          </span>
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-line transition-[border-color,background-color] group-hover:border-lav/50 group-hover:bg-violet/10">
            <ArrowIcon className="size-5 text-lav transition-[translate] group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </span>
        </Link>
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
