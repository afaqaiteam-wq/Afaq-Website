import { motion, useReducedMotion } from "framer-motion";

import { EASE_OUT_QUINT } from "../../../constants/motion";
import { useIsMobile } from "../../../hooks/useIsMobile";
import Stats from "./Stats";
import WhyCard from "./WhyCard";
import { FEATURES } from "./features.data";

/**
 * "Why Industry Leaders Choose AFAQ AI".
 *
 * Composition is deliberately asymmetric rather than a six-up grid:
 *
 *   lg   ┌───────────────┬────────┐
 *        │   FEATURE     │ medium │      one dominant block carries the
 *        │   (2 cols,    ├────────┤      argument, two supporting blocks
 *        │    2 rows)    │ medium │      qualify it, three compact rows
 *        └───────────────┴────────┘      close the rhythm, and the stat
 *        [ compact | compact | compact ] band lands the proof.
 *        [        STAT BAND           ]
 *
 *   md   feature full width, mediums side by side, compacts in three
 *   sm   feature, then mediums stacked, then compacts as rows — the tier
 *        change keeps the vertical order from reading as one long stack
 *
 * Continuity is structural: identical container rails to Navbar/Hero/
 * Technologies/Services/About, the same badge + two-line heading + twin
 * rules, the same −40px optical shift onto the Navbar logo axis, and the
 * shared easing tokens.
 */

const Rules = () => (
  <div aria-hidden className="mt-9 flex items-center justify-center gap-5">
    <span className="h-px w-16 bg-gradient-to-r from-transparent via-violet-400/70 to-transparent sm:w-20" />
    <span className="h-px w-16 bg-gradient-to-l from-transparent via-violet-400/70 to-transparent sm:w-20" />
  </div>
);

const WhyChoose = () => {
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();

  const feature = FEATURES[0];
  const mediums = FEATURES.filter((f) => f.tier === "medium");
  const compacts = FEATURES.filter((f) => f.tier === "compact");

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
      id="why-choose"
      /* Clears the fixed navbar when the "Why Us" nav link jumps here. */
      className="
        relative overflow-hidden
        scroll-mt-[124px]
        pt-[clamp(96px,13vw,168px)]
        pb-[clamp(88px,11vw,148px)]
      "
    >
      {/* Section ambience — offset from the About pool so the two do not read
          as the same stamp, and kept quieter than the Hero. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        <div
          className="absolute left-[22%] top-[32%] h-[600px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(79,40,183,.15) 0%, rgba(79,40,183,.05) 44%, transparent 72%)",
          }}
        />
        <div
          className="absolute right-[6%] bottom-[10%] h-[520px] w-[700px] translate-x-1/2 translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(117,73,216,.12) 0%, rgba(117,73,216,.04) 46%, transparent 72%)",
          }}
        />

        <div
          className="
            absolute inset-0 opacity-[0.028]
            [background-image:linear-gradient(rgba(255,255,255,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.09)_1px,transparent_1px)]
            [background-size:72px_72px]
            [mask-image:radial-gradient(ellipse_74%_62%_at_50%_44%,black,transparent_80%)]
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
        {/* ── Header ─────────────────────────────────────────
            Same −40px optical shift as the other sections, gated at 1180px
            where the Navbar grid stops overflowing. See Technologies.tsx. */}
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
            ✦ Why Choose Afaq
          </motion.span>

          <motion.h2
            {...reveal(0.09)}
            className="
              mt-9
              font-['Space_Grotesk']
              text-[32px] sm:text-[40px] lg:text-[47px]
              font-bold uppercase
              leading-[1.06] tracking-[-0.035em]
              text-white
            "
          >
            <span className="block">Why Industry Leaders</span>
            <span className="block text-violet-400">Choose AFAQ AI</span>
          </motion.h2>

          <motion.p
            {...reveal(0.16)}
            className="
              mt-7 max-w-[680px]
              text-[15px] lg:text-[16px]
              leading-[1.9] text-white/60
            "
          >
            We don&rsquo;t simply build AI solutions. We engineer scalable
            intelligent systems that transform how ambitious companies operate,
            automate and grow.
          </motion.p>

          <Rules />
        </div>

        {/* ── Composition ────────────────────────────────────── */}
        <div className="mt-[clamp(52px,6.5vw,80px)] flex flex-col gap-5 sm:gap-6">
          {/* Row 1 — feature beside a stacked pair */}
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <WhyCard feature={feature} index={0} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-1">
              {mediums.map((f, i) => (
                <WhyCard key={f.id} feature={f} index={i + 1} />
              ))}
            </div>
          </div>

          {/* Row 2 — three compact rows */}
          <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
            {compacts.map((f, i) => (
              <WhyCard key={f.id} feature={f} index={i + 3} />
            ))}
          </div>
        </div>

        {/* ── Proof ──────────────────────────────────────────── */}
        <div className="mt-[clamp(44px,5vw,64px)]">
          <Stats />
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;