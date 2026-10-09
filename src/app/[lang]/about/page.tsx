import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";

import { AccentText } from "@/components/ui/AccentText";
import { Button } from "@/components/ui/Button";
import { StarBackdrop } from "@/components/ui/StarBackdrop";
import { aboutContent, type Person } from "@/content/about";
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

/**
 * One team member. Photos get the same treatment (slightly muted, a violet dusk at the
 * bottom) so portraits shot in different light still read as one set.
 */
function PersonCard({ person, index }: { person: Person; index: number }) {
  return (
    <figure data-reveal style={delay(80 * index)} className="group text-center">
      <div data-spotlight className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-surface sm:rounded-3xl">
        <Image
          src={person.photo}
          alt={person.name}
          fill
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 30vw, 46vw"
          className="object-cover object-top [filter:saturate(0.8)_contrast(1.04)] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.03] group-hover:[filter:saturate(1)_contrast(1.04)]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(7,6,11,.85))]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl opacity-0 shadow-[inset_0_0_0_1px_rgba(166,123,255,.55),inset_0_-40px_80px_-40px_rgba(140,92,255,.5)] transition-opacity duration-500 group-hover:opacity-100 sm:rounded-3xl"
        />
      </div>
      <figcaption className="mt-4 sm:mt-5">
        <p className="font-display text-base font-semibold tracking-[-0.02em] sm:text-lg">{person.name}</p>
        <p className="mt-1 text-[13px] leading-snug text-lav sm:text-sm">{person.role}</p>
        <p className="mx-auto mt-2 max-w-[30em] text-[13px] leading-relaxed text-muted sm:mt-3 sm:text-[15px]">{person.line}</p>
      </figcaption>
    </figure>
  );
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = aboutContent[lang];
  const { common } = getDictionary(lang);
  const shell = "mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14";
  const lead = c.team.people.find((p) => p.tier === 1);
  const rest = c.team.people.filter((p) => p.tier !== 1).sort((a, b) => a.tier - b.tier);
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
          <ol className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {c.principles.items.map((item, i) => (
              <li key={item.title} data-reveal style={delay(70 * i)} data-spotlight className="group relative bg-bg p-7 sm:p-8 lg:min-h-[260px]">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-center scale-x-0 bg-[linear-gradient(90deg,transparent,#c8a8ff,transparent)] transition-transform duration-700 ease-out group-hover:scale-x-100"
                />
                <span dir="ltr" className="font-display text-sm tabular-nums tracking-[0.12em] text-lav/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-8 font-display text-[clamp(21px,1.7vw,25px)] font-semibold leading-tight tracking-[-0.02em] lg:mt-10">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team: the founder first, then everyone else as one row joined by a line of light */}
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

          {lead && (
            <figure
              data-reveal
              className="group relative mt-14 grid overflow-hidden rounded-[28px] border border-line bg-surface/70 shadow-[0_50px_120px_-60px_rgb(124_77_255/0.55)] lg:mt-20 lg:grid-cols-12"
            >
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:col-span-5 lg:aspect-auto lg:min-h-[540px]">
                <Image
                  src={lead.photo}
                  alt={lead.name}
                  fill
                  sizes="(min-width: 1440px) 540px, (min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-[50%_28%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                {/* the portrait fades into the card: downwards on phones, sideways on large screens */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(14_12_21))] lg:bg-[linear-gradient(90deg,transparent_62%,rgb(14_12_21))] lg:rtl:bg-[linear-gradient(270deg,transparent_62%,rgb(14_12_21))]"
                />
              </div>
              <figcaption className="relative flex flex-col justify-center p-7 sm:p-10 lg:col-span-7 lg:p-16">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -end-32 -top-32 size-96 rounded-full bg-[radial-gradient(circle,rgb(124_77_255/0.22),transparent_70%)]"
                />
                <p className="eyebrow relative">{lead.role}</p>
                {lead.quote && (
                  <blockquote className="relative mt-6 font-display text-[clamp(24px,2.5vw,38px)] leading-[1.22] tracking-[-0.02em] text-ink">
                    <span aria-hidden="true" className="text-lav">{open}</span>
                    {lead.quote}
                    <span aria-hidden="true" className="text-lav">{close}</span>
                  </blockquote>
                )}
                <div className="relative mt-10 border-t border-line pt-6">
                  <p className="font-display text-[clamp(22px,2vw,28px)] font-semibold tracking-[-0.025em]">{lead.name}</p>
                  <p className="mt-2 max-w-[34em] text-muted">{lead.line}</p>
                </div>
              </figcaption>
            </figure>
          )}

          {/* padding, not margin, so the connector starts right under the founder */}
          <div className="relative pt-14 lg:pt-24">
            {/* from the founder down to a rail above the team (large screens) */}
            <span
              aria-hidden="true"
              data-reveal="line-y"
              className="absolute left-[calc(50%_-_0.5px)] top-0 hidden h-12 w-px bg-[linear-gradient(180deg,rgba(166,123,255,.15),#a67bff)] lg:block"
            />
            <div className="relative flex flex-wrap justify-center gap-x-4 gap-y-10 sm:gap-x-5">
              <span
                aria-hidden="true"
                data-reveal="line"
                className="absolute inset-x-[calc((100%_-_5rem)/10)] -top-12 hidden h-px bg-[linear-gradient(90deg,rgba(166,123,255,.35),#a67bff,rgba(166,123,255,.35))] lg:block"
              />
              {rest.map((p, i) => (
                <div
                  key={p.name}
                  className="relative basis-[calc((100%_-_1rem)/2)] sm:basis-[calc((100%_-_2.5rem)/3)] lg:basis-[calc((100%_-_5rem)/5)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 -top-12 hidden h-12 w-px bg-[linear-gradient(180deg,#a67bff,rgba(166,123,255,.15))] -translate-x-1/2 lg:block"
                  />
                  <PersonCard person={p} index={i} />
                </div>
              ))}
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
