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
    <figure data-reveal style={delay(80 * index)} className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-surface">
        <Image
          src={person.photo}
          alt={person.name}
          fill
          sizes="(min-width: 1024px) 30vw, 50vw"
          className="object-cover object-top [filter:saturate(0.8)_contrast(1.04)] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.03] group-hover:[filter:saturate(1)_contrast(1.04)]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(7,6,11,.85))]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-3xl opacity-0 shadow-[inset_0_0_0_1px_rgba(166,123,255,.55),inset_0_-40px_80px_-40px_rgba(140,92,255,.5)] transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>
      <figcaption className="mt-5">
        <p className="font-display text-xl font-semibold tracking-[-0.02em]">{person.name}</p>
        <p className="mt-1 text-sm text-[#c6adff]">{person.role}</p>
        <p className="mt-3 max-w-[30em] text-[15px] leading-relaxed text-muted">{person.line}</p>
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

  return (
    <>
      <StarBackdrop />

      {/* The name */}
      <section className={`${shell} pb-24 pt-40 lg:pb-32`}>
        <p data-reveal className="eyebrow">
          {c.eyebrow}
        </p>
        <h1
          data-reveal
          style={delay(80)}
          className="mt-6 max-w-[14em] font-display text-[clamp(44px,6.4vw,96px)] font-semibold leading-[0.98] tracking-[-0.04em]"
        >
          {c.title} <span className="block"><AccentText text={c.titleAccent} /></span>
        </h1>
        {/* the horizon itself: a thin line of light under the name */}
        <div
          data-reveal
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

      {/* Principles */}
      <section className="border-t border-line">
        <div className={`${shell} py-24 lg:py-32`}>
          <p data-reveal className="eyebrow">
            {c.principles.eyebrow}
          </p>
          <h2
            data-reveal
            style={delay(80)}
            className="mt-6 font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1.02] tracking-[-0.035em]"
          >
            {c.principles.title} <span className="block"><AccentText text={c.principles.titleAccent} /></span>
          </h2>
          <ul className="mt-16 grid border-t border-line sm:grid-cols-2">
            {c.principles.items.map((item, i) => (
              <li
                key={item.title}
                data-reveal
                style={delay(70 * i)}
                className="border-b border-line py-10 sm:odd:pe-10 sm:even:border-s sm:even:ps-10"
              >
                <h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-3 max-w-[28em] text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-line">
        <div className={`${shell} py-24 lg:py-32`}>
          <p data-reveal className="eyebrow">
            {c.team.eyebrow}
          </p>
          <h2
            data-reveal
            style={delay(80)}
            className="mt-6 font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1.02] tracking-[-0.035em]"
          >
            {c.team.title} <span className="block"><AccentText text={c.team.titleAccent} /></span>
          </h2>
          <div className="mt-16 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {c.team.people.map((p, i) => (
              <PersonCard key={p.name} person={p} index={i % 3} />
            ))}
          </div>
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
