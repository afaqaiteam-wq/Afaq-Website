import { useCallback, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EASE_OUT_EXPO, EASE_OUT_QUINT } from "../../../constants/motion";
import { useIsMobile } from "../../../hooks/useIsMobile";
// Named `technologies.data.ts`, not `technologies.ts`: on a case-insensitive
// filesystem (Windows/macOS) the latter would shadow this folder's
// `Technologies.tsx`, since TS resolves `./Technologies` to `.ts` before `.tsx`.
import type { LogoShape, Technology } from "./technologies.data";

/**
 * Shared surface classes, declared once so the card's visual language lives in
 * a single place rather than being repeated across the layered elements.
 */
const SURFACE = `
  relative flex h-full flex-col items-center justify-center gap-3.5
  overflow-hidden rounded-[20px]
  border border-white/[0.09]
  bg-white/[0.035] backdrop-blur-xl max-sm:backdrop-blur-md
  shadow-[0_8px_28px_rgba(6,4,18,.35)]
  transition-[border-color,box-shadow,background-color] duration-500 ease-out
  group-hover:border-violet-400/30
  group-hover:bg-white/[0.055]
  group-hover:shadow-[0_18px_44px_rgba(79,40,183,.24)]
`;

/** Renders one authored primitive. Everything paints with currentColor. */
const Shape = ({ s }: { s: LogoShape }) => {
  switch (s.kind) {
    case "path":
      return s.stroke ? (
        <path
          d={s.d}
          fill="none"
          stroke="currentColor"
          strokeWidth={s.stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path d={s.d} fill="currentColor" fillRule={s.evenOdd ? "evenodd" : "nonzero"} />
      );

    case "circle":
      return s.stroke ? (
        <circle cx={s.cx} cy={s.cy} r={s.r} fill="none" stroke="currentColor" strokeWidth={s.stroke} />
      ) : (
        <circle cx={s.cx} cy={s.cy} r={s.r} fill="currentColor" />
      );

    case "ellipse":
      return (
        <ellipse
          cx={s.cx}
          cy={s.cy}
          rx={s.rx}
          ry={s.ry}
          fill={s.stroke ? "none" : "currentColor"}
          stroke={s.stroke ? "currentColor" : undefined}
          strokeWidth={s.stroke}
          transform={s.rotate ? `rotate(${s.rotate} ${s.cx} ${s.cy})` : undefined}
        />
      );

    case "rect":
      return (
        <rect
          x={s.x}
          y={s.y}
          width={s.w}
          height={s.h}
          rx={s.r}
          fill={s.stroke ? "none" : "currentColor"}
          stroke={s.stroke ? "currentColor" : undefined}
          strokeWidth={s.stroke}
        />
      );

    case "line":
      return (
        <line
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke="currentColor"
          strokeWidth={s.stroke}
          strokeLinecap="round"
        />
      );

    case "text":
      return (
        <text
          x={s.x}
          y={s.y}
          textAnchor="middle"
          fill="currentColor"
          fontSize={s.size}
          fontWeight={s.weight ?? 600}
          letterSpacing={s.tracking}
          fontFamily="'Space Grotesk', sans-serif"
        >
          {s.value}
        </text>
      );
  }
};

interface TechnologyCardProps {
  tech: Technology;
  /** Position in the grid, used to stagger the reveal. */
  index: number;
}

const TechnologyCard = ({ tech, index }: TechnologyCardProps) => {
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);

  /**
   * The spotlight follows the cursor by writing CSS custom properties straight
   * to the node — no state, so moving the pointer never triggers a React
   * render. The gradient itself is painted by CSS.
   */
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      className="group relative h-[128px] sm:h-[140px] lg:h-[148px]"
      // Mobile: no initial/whileInView/viewport at all — no observer, no
      // animation subscription. Desktop keeps the original entrance exactly.
      initial={
        isMobile
          ? undefined
          : reduced
          ? { opacity: 0 }
          : { opacity: 0, y: 18, filter: "blur(6px)" }
      }
      whileInView={
        isMobile
          ? undefined
          : reduced
          ? { opacity: 1 }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={isMobile ? undefined : { once: true, margin: "-60px" }}
      whileHover={reduced ? undefined : { y: -6, scale: 1.025 }}
      transition={{
        duration: reduced ? 0.3 : 0.62,
        delay: reduced ? 0 : index * 0.055,
        ease: EASE_OUT_QUINT,
        y: { duration: 0.42, ease: EASE_OUT_EXPO },
        scale: { duration: 0.42, ease: EASE_OUT_EXPO },
      }}
    >
      {/* Ambient bloom behind the card, revealed on hover */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -inset-2 -z-10 rounded-[26px]
          bg-violet-500/20 blur-2xl
          opacity-0 max-sm:hidden transition-opacity duration-500
          group-hover:opacity-100
        "
      />

      <div className={SURFACE}>
        {/* Glass sheen — a light source implied above the card, which stops
            the surface reading as a flat swatch. Static, so it costs nothing. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -20%, rgba(255,255,255,.07), transparent 62%)",
          }}
        />

        {/* Cursor spotlight */}
        <div
          aria-hidden
          className="
            pointer-events-none absolute inset-0
            opacity-0 transition-opacity duration-300
            group-hover:opacity-100
          "
          style={{
            background:
              "radial-gradient(200px circle at var(--mx, 50%) var(--my, 50%), rgba(164,124,237,.18), transparent 68%)",
          }}
        />

        {/* Top edge highlight — same motif as the Hero's primary button */}
        <div
          aria-hidden
          className="
            pointer-events-none absolute left-7 right-7 top-0 h-px
            bg-gradient-to-r from-transparent via-white/25 to-transparent
            transition-opacity duration-500
            group-hover:via-violet-300/60
          "
        />

        {/* Mark — every technology, Claude and Node.js included, renders
            through the same single currentColor line-mark: no per-vendor
            colours, so the whole grid reads as one unified purple/lavender
            treatment. */}
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="
            relative h-[32px] w-[32px] lg:h-[36px] lg:w-[36px]
            text-violet-300/75
            transition-[color,filter] duration-500 ease-out
            group-hover:text-violet-100
            group-hover:drop-shadow-[0_0_12px_rgba(164,124,237,.55)]
          "
        >
          {tech.logo.map((s, i) => (
            <Shape key={i} s={s} />
          ))}
        </svg>

        {/* Name */}
        <span
          className="
            relative text-[12px] lg:text-[13px]
            font-medium tracking-[0.02em]
            text-white/55
            transition-colors duration-500
            group-hover:text-white/90
          "
        >
          {tech.name}
        </span>

        <span className="sr-only">{tech.category}</span>
      </div>
    </motion.div>
  );
};

export default TechnologyCard;
