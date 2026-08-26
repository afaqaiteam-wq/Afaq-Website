import { motion, useReducedMotion } from "framer-motion";

import { EASE_OUT_QUINT } from "../../../constants/motion";
import { useIsMobile } from "../../../hooks/useIsMobile";
import TechnologyCard from "./TechnologyCard";
import { TECHNOLOGIES } from "./technologies.data";

/**
 * "Technologies We Build With".
 *
 * Continuity with the Hero is deliberate and structural, not just stylistic:
 *
 *  - the container mirrors the Navbar/Hero rails exactly
 *    (max-w-[1180px] px-6 -> lg:w-[1000px] lg:max-w-[82vw] lg:px-0), so the
 *    left edge lines up with the navbar and the Hero copy above it;
 *  - type is Space Grotesk uppercase with negative tracking, echoing the
 *    Hero headline; body copy reuses the Hero paragraph's leading and tone;
 *  - the badge, the twin gradient rules and the card's top-edge highlight are
 *    the same motifs already used in the Hero;
 *  - motion uses the shared easing tokens from constants/motion.ts.
 *
 * Ambience is scoped to this section — the global Background is untouched, and
 * everything here is kept deliberately quieter than the Hero so the Hero stays
 * the focal point.
 */

/** Twin gradient rules — the motif under the Hero wordmark. */
const Rules = () => (
  <div aria-hidden className="mt-8 flex items-center justify-center gap-5">
    <span className="h-px w-16 bg-gradient-to-r from-transparent via-violet-400/70 to-transparent sm:w-20" />
    <span className="h-px w-16 bg-gradient-to-l from-transparent via-violet-400/70 to-transparent sm:w-20" />
  </div>
);

const Technologies = () => {
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();

  // Mobile: no reveal at all — no initial/whileInView/viewport/transition
  // props, so Framer never creates an IntersectionObserver or animation
  // subscription for these elements. Content renders directly in its final
  // state. Desktop keeps the exact original entrance animation.
  const reveal = (delay: number) => {
    if (isMobile) return {};

    return {
      initial: reduced ? { opacity: 0 } : { opacity: 0, y: 22, filter: "blur(8px)" },
      whileInView: reduced
        ? { opacity: 1 }
        : { opacity: 1, y: 0, filter: "blur(0px)" },
      viewport: { once: true, margin: "-80px" } as const,
      transition: {
        duration: reduced ? 0.3 : 0.7,
        delay: reduced ? 0 : delay,
        ease: EASE_OUT_QUINT,
      },
    };
  };

  return (
    <section
      id="technologies"
      className="
        relative overflow-hidden
        pt-[clamp(96px,13vw,168px)]
        pb-[clamp(88px,11vw,148px)]
      "
    >
      {/* Section ambience — intentionally softer than the Hero's */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Hairline seam, so the section reads as a continuation not a break */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        {/* Soft violet key light behind the grid */}
        <div
          className="absolute left-1/2 top-[38%] h-[620px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(79,40,183,.16) 0%, rgba(79,40,183,.06) 46%, transparent 72%)",
          }}
        />

        {/* Grid texture — same 72px rhythm as the global background, fading out */}
        <div
          className="
            absolute inset-0 opacity-[0.03]
            [background-image:linear-gradient(rgba(255,255,255,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.09)_1px,transparent_1px)]
            [background-size:72px_72px]
            [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,black,transparent_78%)]
          "
        />
      </div>

      <div
        className="
          relative mx-auto w-full
          max-w-[1180px] px-6
          lg:w-[min(82vw,1440px)] lg:max-w-none lg:px-0
        "
      >
        {/*
          ── Header ───────────────────────────────────────────

          Optical shift onto the Navbar logo's axis.

          The Navbar's desktop grid is grid-cols-[300px_auto_380px]; the right
          column is 80px wider than the left, so the centre cell holding the
          logo sits (380−300)/2 = 40px left of the pill's true centre.

          Gated at 1180px, NOT at lg (1024). Measured: below 1180 the navbar
          grid overflows its pill — it needs 876px of track but only has 774px
          at 1024 — which throws the logo off the −40px model entirely (+11px
          at 1024, −20px at 1100). From 1180 up the grid fits and the offset is
          a clean, constant −40px at every width.

          Applied as a transform, not a margin: it moves nothing in layout, so
          widths, the container and the card grid below are untouched.

          Trade-off, deliberately accepted: above 1180px the header block sits
          40px left of the card grid beneath it.
        */}
        <div className="flex flex-col items-center text-center min-[1180px]:-translate-x-[40px]">
          <motion.span
            {...reveal(0)}
            className="
              inline-flex w-fit items-center gap-3 rounded-full
              border border-violet-500/20 bg-violet-500/5
              px-9 py-3.5
              text-[13px] font-semibold uppercase tracking-[0.2em] text-violet-300
              shadow-[0_0_20px_rgba(79,40,183,.15)]
              sm:text-[14px]
            "
          >
            ✦ Our Stack
          </motion.span>

          <motion.h2
            {...reveal(0.09)}
            className="
              mt-9
              font-['Space_Grotesk']
              text-[32px] sm:text-[40px] lg:text-[47px]
              font-bold uppercase
              leading-[1.04] tracking-[-0.035em]
              text-white
            "
          >
            Technologies We Build With
          </motion.h2>

          <motion.p
            {...reveal(0.16)}
            className="
              mt-7 max-w-[680px]
              text-[15px] lg:text-[16px]
              leading-[1.9] text-white/60
            "
          >
            We leverage world-class AI models, automation platforms and modern
            technologies to build scalable intelligent solutions.
          </motion.p>

          <Rules />
        </div>

        {/* ── Grid ───────────────────────────────────────────── */}
        <ul
          className="
            mt-[clamp(48px,6vw,72px)]
            grid grid-cols-2 gap-3
            sm:gap-4
            md:grid-cols-3
            lg:grid-cols-6
          "
        >
          {TECHNOLOGIES.map((tech, i) => (
            <li key={tech.name}>
              <TechnologyCard tech={tech} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Technologies;
