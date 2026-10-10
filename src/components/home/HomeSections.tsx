import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { CopyEmail } from "@/components/contact/CopyEmail";
import { AccentText } from "@/components/ui/AccentText";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { LivePlanet } from "@/components/ui/LivePlanet";
import { PlanetHorizon } from "@/components/ui/PlanetHorizon";
import { ToolPill } from "@/components/ui/ToolPill";
import { aboutContent } from "@/content/about";
import { servicesContent } from "@/content/services";
import { workContent, type Project } from "@/content/work";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { site } from "@/lib/site";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// The glassy card every block on this page sits in (the same surface as the Contact cards).
const card =
  "relative overflow-hidden rounded-[28px] border border-line bg-[linear-gradient(180deg,rgb(255_255_255/0.035),rgb(255_255_255/0.008))] shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]";
const topLight = "absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,#c8a8ff,transparent)]";

/**
 * What follows the hero story on the home page: proof first (selected work as a showcase),
 * then the services as a grid, a glimpse of the people behind them, and a closing card.
 * The hero's constellation already names the services and /services carries the full
 * process, so neither is repeated here.
 */
export function HomeSections({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { home, common, contact } = dict;
  const services = servicesContent[lang].services;
  const [lead, ...others] = workContent[lang].projects;
  const people = aboutContent[lang].team.people;
  const founder = people.find((p) => p.tier === 1)!;
  const team = people.filter((p) => p !== founder).sort((a, b) => a.tier - b.tier);
  const [open, close] = lang === "ar" ? ["«", "»"] : ["“", "”"];

  const shell = "mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14";
  const h2 = "mt-6 font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1.02] tracking-[-0.035em]";
  const lede = "max-w-[30em] text-lg text-muted lg:col-span-5";

  const projectMeta = (p: Project, i: number) => (
    <p className="flex items-center gap-3 text-xs font-medium tracking-[0.16em] text-dim">
      <span dir="ltr">{String(i + 1).padStart(2, "0")}</span>
      <span aria-hidden="true" className="h-px w-6 bg-[linear-gradient(90deg,transparent,#a67bff)] rtl:-scale-x-100" />
      <span className="text-lav">{p.category}</span>
    </p>
  );

  // A readable crop on phones, the whole dashboard from tablets up (as on the Work page).
  const screens = (p: Project, sizes: string) => (
    <>
      <Image
        src={p.mobileImage}
        alt={p.imageAlt}
        placeholder="blur"
        sizes="calc(100vw - 56px)"
        className="h-auto w-full rounded-[11px] md:hidden"
      />
      <Image
        src={p.image}
        alt={p.imageAlt}
        placeholder="blur"
        sizes={sizes}
        className="hidden h-auto w-full rounded-[11px] transition-transform duration-700 group-hover:scale-[1.02] md:block"
      />
    </>
  );
  const frame =
    "relative overflow-hidden rounded-[16px] border border-white/12 bg-surface p-1.5 shadow-[0_40px_100px_-40px_rgb(124_77_255/0.7)]";

  return (
    <>
      {/* the horizon: where the story ends and the page begins */}
      <div className={shell}>
        <div
          data-reveal="line"
          aria-hidden="true"
          className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(166,123,255,.8)_50%,transparent)] shadow-[0_0_24px_rgba(140,92,255,.6)]"
        />
      </div>

      {/* Selected work: one project up front, the other two beside each other */}
      <section className="relative">
        <div className={`${shell} relative pb-12 pt-20 lg:pb-16 lg:pt-28`}>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <p data-reveal className="eyebrow">
                {home.workEyebrow}
              </p>
              <h2 data-reveal="rise" style={delay(80)} className={h2}>
                {home.workTitle} <span className="block"><AccentText text={home.workTitleAccent} /></span>
              </h2>
            </div>
            <p data-reveal style={delay(160)} className={lede}>
              {home.workLead}
            </p>
          </div>

          <div data-reveal className="mt-12 lg:mt-16">
            <Link
              href={href(lang, `/work/${lead.slug}`)}
              data-spotlight
              className={`${card} group grid transition-colors duration-500 hover:border-lav/35 lg:grid-cols-12`}
            >
              <div aria-hidden="true" className={topLight} />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-48 start-[12%] size-[560px] rounded-full bg-[radial-gradient(circle,rgb(124_77_255/0.24),transparent_68%)]"
              />
              <div className="relative p-3 sm:p-6 lg:col-span-8 lg:p-10 lg:pe-4">
                <div className={`work-tilt ${frame}`}>
                  {screens(lead, "(min-width: 1440px) 860px, (min-width: 1024px) 60vw, calc(100vw - 112px)")}
                </div>
                {/* the same screen up close, lifted off the dashboard so it can be read */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-3 end-0 hidden w-[34%] overflow-hidden rounded-[14px] border border-white/15 bg-surface p-1 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.85),0_0_0_1px_rgb(200_168_255/0.1)] transition-transform duration-700 group-hover:-translate-y-2 lg:block"
                >
                  <Image src={lead.mobileImage} alt="" sizes="320px" className="h-auto w-full rounded-[10px]" />
                </div>
              </div>
              <div className="relative flex flex-col justify-center px-6 pb-8 pt-3 sm:px-10 sm:pb-10 lg:col-span-4 lg:py-12 lg:pe-12 lg:ps-10">
                {projectMeta(lead, 0)}
                <h3 className="mt-4 font-display text-[clamp(26px,2.6vw,40px)] font-semibold leading-[1.08] tracking-[-0.03em]">
                  {lead.name}
                </h3>
                <p className="mt-3 text-lg text-muted">{lead.oneLiner}</p>
                <span className="btn-ghost mt-8 inline-flex h-12 w-fit items-center gap-2.5 rounded-pill px-6 text-[15px] font-medium">
                  {home.workView}
                  <ArrowIcon className="btn-arrow" />
                </span>
              </div>
            </Link>
          </div>

          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {others.map((p, i) => (
              <li key={p.slug} data-reveal style={delay(90 * (i + 1))}>
                <Link
                  href={href(lang, `/work/${p.slug}`)}
                  data-spotlight
                  className={`${card} group flex h-full flex-col transition-colors duration-500 hover:border-lav/35`}
                >
                  <div aria-hidden="true" className={topLight} />
                  <div className="p-3 sm:p-6">
                    <div className={frame}>
                      {screens(p, "(min-width: 1440px) 620px, (min-width: 768px) 44vw, calc(100vw - 56px)")}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col px-6 pb-8 pt-3 sm:px-8">
                    {projectMeta(p, i + 1)}
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

          <div data-reveal className="mt-10">
            <Button href={href(lang, "/work")} variant="ghost" arrow>
              {home.workLink}
            </Button>
          </div>
        </div>
      </section>

      {/* Services as a grid: the two we're asked for most up front, with the tools behind them */}
      <section>
        <div className={`${shell} py-16 lg:py-24`}>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <p data-reveal className="eyebrow">
                {home.servicesEyebrow}
              </p>
              <h2 data-reveal="rise" style={delay(80)} className={h2}>
                {home.servicesTitle} <span className="block"><AccentText text={home.servicesTitleAccent} /></span>
              </h2>
            </div>
            <p data-reveal style={delay(160)} className={lede}>
              {home.servicesLead}
            </p>
          </div>

          <ol className="mt-12 grid gap-3 sm:gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-12">
            {services.map((s, i) => {
              const big = i < 2;
              return (
                <li key={s.slug} data-reveal style={delay(60 * i)} className={big ? "lg:col-span-6" : "lg:col-span-3"}>
                  <Link
                    href={`${href(lang, "/services")}#${s.slug}`}
                    data-spotlight
                    className={`${card} group flex h-full flex-col p-5 transition-colors duration-500 hover:border-lav/35 sm:p-8 ${big ? "lg:min-h-[280px]" : "lg:min-h-[250px]"}`}
                  >
                    <div
                      aria-hidden="true"
                      className={`${topLight} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    />
                    {big && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -end-24 -top-24 size-64 rounded-full bg-[radial-gradient(circle,rgb(124_77_255/0.2),transparent_68%)]"
                      />
                    )}
                    <div className="flex items-center justify-between gap-4">
                      <span dir="ltr" className="text-xs tracking-[0.2em] text-lav/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        aria-hidden="true"
                        className="grid size-9 place-items-center sm:size-10 rounded-full border border-white/10 bg-white/[0.03] text-muted transition-colors duration-300 group-hover:border-lav/40 group-hover:text-ink"
                      >
                        <ArrowIcon className="transition-[translate] duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                      </span>
                    </div>
                    <h3
                      className={`mt-3 font-display font-semibold sm:mt-6 leading-[1.1] tracking-[-0.025em] transition-colors group-hover:text-lav-hover lg:mt-auto lg:pt-10 ${big ? "text-[clamp(24px,2.4vw,36px)]" : "text-[clamp(22px,1.7vw,26px)]"}`}
                    >
                      {s.name}
                    </h3>
                    <p className="mt-2 text-[15px] text-muted md:text-base">{s.promise}</p>
                    {big && (
                      <div className="mt-6 hidden flex-wrap gap-2 sm:flex">
                        {s.tech.slice(0, 3).map((t) => (
                          <ToolPill key={t} name={t} />
                        ))}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>

          <div data-reveal className="mt-10">
            <Button href={href(lang, "/services")} variant="ghost" arrow>
              {home.servicesLink}
            </Button>
          </div>
        </div>
      </section>

      {/* The people behind the work: the founder's line and the team, one band, linking to About */}
      <section aria-labelledby="home-team">
        <div className={`${shell} pb-6 lg:pb-8`}>
          <div data-reveal className={`${card} grid gap-10 p-7 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-14`}>
            <div aria-hidden="true" className={topLight} />
            <div className="relative lg:col-span-8">
              <p id="home-team" className="eyebrow">
                {home.teamEyebrow}
              </p>
              <blockquote className="mt-6 font-display text-[clamp(24px,2.6vw,38px)] font-semibold leading-[1.2] tracking-[-0.025em] rtl:leading-[1.45]">
                {open}
                {founder.quote}
                {close}
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <Image
                  src={founder.photo}
                  alt=""
                  sizes="56px"
                  className="size-14 rounded-full object-cover object-[50%_28%] ring-1 ring-lav/30"
                />
                <p className="leading-snug">
                  <span className="block font-medium">{founder.name}</span>
                  <span className="text-sm text-muted">{founder.role}</span>
                </p>
              </div>
            </div>
            <div className="relative border-t border-line pt-8 lg:col-span-4 lg:border-s lg:border-t-0 lg:ps-12 lg:pt-0">
              <p className="text-sm text-soft">{home.teamWith}</p>
              <ul className="mt-4 flex">
                {team.map((m) => (
                  <li key={m.name} className="-ms-3 first:ms-0">
                    <Image
                      src={m.photo}
                      alt={m.name}
                      title={`${m.name} · ${m.role}`}
                      sizes="56px"
                      className="size-12 rounded-full object-cover object-[50%_28%] ring-2 ring-bg sm:size-14"
                    />
                  </li>
                ))}
              </ul>
              <Button href={href(lang, "/about")} variant="ghost" arrow className="mt-8">
                {home.teamLink}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Closing: one card over the curve of a planet at sunrise */}
      <section>
        <div className={`${shell} pb-20 pt-4 lg:pb-28`}>
          <div
            data-reveal
            className={`${card} flex flex-col items-center border-lav/25 px-6 pb-36 pt-16 text-center sm:px-10 lg:pb-52 lg:pt-24`}
          >
            <div aria-hidden="true" className={topLight} />
            {/* a few far stars over the planet */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(1px_1px_at_14%_22%,rgba(255,255,255,.5),transparent),radial-gradient(1px_1px_at_31%_64%,rgba(255,255,255,.3),transparent),radial-gradient(1.5px_1.5px_at_47%_12%,rgba(226,214,255,.45),transparent),radial-gradient(1px_1px_at_68%_38%,rgba(255,255,255,.35),transparent),radial-gradient(1px_1px_at_86%_18%,rgba(255,255,255,.4),transparent),radial-gradient(1px_1px_at_92%_58%,rgba(255,255,255,.25),transparent),radial-gradient(1px_1px_at_6%_52%,rgba(255,255,255,.3),transparent)] bg-[length:520px_420px] opacity-70"
            />
            <LivePlanet className="absolute inset-x-0 bottom-0 h-[220px] lg:h-[340px]">
              <PlanetHorizon id="home-planet" className="block h-[150px] w-full lg:h-[230px]" />
            </LivePlanet>
            <h2 className="relative max-w-[16em] font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1.04] tracking-[-0.035em]">
              {home.closingTitle} <span className="block"><AccentText text={home.closingTitleAccent} /></span>
            </h2>
            <p className="relative mt-6 max-w-[32em] text-lg text-muted">{home.closingLead}</p>
            <div className="relative mt-10 flex flex-wrap justify-center gap-3">
              <Button href={site.bookingUrl} external arrow>
                {common.bookCall}
              </Button>
              <CopyEmail email={site.email} label={contact.direct.copy} done={contact.direct.copied} />
            </div>
            <p className="relative mt-6 text-sm text-dim">
              {home.closingOr}{" "}
              <a href={`mailto:${site.email}`} dir="ltr" className="text-soft underline-offset-4 transition-colors hover:text-ink hover:underline">
                {site.email}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
