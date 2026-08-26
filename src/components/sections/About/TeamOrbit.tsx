import { useCallback, useState } from "react";
import type { KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";

import { useIsMobile } from "../../../hooks/useIsMobile";
import TeamMemberCard from "./TeamMember";
import { TEAM, type TeamMember } from "./team.data";

/**
 * The team composition — a stacked card deck / carousel, built around the
 * Navbar logo's own axis rather than the section's true centre.
 *
 * ALIGNMENT: the Navbar's desktop grid is grid-cols-[300px_auto_380px] (see
 * Navbar.tsx), so its centre cell — the logo — sits (380−300)/2 = 40px left
 * of the pill's, and therefore the viewport's, true centre. That's the same
 * derivation already used for the Services/Projects/About/Contact page
 * headers (see Services.tsx). Applying the identical, gated
 * `min-[1180px]:-translate-x-[40px]` here — rather than inventing a new
 * offset — puts the deck on that same logo axis using a value that's
 * already proven constant from 1180px up, at any container width.
 *
 * DEPTH: one large active card sits in front; up to two further members
 * peek from behind it (one on mobile, to keep the stack light on small
 * screens), each progressively offset, scaled down, dimmed and softly
 * blurred. A quiet, fully static orbital/glow motif sits behind the stack —
 * an echo of the logo's own visual language, not a second animated system.
 *
 * PERFORMANCE: only the visible slots (2 on mobile, 3 from sm up) are ever
 * mounted — changing the active member swaps each slot's own
 * AnimatePresence child rather than animating all five members at once, and
 * nothing here runs a continuous/idle loop.
 *
 * Clicking the front (active) card opens the profile modal. Clicking a card
 * peeking behind it — or a dot, or dragging the active card, or
 * ArrowLeft/ArrowRight with the deck focused — changes which member is
 * active.
 */

interface SlotConfig {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  blur: number;
  rotate: number;
  z: number;
}

const DESKTOP_SLOTS: SlotConfig[] = [
  { x: 0, y: 0, scale: 1, opacity: 1, blur: 0, rotate: 0, z: 30 },
  { x: 30, y: -25, scale: 0.94, opacity: 0.65, blur: 0.5, rotate: 2, z: 20 },
  { x: 55, y: -46, scale: 0.89, opacity: 0.38, blur: 1.5, rotate: 3.5, z: 10 },
];

const MOBILE_SLOTS: SlotConfig[] = [
  { x: 0, y: 0, scale: 1, opacity: 1, blur: 0, rotate: 0, z: 30 },
  { x: 19, y: -16, scale: 0.93, opacity: 0.58, blur: 0.5, rotate: 1.5, z: 20 },
];

const DRAG_THRESHOLD = 60;
const DRAG_VELOCITY_THRESHOLD = 420;

/** Quiet, fully static twin arcs behind the stack — the same restrained
 * motif the logo's own orbit ring uses elsewhere on the site, stilled here
 * so it reads as ambience rather than a second moving system. */
const OrbitGlow = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <div
      className="h-[300px] w-[460px] sm:h-[340px] sm:w-[520px] lg:h-[390px] lg:w-[600px] rounded-full"
      style={{
        background:
          "radial-gradient(ellipse, rgba(117,73,216,.20) 0%, rgba(79,40,183,.08) 45%, transparent 72%)",
      }}
    />
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full overflow-visible opacity-40"
    >
      <ellipse
        cx="200"
        cy="200"
        rx="190"
        ry="86"
        fill="none"
        stroke="rgba(208,194,227,.24)"
        strokeWidth="1"
        transform="rotate(-14 200 200)"
      />
      <ellipse
        cx="200"
        cy="200"
        rx="96"
        ry="184"
        fill="none"
        stroke="rgba(164,124,237,.18)"
        strokeWidth="1"
        transform="rotate(10 200 200)"
      />
    </svg>
  </div>
);

/** Very quiet upward connection toward the Navbar logo — felt, not seen. */
const ConnectionBeam = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute left-1/2 -top-14 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-violet-300/25 to-violet-300/0"
  />
);

interface TeamOrbitProps {
  onOpen: (member: TeamMember) => void;
}

