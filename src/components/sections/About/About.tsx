import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EASE_OUT_QUINT } from "../../../constants/motion";
import { useIsMobile } from "../../../hooks/useIsMobile";
import TeamModal from "./TeamModal";
import TeamOrbit from "./TeamOrbit";
import type { TeamMember } from "./team.data";

/**
 * "Meet The Minds Behind AFAQ AI".
 *
 * Continuity with Technologies and Services is structural: identical
 * container rails, the same badge / two-line heading / twin-rule header, the
 * same −40px optical shift onto the Navbar logo's axis, and the shared easing
 * tokens from constants/motion.ts.
 */

const Rules = () => (
  <div aria-hidden className="mt-9 flex items-center justify-center gap-5">
    <span className="h-px w-16 bg-gradient-to-r from-transparent via-violet-400/70 to-transparent sm:w-20" />
    <span className="h-px w-16 bg-gradient-to-l from-transparent via-violet-400/70 to-transparent sm:w-20" />
  </div>
);

const About = () => {
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();

  /** One modal instance, so AnimatePresence has a single mount point. */
  const [active, setActive] = useState<TeamMember | null>(null);
  const openMember = useCallback((m: TeamMember) => setActive(m), []);
  const closeMember = useCallback(() => setActive(null), []);

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
      id="about"
      /* Clears the fixed navbar when the existing "About" nav link jumps here.
         max-sm:pt gives this page's own first section extra breathing room
         under the navbar on mobile only — see Services.tsx for the full note. */
      className="
        relative overflow-hidden
        scroll-mt-[124px]
        max-sm:pt-[136px]
        pt-[clamp(96px,13vw,168px)]
        pb-[clamp(88px,11vw,148px)]
      "
    >
      {/* Section ambience — offset from the Services pools so the two do not
          read as the same stamp, and kept quieter than the Hero. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        <div
          className="absolute left-1/2 top-[46%] h-[640px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(79,40,183,.15) 0%, rgba(79,40,183,.05) 44%, transparent 72%)",
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
            Shifted onto the Navbar logo's axis — see the derivation in
            Services.tsx. Gated at 1180px where the Navbar grid stops
            overflowing its pill. */}
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
            ✦ About Afaq
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
            <span className="block">Meet The Minds</span>
            <span className="block text-violet-400">Behind AFAQ AI</span>
          </motion.h2>

          <motion.p
            {...reveal(0.16)}
            className="
              mt-7 max-w-[680px]
              text-[15px] lg:text-[16px]
              leading-[1.9] text-white/60
            "
          >
            We bring together AI engineering, software development and business
            strategy — a small senior team that designs, builds and ships
            intelligent products for ambitious companies.
          </motion.p>

          <Rules />
        </div>

        {/* ── Team composition ───────────────────────────────── */}
        <div className="mt-[clamp(56px,7vw,88px)]">
          <TeamOrbit onOpen={openMember} />
        </div>
      </div>

      <TeamModal member={active} onClose={closeMember} />
    </section>
  );
};

export default About;