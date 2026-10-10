"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef } from "react";

import logo from "@/assets/brand/logo.png";
// The sweep only needs the logo's shape, so its mask uses a small copy instead of the 1.4 MB original.
import logoMask from "@/assets/brand/logo-mask.webp";
import { Button } from "@/components/ui/Button";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { site } from "@/lib/site";

import { LABELS } from "./constellation";
import { startHero, type HeroPanel } from "./engine";
import { BODIES } from "./orbits";
import { EVENODD, TOOL_LOGOS } from "./toolLogos";

/*
 * The home page opening: one pinned stage, four scenes, driven by scroll.
 *   1. Ignition       a warp through the stars, the logo's star lights, the mark resolves
 *   2. Orbits         the tools we build with orbit the mark as planets on real (Keplerian) orbits
 *   3. Constellation  the tools fly to stars that draw the A; each service star lights in turn
 *   4. Finale         the lines pull into the guiding star, a flash, the mark returns with the CTA
 * This component only renders the DOM; ./engine.ts animates it.
 */

/**
 * Splits a line into word spans so the engine can reveal them one by one.
 *  gives the words the logo's silver, with a light sweeping across them in turn.
 */
function Words({ text, chrome = false }: { text: string; chrome?: boolean }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span
            data-word
            className={`inline-block will-change-[transform,opacity] ${chrome ? "text-accent" : ""}`}
            style={chrome ? { animationDelay: `${i * 0.09}s` } : undefined}
          >
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

interface HeroStoryProps {
  lang: Locale;
  hero: Dictionary["hero"];
  bookCall: string;
}

export function HeroStory({ lang, hero, bookCall }: HeroStoryProps) {
  const storyRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rtl = lang === "ar";

  useEffect(() => {
    const story = storyRef.current!;
    const stage = stageRef.current!;
    const q = <T extends Element>(sel: string) => [...stage.querySelectorAll<T>(sel)];
    const one = <T extends Element>(sel: string) => stage.querySelector<T>(sel)!;
    const panels: HeroPanel[] = q<HTMLElement>("[data-panel]").map((root) => ({
      root,
      words: [...root.querySelectorAll<HTMLElement>("[data-word]")],
      rest: [...root.querySelectorAll<HTMLElement>("[data-rest]")],
    }));
    return startHero(
      {
        story,
        stage,
        back: one<HTMLCanvasElement>("[data-layer=back]"),
        front: one<HTMLCanvasElement>("[data-layer=front]"),
        logo: one<HTMLElement>("[data-logo]"),
        glow: one<HTMLElement>("[data-glow]"),
        ignite: one<HTMLElement>("[data-ignite]"),
        flash: one<HTMLElement>("[data-flash]"),
        chips: q<HTMLElement>("[data-chip]"),
        chipPills: q<HTMLElement>("[data-pill]"),
        chipLabels: q<HTMLElement>("[data-chip-label]"),
        chipStars: q<HTMLElement>("[data-star]"),
        labels: q<HTMLElement>("[data-label]"),
        flare: one<SVGGElement>("[data-flare]"),
        waves: q<SVGCircleElement>("[data-wave]"),
        svg: one<SVGSVGElement>("[data-svg]"),
        panels,
        hint: stage.querySelector<HTMLElement>("[data-hint]"),
        dots: q<HTMLElement>("[data-dot]"),
      },
      { rtl },
    );
  }, [rtl]);

  const panel = "absolute z-[8]";
  // Scenes 2 and 3 share one text column with a fixed top, so the eyebrow never jumps. On wide
  // screens it starts on the navbar's edge and its middle sits level with the system beside it
  // (52% of the stage, see c2 in engine.ts).
  const sidePanel = `${panel} invisible inset-x-4 top-[56%] text-center min-[1100px]:top-[calc(52%_-_7rem)] min-[1100px]:w-[min(520px,36vw)] min-[1100px]:text-start min-[1100px]:start-[max(3.5rem,calc((100%_-_1440px)/2_+_3.5rem))] min-[1100px]:end-auto`;
  const h2 = "mt-4 font-display text-[clamp(28px,3.4vw,48px)] font-semibold leading-[1.08] tracking-[-0.035em]";
  const lead = "mt-4 text-[clamp(15px,1.15vw,18px)] text-muted";
  // Drawing layers fade out under the navbar instead of being cut by it.
  const underNav = "[mask-image:linear-gradient(to_bottom,transparent_0,black_120px)]";

  return (
    <section ref={storyRef} className="relative h-[265vh] sm:h-[340vh]" aria-label={hero.eyebrow}>
      <div
        ref={stageRef}
        className="sticky top-0 h-svh overflow-hidden [--logo-size:min(58vw,28vh)] [--logo-y:30%] min-[1100px]:[--logo-size:min(32vh,300px)] min-[1100px]:[--logo-y:36%]"
      >
        <canvas data-layer="back" className="absolute inset-0 z-0 h-full w-full" aria-hidden="true" />

        <div
          data-glow
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[var(--logo-y)] z-[1] size-[calc(var(--logo-size)*2.8)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,77,255,.28)_0%,rgba(124,77,255,.08)_34%,transparent_64%)] opacity-0"
        />

        <div
          data-logo
          data-intro
          className="absolute left-1/2 top-[var(--logo-y)] z-[3] size-[var(--logo-size)] -translate-x-1/2 -translate-y-1/2 will-change-[transform,opacity,filter]"
        >
          <Image src={logo} alt="Afaq AI" fill priority sizes="(min-width: 1100px) 300px, 58vw" className="object-contain" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{
              maskImage: `url(${logoMask.src})`,
              WebkitMaskImage: `url(${logoMask.src})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          >
            <i className="animate-sweep absolute inset-y-0 w-[38%] [transform:translateX(-160%)_skewX(-18deg)] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent)]" />
          </div>
          <div
            aria-hidden="true"
            className="animate-glint pointer-events-none absolute left-1/2 top-[26%] size-[36%] bg-[radial-gradient(circle,rgba(255,255,255,.95)_0%,rgba(255,255,255,.22)_18%,transparent_55%)]"
          />
        </div>

        <div
          data-ignite
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[calc(var(--logo-y)_-_var(--logo-size)*0.24)] z-[4] size-[calc(var(--logo-size)*1.1)] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,rgba(230,218,255,.6)_10%,rgba(200,168,255,.14)_32%,transparent_62%)] opacity-0"
        />

        <canvas data-layer="front" className={`pointer-events-none absolute inset-0 z-[5] h-full w-full ${underNav}`} aria-hidden="true" />

        {BODIES.map((body) => (
          <div
            key={body.name}
            data-chip
            aria-hidden="true"
            dir="ltr"
            className="pointer-events-none absolute left-0 top-0 z-[2] size-[34px] opacity-0 will-change-[transform,opacity] [--lit:0]"
          >
            {/* The planet: a small glass sphere carrying the tool's logo. It fades away as the tool becomes a star. */}
            <span
              data-pill
              className="absolute inset-0 flex items-center justify-center rounded-full border border-white/15 bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,.16),rgba(26,20,42,.94)_58%,rgba(10,8,18,.96))] shadow-[inset_0_1px_0_rgba(255,255,255,.2),inset_0_-6px_12px_rgba(0,0,0,.45),0_8px_22px_rgba(0,0,0,.5)]"
            >
              <svg viewBox="0 0 24 24" className="size-4 text-[#f1edf8]" fill="currentColor" aria-hidden="true">
                {TOOL_LOGOS[body.name].map((d, i) => (
                  <path key={i} d={d} fillRule={EVENODD.has(body.name) ? "evenodd" : "nonzero"} />
                ))}
              </svg>
            </span>
            <span
              data-chip-label
              className="absolute left-1/2 top-[40px] -translate-x-1/2 whitespace-nowrap text-[11.5px] font-medium tracking-[0.02em] text-soft"
            >
              {body.name}
            </span>
            <span
              data-star
              className="absolute left-1/2 top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ede4ff] opacity-0 [box-shadow:0_0_calc(10px_+_var(--lit)*14px)_#c8a8ff,0_0_calc(22px_+_var(--lit)*26px)_rgba(200,168,255,.5)]"
            />
          </div>
        ))}

        {LABELS.map((lab) => (
          <span
            key={lab.key}
            data-label
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-[7] whitespace-nowrap text-[15px] font-medium text-[#e8e2f4] opacity-0 will-change-[transform,opacity]"
          >
            {hero.constellation[lab.key]}
          </span>
        ))}

        <svg data-svg className={`pointer-events-none absolute inset-0 z-[7] h-full w-full overflow-visible ${underNav}`} aria-hidden="true">
          <defs>
            <radialGradient id="hero-flare">
              <stop offset="0" stopColor="#fff" stopOpacity="1" />
              <stop offset=".25" stopColor="#e6daff" stopOpacity=".5" />
              <stop offset="1" stopColor="#c8a8ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle data-wave r={0} fill="none" stroke="rgba(226,210,255,.75)" strokeWidth={1.3} opacity={0} />
          <circle data-wave r={0} fill="none" stroke="rgba(200,168,255,.6)" strokeWidth={1} opacity={0} />
          <g data-flare opacity={0}>
            <circle r={48} fill="url(#hero-flare)" />
            <path d="M0 -44 L4 -4 L44 0 L4 4 L0 44 L-4 4 L-44 0 L-4 -4 Z" fill="#fff" />
            <path d="M0 -22 L2.5 -2.5 L22 0 L2.5 2.5 L0 22 L-2.5 2.5 L-22 0 L-2.5 -2.5 Z" fill="#fff" opacity={0.8} transform="rotate(45)" />
          </g>
        </svg>

        <div
          data-flash
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-[7] size-[640px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.95)_0%,rgba(236,226,255,.5)_7%,rgba(200,168,255,.14)_22%,transparent_52%)] opacity-0 mix-blend-screen"
        />

        {/* Scene 1 */}
        <div
          data-panel
          data-intro
          className={`${panel} inset-x-4 top-[calc(var(--logo-y)_+_var(--logo-size)*0.5_+_4px)] mx-auto max-w-[1000px] text-center`}
        >
          <p data-rest className="eyebrow">
            {hero.eyebrow}
          </p>
          <h1 className="mx-auto mt-4 max-w-[16em] font-display text-[clamp(34px,4.6vw,64px)] font-semibold leading-[1.04] tracking-[-0.035em]">
            <Words text={hero.title} /> <span className="block"><Words text={hero.titleAccent} chrome /></span>
          </h1>
          <p data-rest className="mx-auto mt-4 max-w-[36em] text-[clamp(16px,1.2vw,18px)] text-muted">
            <span className="hidden sm:inline">{hero.lead}</span>
            <span className="sm:hidden">{hero.leadShort}</span>
          </p>
          <div data-rest className="mt-7 flex flex-wrap justify-center gap-3">
            <Button href={site.bookingUrl} external arrow>
              {bookCall}
            </Button>
            <Button href={href(lang, "/services")} variant="ghost">
              {hero.secondary}
            </Button>
          </div>
        </div>

        {/* Scene 2 */}
        <div data-panel className={sidePanel}>
          <p data-rest className="eyebrow">
            {hero.stack.eyebrow}
          </p>
          <h2 className={h2}>
            <Words text={hero.stack.title} /> <span className="block"><Words text={hero.stack.titleSoft} chrome /></span>
          </h2>
          <p data-rest className={lead}>
            {hero.stack.lead}
          </p>
        </div>

        {/* Scene 3 */}
        <div data-panel className={sidePanel}>
          <p data-rest className="eyebrow">
            {hero.services.eyebrow}
          </p>
          <h2 className={h2}>
            <Words text={hero.services.title} /> <span className="block"><Words text={hero.services.titleSoft} chrome /></span>
          </h2>
          <p data-rest className={`${lead} hidden min-[1100px]:block`}>
            {hero.services.lead}
          </p>
          {/* Phones can't fit the star labels, so the six services are listed here.
              On desktop the list stays available to screen readers. */}
          <ul data-rest className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-x-4 gap-y-2 text-start text-[15px] text-soft min-[1100px]:sr-only">
            {LABELS.map((lab) => (
              <li key={lab.key} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-lav" />
                {hero.constellation[lab.key]}
              </li>
            ))}
          </ul>
        </div>

        <div
          data-hint
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 z-[8] hidden -translate-x-1/2 flex-col items-center gap-2.5 text-[11px] uppercase tracking-[0.26em] text-dim opacity-0 min-[1100px]:[@media(min-height:900px)]:flex"
        >
          {hero.scroll}
          <span className="animate-scroll-hint h-8 w-px origin-top bg-gradient-to-b from-lav to-transparent" />
        </div>

        <div aria-hidden="true" className="absolute start-6 top-1/2 z-[8] hidden -translate-y-1/2 flex-col gap-3.5 min-[1100px]:flex">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              data-dot
              className="size-1.5 rounded-full bg-white/25 transition-[background-color,scale] duration-300 data-active:scale-150 data-active:bg-lav"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
