import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EASE_OUT_QUINT } from "../../../constants/motion";
import { useIsMobile } from "../../../hooks/useIsMobile";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { PROJECTS, type Project } from "./projects.data";

/**
 * "Built For Real-World Impact".
 *
 * Two case studies, deliberately given the whole section rather than padded
 * out with placeholders — each gets a full-width editorial panel with its own
 * composition (see ProjectCard). Nothing is invented to fill space.
 *
 * Continuity is structural: identical container rails to every other section,
 * the same badge / two-line heading / twin rules, the same −40px optical shift
 * onto the Navbar logo axis, and the shared easing tokens.
 */

const Rules = () => (
  <div aria-hidden className="mt-9 flex items-center justify-center gap-5">
    <span className="h-px w-16 bg-gradient-to-r from-transparent via-violet-400/70 to-transparent sm:w-20" />
    <span className="h-px w-16 bg-gradient-to-l from-transparent via-violet-400/70 to-transparent sm:w-20" />
  </div>
);

const Projects = () => {
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();

  /** One modal instance, so AnimatePresence has a single mount point. */
  const [active, setActive] = useState<Project | null>(null);
  const openProject = useCallback((p: Project) => setActive(p), []);
  const closeProject = useCallback(() => setActive(null), []);

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
      id="projects"
      /* max-sm:pt gives this page's own first section extra breathing room
         under the navbar on mobile only — see Services.tsx for the full note. */
      className="
        relative overflow-hidden
        scroll-mt-[124px]
        max-sm:pt-[136px]
        pt-[clamp(96px,13vw,168px)]
        pb-[clamp(88px,11vw,148px)]
      "
    >
      {/* Section ambience — pools offset from the Process glows so the two do
          not read as the same stamp, and kept quieter than the Hero. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        <div
          className="absolute right-[18%] top-[24%] h-[600px] w-[820px] translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(79,40,183,.15) 0%, rgba(79,40,183,.05) 44%, transparent 72%)",
          }}
        />
        <div
          className="absolute left-[8%] bottom-[12%] h-[520px] w-[700px] -translate-x-1/2 translate-y-1/2 rounded-full"
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
            ✦ Featured Projects
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
            <span className="block">Built For</span>
            <span className="block text-violet-400">Real-World Impact</span>
          </motion.h2>

          <motion.p
            {...reveal(0.16)}
            className="
              mt-7 max-w-[680px]
              text-[15px] lg:text-[16px]
              leading-[1.9] text-white/60
            "
          >
            A selection of intelligent systems and digital products we have
            designed and built to solve real business problems.
          </motion.p>

          <Rules />
        </div>

        {/* ── Case studies ───────────────────────────────────── */}
        <div className="mt-[clamp(52px,6.5vw,80px)] flex flex-col gap-6 sm:gap-8 lg:gap-10">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onOpen={openProject}
            />
          ))}
        </div>
      </div>

      <ProjectModal project={active} onClose={closeProject} />
    </section>
  );
};

export default Projects;