const TeamOrbit = ({ onOpen }: TeamOrbitProps) => {
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);

  const count = TEAM.length;
  const slotConfigs = isMobile ? MOBILE_SLOTS : DESKTOP_SLOTS;
  const visibleCount = Math.min(slotConfigs.length, count);

  const goTo = useCallback(
    (index: number) => setActiveIndex(((index % count) + count) % count),
    [count]
  );
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  const handleDragEnd = useCallback(
    (_e: unknown, info: PanInfo) => {
      if (info.offset.x < -DRAG_THRESHOLD || info.velocity.x < -DRAG_VELOCITY_THRESHOLD) {
        next();
      } else if (info.offset.x > DRAG_THRESHOLD || info.velocity.x > DRAG_VELOCITY_THRESHOLD) {
        prev();
      }
    },
    [next, prev]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    },
    [next, prev]
  );

  return (
    <div className="relative flex flex-col items-center min-[1180px]:-translate-x-[40px]">
      <ConnectionBeam />
      <OrbitGlow />

      {/* ── Stage ──────────────────────────────────────────── */}
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Team members"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative h-[288px] w-full max-w-[218px] outline-none sm:h-[332px] sm:max-w-[250px] lg:h-[384px] lg:max-w-[290px] focus-visible:ring-2 focus-visible:ring-violet-400/50 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent rounded-[26px]"
      >
        {Array.from({ length: visibleCount }, (_, slotIndex) => {
          const member = TEAM[(activeIndex + slotIndex) % count];
          const cfg = slotConfigs[slotIndex];
          const isActive = slotIndex === 0;

          return (
            <div
              key={`slot-${slotIndex}`}
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: cfg.z }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={member.id}
                  drag={isActive && !reduced ? "x" : false}
                  dragElastic={0.12}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragTransition={{ bounceStiffness: 400, bounceDamping: 32 }}
                  onDragEnd={isActive ? handleDragEnd : undefined}
                  onClick={() =>
                    isActive ? onOpen(member) : goTo(activeIndex + slotIndex)
                  }
                  onKeyDown={
                    isActive
                      ? (e: KeyboardEvent<HTMLDivElement>) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onOpen(member);
                          }
                        }
                      : undefined
                  }
                  aria-label={
                    isActive
                      ? `Open profile for ${member.name}, ${member.role}`
                      : `Show ${member.name}`
                  }
                  role="button"
                  tabIndex={isActive ? 0 : -1}
                  initial={
                    reduced
                      ? { opacity: 0 }
                      : { opacity: 0, scale: cfg.scale * 0.94, x: cfg.x, y: cfg.y + 8 }
                  }
                  animate={
                    reduced
                      ? { opacity: cfg.opacity }
                      : {
                          opacity: cfg.opacity,
                          scale: cfg.scale,
                          x: cfg.x,
                          y: cfg.y,
                          rotate: cfg.rotate,
                          filter: `blur(${cfg.blur}px)`,
                        }
                  }
                  exit={
                    reduced
                      ? { opacity: 0 }
                      : { opacity: 0, scale: cfg.scale * 0.94 }
                  }
                  transition={
                    reduced
                      ? { duration: 0.15 }
                      : { type: "spring", stiffness: 300, damping: 28, mass: 0.7 }
                  }
                  whileHover={
                    !reduced && !isActive
                      ? { opacity: Math.min(cfg.opacity + 0.2, 1) }
                      : undefined
                  }
                  className="group h-full w-full max-w-[218px] cursor-pointer touch-pan-y will-change-transform outline-none sm:max-w-[250px] lg:max-w-[290px] focus-visible:ring-2 focus-visible:ring-violet-400/50 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent rounded-[26px]"
                >
                  <TeamMemberCard member={member} isActive={isActive} />
                </motion.div>
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* ── Dots ───────────────────────────────────────────── */}
      <div className="mt-9 flex items-center gap-2.5" role="tablist" aria-label="Select team member">
        {TEAM.map((member, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={member.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Show ${member.name}`}
              onClick={() => goTo(i)}
              className="flex h-6 w-6 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 rounded-full"
            >
              <span
                className={`
                  rounded-full transition-all duration-300
                  ${
                    isActive
                      ? "h-2.5 w-6 bg-[linear-gradient(90deg,#A47CED,#7d24a7)] shadow-[0_0_10px_rgba(164,124,237,.55)]"
                      : "h-2 w-2 bg-white/20 hover:bg-white/35"
                  }
                `}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TeamOrbit;
