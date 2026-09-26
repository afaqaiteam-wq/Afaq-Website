import Link from "next/link";
import type { CSSProperties } from "react";

import { ProcessTrack } from "@/components/services/ProcessTrack";
import { AccentText } from "@/components/ui/AccentText";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { servicesContent } from "@/content/services";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { site } from "@/lib/site";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** What follows the hero story on the home page: the services, how we work, and a closing call. */
export function HomeSections({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { home, common } = dict;
  const services = servicesContent[lang];
  const shell = "mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14";
  const h2 = "mt-6 font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1.02] tracking-[-0.035em]";

  return (
    <>
      {/* Services, one row each, linking into the Services page */}
      <section className="relative border-t border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_50%_0%,rgba(124,77,255,.14),transparent_70%)]"
        />
        <div className={`${shell} relative py-24 lg:py-32`}>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p data-reveal className="eyebrow">
                {home.servicesEyebrow}
              </p>
              <h2 data-reveal style={delay(80)} className={h2}>
                {home.servicesTitle} <span className="block"><AccentText text={home.servicesTitleAccent} /></span>
              </h2>
            </div>
            <p data-reveal style={delay(160)} className="max-w-[30em] text-lg text-muted lg:col-span-5">
              {home.servicesLead}
            </p>
          </div>

          <ol className="mt-16 border-t border-line">
            {services.services.map((s, i) => (
              <li key={s.slug} data-reveal style={delay(50 * i)} className="border-b border-line">
                <Link
                  href={`${href(lang, "/services")}#${s.slug}`}
                  className="group relative grid items-center gap-2 py-7 transition-colors md:grid-cols-12 md:gap-6"
                >
                  <span className="text-xs tracking-[0.2em] text-dim md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[clamp(24px,2.4vw,36px)] font-semibold tracking-[-0.025em] transition-[color,translate] duration-300 group-hover:translate-x-2 group-hover:text-[#d9c6ff] rtl:group-hover:-translate-x-2 md:col-span-5">
                    {s.name}
                  </span>
                  <span className="text-muted md:col-span-5">{s.promise}</span>
                  <span className="hidden justify-end text-muted transition-colors group-hover:text-ink md:col-span-1 md:flex">
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

      {/* How we work */}
      <section className="border-t border-line">
        <div className={`${shell} py-24 lg:py-32`}>
          <p data-reveal className="eyebrow">
            {services.process.eyebrow}
          </p>
          <h2 data-reveal style={delay(80)} className={`${h2} max-w-[18em]`}>
            {services.process.title} <span className="block"><AccentText text={services.process.titleAccent} /></span>
          </h2>
          <ProcessTrack steps={services.process.steps} />
        </div>
      </section>

      {/* Closing */}
      <section className="border-t border-line">
        <div className={`${shell} flex flex-col items-center py-28 text-center lg:py-36`}>
          <h2
            data-reveal
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
