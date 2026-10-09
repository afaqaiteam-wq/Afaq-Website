import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { AccentText } from "@/components/ui/AccentText";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { servicesContent } from "@/content/services";
import { workContent } from "@/content/work";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { site } from "@/lib/site";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * What follows the hero story on the home page: proof first (selected work), then the services
 * list, then a closing call. The hero's constellation already names the services and /services
 * carries the full process, so neither is repeated here.
 */
export function HomeSections({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { home, common } = dict;
  const services = servicesContent[lang];
  const work = workContent[lang];
  const shell = "mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14";
  const h2 = "mt-6 font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1.02] tracking-[-0.035em]";

  return (
    <>
      {/* Selected work: the three projects, each linking to its case study */}
      <section className="relative border-t border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_50%_0%,rgba(124,77,255,.14),transparent_70%)]"
        />
        <div className={`${shell} relative py-24 lg:py-32`}>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p data-reveal className="eyebrow">
                {home.workEyebrow}
              </p>
              <h2 data-reveal="rise" style={delay(80)} className={h2}>
                {home.workTitle} <span className="block"><AccentText text={home.workTitleAccent} /></span>
              </h2>
            </div>
            <p data-reveal style={delay(160)} className="max-w-[30em] text-lg text-muted lg:col-span-5">
              {home.workLead}
            </p>
          </div>

          <ul className="mt-16 grid gap-12 lg:grid-cols-3 lg:gap-6">
            {work.projects.map((p, i) => (
              <li key={p.slug} data-reveal style={delay(90 * i)}>
                <Link
                  href={href(lang, `/work/${p.slug}`)}
                  className="group grid gap-6 md:grid-cols-2 md:items-center md:gap-8 lg:block"
                >
                  <div
                    data-spotlight
                    className="relative overflow-hidden rounded-[16px] border border-white/12 bg-surface p-1.5 shadow-[0_30px_80px_-40px_rgb(124_77_255/0.55)] transition-[translate,border-color,box-shadow] duration-500 group-hover:-translate-y-1.5 group-hover:border-lav/40 group-hover:shadow-[0_40px_90px_-36px_rgb(124_77_255/0.8)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[11px]">
                      <Image
                        src={p.image}
                        alt={p.imageAlt}
                        fill
                        placeholder="blur"
                        sizes="(min-width: 1440px) 440px, (min-width: 1024px) 32vw, (min-width: 768px) 45vw, calc(100vw - 32px)"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                  </div>
                  <div className="lg:mt-6">
                    <p className="flex items-center gap-3 text-xs font-medium tracking-[0.16em] text-dim">
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <span aria-hidden="true" className="h-px w-6 bg-[linear-gradient(90deg,transparent,#a67bff)] rtl:-scale-x-100" />
                      <span className="text-lav">{p.category}</span>
                    </p>
                    <h3 className="mt-3 flex items-start justify-between gap-4 font-display text-[clamp(22px,1.9vw,28px)] font-semibold leading-tight tracking-[-0.025em] transition-colors group-hover:text-lav-hover">
                      {p.name}
                      <ArrowIcon className="mt-2 shrink-0 text-muted transition-[translate,color] duration-300 group-hover:translate-x-1 group-hover:text-ink rtl:group-hover:-translate-x-1" />
                    </h3>
                    <p className="mt-2 text-muted">{p.oneLiner}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-12">
            <Button href={href(lang, "/work")} variant="ghost" arrow>
              {home.workLink}
            </Button>
          </div>
        </div>
      </section>

      {/* Services, one row each, linking into the Services page */}
      <section className="border-t border-line">
        <div className={`${shell} py-24 lg:py-32`}>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p data-reveal className="eyebrow">
                {home.servicesEyebrow}
              </p>
              <h2 data-reveal="rise" style={delay(80)} className={h2}>
                {home.servicesTitle} <span className="block"><AccentText text={home.servicesTitleAccent} /></span>
              </h2>
            </div>
            <p data-reveal style={delay(160)} className="max-w-[30em] text-lg text-muted lg:col-span-5">
              {home.servicesLead}
            </p>
          </div>

          <ol className="mt-16">
            <li aria-hidden="true" data-reveal="line" className="block h-px bg-line" />
            {services.services.map((s, i) => (
              <li key={s.slug} data-reveal style={delay(50 * i)} className="border-b border-line">
                <Link
                  href={`${href(lang, "/services")}#${s.slug}`}
                  className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 py-6 transition-colors md:grid-cols-12 md:gap-6 md:py-7"
                >
                  <span className="text-xs tracking-[0.2em] text-dim md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[clamp(22px,2.4vw,36px)] font-semibold tracking-[-0.025em] transition-[color,translate] duration-300 group-hover:translate-x-2 group-hover:text-lav-hover rtl:group-hover:-translate-x-2 md:col-span-5">
                    {s.name}
                  </span>
                  <span className="col-start-2 row-start-2 text-[15px] text-muted md:col-span-5 md:col-start-auto md:row-start-auto md:text-base">
                    {s.promise}
                  </span>
                  <span className="col-start-3 row-span-2 row-start-1 flex justify-end text-muted transition-colors group-hover:text-ink md:col-span-1 md:col-start-auto md:row-span-1 md:row-start-auto">
                    <ArrowIcon className="transition-[translate] duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                  {/* a line of light that draws under the row on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-[linear-gradient(90deg,transparent,#a67bff,transparent)] transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right"
                  />
                </Link>
              </li>
            ))}
          </ol>

          <div data-reveal className="mt-10">
            <Button href={href(lang, "/services")} variant="ghost" arrow>
              {home.servicesLink}
            </Button>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="relative overflow-hidden border-t border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(124,77,255,.22),transparent_65%)]"
        />
        <div className={`${shell} relative flex flex-col items-center py-28 text-center lg:py-36`}>
          <h2
            data-reveal="rise"
            className="max-w-[16em] font-display text-[clamp(34px,4.8vw,72px)] font-semibold leading-[1.02] tracking-[-0.035em]"
          >
            {home.closingTitle} <span className="block"><AccentText text={home.closingTitleAccent} /></span>
          </h2>
          <p data-reveal style={delay(100)} className="mt-6 max-w-[32em] text-lg text-muted">
            {home.closingLead}
          </p>
          <div data-reveal style={delay(180)} className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href={site.bookingUrl} external arrow>
              {common.bookCall}
            </Button>
            <Button href={href(lang, "/contact")} variant="ghost">
              {home.closingSecondary}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
