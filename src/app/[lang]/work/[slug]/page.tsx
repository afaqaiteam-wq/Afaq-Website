import type { Metadata } from "next";
import Image from "next/image";
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

/**
 * Widens a card or two so the capability grid never ends with a card on its own:
 * two columns on tablets, three on wide screens.
 */
function capabilitySpan(i: number, n: number) {
  const tablet = n % 2 === 1 && i === 0;
  const wide = (n % 3 === 1 && (i === 0 || i === n - 2)) || (n % 3 === 2 && i === 0);
  return [tablet && "sm:col-span-2", wide ? "xl:col-span-2" : tablet && "xl:col-span-1"].filter(Boolean).join(" ");
}

// Wide screens show every fact in one row; written out so Tailwind keeps the classes.
const factCols: Record<number, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

export default async function ProjectPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { lang: rawLang, slug } = await params;
  const found = findProject(rawLang, slug);
  if (!found) notFound();
  const { lang, c, index, project: p } = found;
  const next = c.projects[(index + 1) % c.projects.length];
  const { common, nav } = getDictionary(lang);
  const shell = "mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14";
  const label = "text-xs font-medium uppercase tracking-[0.2em] text-dim";
  const factText = "text-[17px] text-ink";
  const facts = [
    ...(p.client ? [{ label: c.clientLabel, value: <span className={factText}>{p.client}</span> }] : []),
    { label: c.fieldLabel, value: <span className={factText}>{p.category}</span> },
    { label: c.languagesLabel, value: <span className={factText}>{p.languages}</span> },
    ...(p.tech
      ? [
          {
            label: c.techLabel,
            value: (
              <span className="flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <ToolPill key={t} name={t} />
                ))}
              </span>
            ),
          },
        ]
      : []),
  ];

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
      <section className={`${shell} relative pb-14 pt-36 lg:pb-16 lg:pt-40`}>
        {/* The project's number, large and faint behind the title. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute end-4 top-24 select-none font-display text-[clamp(160px,22vw,340px)] font-semibold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(200_168_255/0.14)] max-md:hidden sm:end-8 lg:end-14"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <Link
          href={href(lang, "/work")}
          data-reveal
          className="group relative inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
        >
          {/* The arrow points back: left in English, right in Arabic (ArrowIcon already mirrors for RTL). */}
          <span className="inline-flex -scale-x-100 transition-[translate] group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5">
            <ArrowIcon className="size-3.5" />
          </span>
          {c.allWork}
        </Link>

        <div className="relative mt-8 max-w-[62rem]">
          <p data-reveal className="eyebrow">
            {c.caseStudyLabel} ·{" "}
            <span dir="ltr">
              {String(index + 1).padStart(2, "0")} / {String(c.projects.length).padStart(2, "0")}
            </span>
          </p>
          <h1
            data-reveal="rise"
            style={delay(80)}
            className="mt-6 font-display text-[clamp(40px,6vw,92px)] font-semibold leading-[0.98] tracking-[-0.04em]"
          >
            {p.name}
          </h1>
          <p data-reveal style={delay(140)} className="mt-6 max-w-[30em] text-[clamp(18px,1.6vw,22px)] leading-snug text-lav">
            {p.oneLiner}
          </p>
        </div>

        {/* Facts: who it was for, the field, the interface and the stack, each only when we can say it. */}
        <dl
          data-reveal
          style={delay(200)}
          className={`relative mt-12 grid gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-2 lg:mt-14 ${factCols[facts.length]}`}
        >
          {facts.map((f, j) => (
            <div
              key={f.label}
              className={`bg-bg p-5 sm:p-6 ${facts.length % 2 === 1 && j === facts.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <dt className={label}>{f.label}</dt>
              <dd className="mt-2.5">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${shell} pb-20 lg:pb-28`}>
        <div data-reveal style={delay(120)}>
          <ProjectShot project={p} zoomHint={c.zoomHint} closeLabel={c.closeLabel} priority />
        </div>
        <p data-reveal className="mt-6 text-sm text-dim">
          {c.blurNote}
        </p>
      </section>

      {/* The story: the problem, then what we built, in large type */}
      <section className={`${shell} pb-20 lg:pb-28`}>
        {[
          { n: "01", title: c.problemLabel, body: p.problem, tone: "text-muted" },
          { n: "02", title: c.builtLabel, body: p.built, tone: "text-ink" },
        ].map((row) => (
          <div key={row.n} className="grid gap-4 border-t border-line py-10 lg:grid-cols-12 lg:gap-8 lg:py-14">
            <h2 data-reveal className={`${label} flex items-baseline gap-3 lg:col-span-3`}>
              <span className="text-lav">{row.n}</span>
              {row.title}
            </h2>
            <p
              data-reveal
              style={delay(80)}
              className={`text-[clamp(20px,2.1vw,30px)] leading-[1.45] tracking-[-0.01em] lg:col-span-8 lg:col-start-5 ${row.tone}`}
            >
              {row.body}
            </p>
          </div>
        ))}
      </section>

      {/* Inside the system */}
      <section className="border-t border-line">
        <div className={`${shell} py-20 lg:py-28`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2
              data-reveal="rise"
              className="font-display text-[clamp(28px,3.4vw,48px)] font-semibold leading-[1.05] tracking-[-0.035em]"
            >
              {c.capabilitiesLabel}
            </h2>
            <p data-reveal className="font-display text-[clamp(28px,3.4vw,48px)] font-semibold leading-none text-lav/60">
              {String(p.capabilities.length).padStart(2, "0")}
            </p>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-14 xl:grid-cols-3">
            {p.capabilities.map((cap, j) => (
              <li
                key={cap}
                data-reveal
                data-spotlight
                style={delay(40 * (j % 6))}
                className={`relative flex flex-col justify-between gap-4 overflow-hidden rounded-[18px] border border-line bg-white/[0.02] p-5 transition-colors hover:border-lav/30 sm:min-h-[132px] sm:gap-6 sm:p-6 ${capabilitySpan(j, p.capabilities.length)}`}
              >
                <span className="text-xs font-medium tracking-[0.2em] text-lav">{String(j + 1).padStart(2, "0")}</span>
                <span className="text-[16px] leading-snug text-ink">{cap}</span>
              </li>
            ))}
          </ul>

          {p.flow && (
            <div className="mt-20 lg:mt-24">
              <h3 data-reveal className={label}>
                {c.flowLabel}
              </h3>
              {/* A pipeline: numbered stops joined by a line, across on wide screens and down on phones. */}
              <ol data-reveal className="mt-8 grid md:auto-cols-fr md:grid-flow-col">
                {p.flow.map((step, j, all) => (
                  <li key={step} className="relative flex items-center gap-4 pb-6 md:flex-col md:items-start md:gap-4 md:pb-0">
                    {j < all.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute start-5 top-10 bottom-0 w-px bg-lav/25 md:start-10 md:end-0 md:top-5 md:bottom-auto md:h-px md:w-auto"
                      />
                    )}
                    <span className="relative z-[1] inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-lav/40 bg-surface text-[13px] font-medium text-lav shadow-[0_0_24px_-6px_rgb(124_77_255/0.7)]">
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] text-ink md:pe-4">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </section>

      {/* Next project, with its screen */}
      <section className="border-t border-line">
        <div className={`${shell} py-20 lg:py-24`}>
          <p data-reveal className={label}>
            {c.nextProject}
          </p>
          <Link
            href={href(lang, `/work/${next.slug}`)}
            data-reveal
            data-spotlight
            style={delay(80)}
            className="group mt-6 grid overflow-hidden rounded-[24px] border border-line bg-surface/60 transition-[border-color,box-shadow] duration-500 hover:border-lav/40 hover:shadow-[0_40px_100px_-50px_rgb(124_77_255/0.8)] md:grid-cols-2"
          >
            <span className="flex flex-col justify-between gap-10 p-7 sm:p-10">
              <span>
                <span className="text-xs font-medium tracking-[0.12em] text-lav">{next.category}</span>
                <span className="mt-4 block font-display text-[clamp(28px,3.2vw,46px)] font-semibold leading-[1.05] tracking-[-0.035em]">
                  {next.name}
                </span>
                <span className="mt-4 block max-w-[26em] text-muted">{next.oneLiner}</span>
              </span>
              <span className="inline-flex items-center gap-3 text-sm font-medium text-ink">
                {c.readCaseStudy}
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-line transition-[border-color,background-color] group-hover:border-lav/50 group-hover:bg-violet/15">
                  <ArrowIcon className="size-4 text-lav transition-[translate] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </span>
              </span>
            </span>
            <span className="relative block aspect-[16/10] overflow-hidden border-line max-md:border-t md:aspect-auto md:min-h-[320px] md:border-s">
              <Image
                src={next.image}
                alt=""
                fill
                placeholder="blur"
                sizes="(min-width: 768px) 50vw, calc(100vw - 32px)"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(7_6_11/0.6))]" />
            </span>
          </Link>
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
