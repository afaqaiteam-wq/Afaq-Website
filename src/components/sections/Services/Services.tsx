import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EASE_OUT_QUINT } from "../../../constants/motion";
import { useIsMobile } from "../../../hooks/useIsMobile";
import ServiceCard from "./ServiceCard";
import ServiceModal from "./ServiceModal";
import { SERVICES, type Service } from "./services.data";

/**
 * "AI Services That Scale Your Business".
 *
 * Continuity is structural rather than decorative:
 *
 *  - the container mirrors the Navbar/Hero/Technologies rails exactly
 *    (max-w-[1180px] px-6 → lg:w-[1000px] lg:max-w-[82vw] lg:px-0), so all
 *    four share one left edge;
 *  - the heading takes the Hero's two-line treatment with a single violet
 *    accent line, rather than repeating the Technologies header verbatim —
 *    same vocabulary, different sentence;
 *  - the badge, twin gradient rules and card top-edge highlight are motifs
 *    already established in the Hero;
 *  - motion runs on the shared easing tokens in constants/motion.ts.
 *
 * Ambience is scoped to this section; the global Background is untouched and
 * everything here is kept quieter than the Hero so the Hero stays dominant.
 */

/** Twin gradient rules — the motif from beneath the Hero wordmark. */
const Rules = () => (
  <div aria-hidden className="mt-9 flex items-center justify-center gap-5">
    <span className="h-px w-16 bg-gradient-to-r from-transparent via-violet-400/70 to-transparent sm:w-20" />
    <span className="h-px w-16 bg-gradient-to-l from-transparent via-violet-400/70 to-transparent sm:w-20" />
  </div>
);

const Services = () => {
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();

  /**
   * The open service is held here rather than per-card so only one modal ever
   * exists, and AnimatePresence in ServiceModal can play the exit animation
   * against a single mount point.
   */
  const [active, setActive] = useState<Service | null>(null);
  const openService = useCallback((service: Service) => setActive(service), []);
  const closeService = useCallback(() => setActive(null), []);

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
      id="services"
      /* scroll-mt clears the fixed navbar (20px offset + 80px tall) when the
         Navbar's existing "Services" link jumps to this anchor. max-sm:pt
         gives this page's own first section (below `sm` only — tablet/
         desktop untouched) more breathing room under the fixed navbar than
         the shared clamp's 96px floor, which sits close enough to the
         navbar's own ~100px height to read as cramped when this is the very
         first thing on the page rather than a section scrolled into. */
      className="
        relative overflow-hidden
        scroll-mt-[124px]
        max-sm:pt-[136px]
        pt-[clamp(96px,13vw,168px)]
        pb-[clamp(88px,11vw,148px)]
      "
    >
      {/* Section ambience — quieter than the Hero, and offset from the
          Technologies glow so the two do not read as the same stamp. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Hairline seam, so the section continues rather than starts */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        {/* Two offset pools rather than one centred stamp */}
        <div
          className="absolute left-[16%] top-[26%] h-[560px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(79,40,183,.15) 0%, rgba(79,40,183,.05) 44%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-[10%] bottom-[14%] h-[520px] w-[660px] translate-x-1/2 translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(117,73,216,.13) 0%, rgba(117,73,216,.04) 46%, transparent 72%)",
          }}
        />

        {/* Grid texture on the same 72px rhythm as the global background */}
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
        {/*
          ── Header ───────────────────────────────────────────

          Shifted onto the Navbar logo's axis: the Navbar's asymmetric
          grid-cols-[300px_auto_380px] puts the logo cell (380−300)/2 = 40px
          left of the pill's (and viewport's) true centre, so matching it
          means the whole badge/heading/description/divider group moves as
          one unit rather than sitting on the container's own true centre.
          Gated at 1180px, not lg: below that the Navbar's grid overflows its
          pill and the offset stops being a clean −40px. Applied as a
          transform, so layout, widths, the container and the card grid
          beneath stay untouched (that grid intentionally keeps its own true
          centre — only this header tracks the logo).
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
            ✦ What We Do
          </motion.span>

          {/* Two lines with one violet accent — the Hero's headline pattern */}
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
            <span className="block">AI Services That</span>
            <span className="block text-violet-400">Scale Your Business</span>
          </motion.h2>

          <motion.p
            {...reveal(0.16)}
            className="
              mt-7 max-w-[680px]
              text-[15px] lg:text-[16px]
              leading-[1.9] text-white/60
            "
          >
            From intelligent automation to custom AI solutions, we design and
            build systems that help modern businesses save time, reduce costs
            and accelerate growth.
          </motion.p>

          <Rules />
        </div>

        {/* ── Grid: 1 / 2 / 3 columns ────────────────────────── */}
        <ul
          className="
            mt-[clamp(52px,6.5vw,80px)]
            grid grid-cols-1 gap-5
            sm:gap-6
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {SERVICES.map((service, i) => (
            <li key={service.id} className="h-full">
              <ServiceCard service={service} index={i} onOpen={openService} />
            </li>
          ))}
        </ul>
      </div>

      <ServiceModal service={active} onClose={closeService} />
    </section>
  );
};

export default Services;