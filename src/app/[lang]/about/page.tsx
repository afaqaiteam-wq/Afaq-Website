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

/** A vertical line of light between two levels of the org chart. */
function Connector() {
  return (
    <span aria-hidden="true" data-reveal="line-y" className="relative my-2 block h-12 w-px bg-[linear-gradient(180deg,rgba(166,123,255,.15),#a67bff)] sm:h-16">
      <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-white shadow-[0_0_10px_#c8a8ff,0_0_22px_rgba(140,92,255,.8)]" />
    </span>
  );
}

/**
 * One team member. Photos get the same treatment (slightly muted, a violet dusk at the
 * bottom) so portraits shot in different light still read as one set.
 */
function PersonCard({ person, index, className = "" }: { person: Person; index: number; className?: string }) {
  return (
    <figure data-reveal style={delay(80 * index)} className={`group text-center ${className}`}>
      <div data-spotlight className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-surface sm:rounded-3xl">
        <Image
          src={person.photo}
          alt={person.name}
          fill
          sizes="(min-width: 640px) 400px, 50vw"
          className="object-cover object-top [filter:saturate(0.8)_contrast(1.04)] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.03] group-hover:[filter:saturate(1)_contrast(1.04)]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(7,6,11,.85))]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-3xl opacity-0 shadow-[inset_0_0_0_1px_rgba(166,123,255,.55),inset_0_-40px_80px_-40px_rgba(140,92,255,.5)] transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>
      <figcaption className="mt-4 sm:mt-5">
        <p className="font-display text-base font-semibold tracking-[-0.02em] sm:text-lg">{person.name}</p>
        <p className="mt-1 text-[13px] text-lav sm:text-sm">{person.role}</p>
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
  const tier = (n: Person["tier"]) => c.team.people.filter((p) => p.tier === n);
  const [lead] = tier(1);

  return (
    <>
      <StarBackdrop />

      {/* The name */}
      <section className={`${shell} relative pb-24 pt-40 lg:pb-32`}>
        {/* The name itself, drawn faintly in the empty half of the opening on large screens */}
        <span
          aria-hidden="true"
          data-reveal
          style={delay(200)}
          className="pointer-events-none absolute end-14 top-36 select-none bg-[linear-gradient(180deg,rgb(200_168_255/0.09),transparent_85%)] bg-clip-text font-arabic text-[clamp(170px,17vw,260px)] font-semibold leading-none text-transparent [-webkit-text-stroke:1px_rgb(200_168_255/0.18)] max-lg:hidden"
        >
          آفاق
        </span>
        <p data-reveal className="eyebrow">
          {c.eyebrow}
        </p>
        <h1
          data-reveal="rise"
          style={delay(80)}
          className="mt-6 max-w-[14em] font-display text-[clamp(44px,6.4vw,96px)] font-semibold leading-[0.98] tracking-[-0.04em]"
        >
          {c.title} <span className="block"><AccentText text={c.titleAccent} /></span>
        </h1>
        {/* the horizon itself: a thin line of light under the name */}
        <div
          data-reveal="line"
          style={delay(160)}
          aria-hidden="true"
          className="mt-14 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(166,123,255,.8)_50%,transparent)] shadow-[0_0_24px_rgba(140,92,255,.6)]"
        />
        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-16">
          {c.story.map((p, i) => (
            <p
              key={i}
              data-reveal
              style={delay(220 + i * 90)}
              className={i === 0 ? "font-display text-[clamp(22px,2.2vw,32px)] leading-snug tracking-[-0.02em] text-ink" : "text-lg leading-relaxed text-muted"}
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Principles: the heading stays in view while the four lines scroll past */}
      <section className="border-t border-line">
        <div className={`${shell} grid gap-12 py-24 lg:grid-cols-12 lg:gap-16 lg:py-32`}>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
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
            </div>
          </div>
          <ol className="border-t border-line lg:col-span-7">
            {c.principles.items.map((item, i) => (
              <li
                key={item.title}
                data-reveal
                style={delay(70 * i)}
                className="group relative grid grid-cols-[2.75rem_1fr] gap-x-3 border-b border-line py-8 sm:grid-cols-[4.5rem_1fr] sm:gap-x-4 sm:py-10"
              >
                <span dir="ltr" className="pt-1.5 font-display text-sm tabular-nums tracking-[0.12em] text-lav/70 sm:pt-2.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-[clamp(22px,2.2vw,30px)] font-semibold leading-tight tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[32em] text-[17px] leading-relaxed text-muted">{item.body}</p>
                </div>
                {/* a line of light that runs along the row on hover */}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-px start-0 h-px w-0 bg-[linear-gradient(90deg,#a67bff,transparent)] transition-[width] duration-700 ease-out group-hover:w-full rtl:bg-[linear-gradient(270deg,#a67bff,transparent)]"
                />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team */}
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
            <figure data-reveal className="group mx-auto mt-16 flex max-w-[760px] flex-col items-center text-center">
              <div data-spotlight className="relative aspect-[4/5] w-full max-w-[300px] overflow-hidden rounded-3xl border border-line bg-surface sm:max-w-[460px]">
                <Image
                  src={lead.photo}
                  alt={lead.name}
                  fill
                  sizes="460px"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(7,6,11,.7))]" />
                <div aria-hidden="true" className="absolute inset-0 rounded-3xl shadow-[inset_0_0_0_1px_rgba(166,123,255,.4),0_0_60px_-20px_rgba(140,92,255,.6)]" />
              </div>
              <figcaption className="mt-8">
                <p className="eyebrow">{lead.role}</p>
                <p className="mt-4 font-display text-[clamp(34px,4.2vw,60px)] font-semibold leading-[1] tracking-[-0.035em]">{lead.name}</p>
                {lead.quote && (
                  <blockquote className="mx-auto mt-8 max-w-[26em] font-display text-[clamp(20px,2vw,28px)] leading-snug tracking-[-0.02em] text-soft">
                    “{lead.quote}”
                  </blockquote>
                )}
                <p className="mx-auto mt-5 max-w-[34em] text-muted">{lead.line}</p>
              </figcaption>
            </figure>
          )}
          {/* The rest of the team as an org chart, joined by lines of light */}
          <div className="flex flex-col items-center">
            <Connector />
            {tier(2).map((p) => (
              <PersonCard key={p.name} person={p} index={0} className="w-full max-w-[250px] sm:max-w-[370px]" />
            ))}
            <Connector />
            {tier(3).map((p) => (
              <PersonCard key={p.name} person={p} index={0} className="w-full max-w-[220px] sm:max-w-[310px]" />
            ))}
            <Connector />
            <div className="relative grid w-full max-w-[980px] grid-cols-2 gap-x-4 gap-y-10 sm:-mt-2 sm:grid-cols-3 sm:gap-8">
              <span
                aria-hidden="true"
                data-reveal="line"
                className="absolute inset-x-[16.6%] top-0 hidden h-px bg-[linear-gradient(90deg,rgba(166,123,255,.35),#a67bff,rgba(166,123,255,.35))] sm:block"
              />
              {tier(4).map((p, i) => (
                <div key={p.name} className="flex flex-col items-center max-sm:last:col-span-2 max-sm:last:mx-auto max-sm:last:w-1/2">
                  <span aria-hidden="true" className="hidden h-10 w-px bg-[linear-gradient(180deg,#a67bff,rgba(166,123,255,.2))] sm:block" />
                  <PersonCard person={p} index={i} className="w-full max-w-[260px]" />
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
