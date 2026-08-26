import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EASE_IN_OUT_SINE, EASE_OUT_EXPO } from "../../constants/motion";
import { WHATSAPP_URL } from "../../config/whatsapp";

/**
 * lucide-react doesn't ship brand marks (see the same note on LinkedInGlyph
 * in TeamModal.tsx), so this is a small inline glyph rather than a new
 * dependency — the standard WhatsApp bubble-and-handset mark, single path,
 * coloured entirely via `currentColor` so it takes the button's violet tint
 * instead of WhatsApp's own green. Exported so the Footer's WhatsApp row can
 * reuse the exact same mark instead of a generic phone icon.
 */
export const WhatsAppGlyph = ({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden
    className={className}
  >
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z" />
    <path d="M20.52 3.48A11.94 11.94 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.6 5.94L0 24l6.34-1.66a11.88 11.88 0 0 0 5.7 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.42-8.41zM12.05 21.8h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.76.99 1-3.67-.24-.38a9.87 9.87 0 0 1-1.51-5.25c0-5.47 4.45-9.92 9.93-9.92 2.65 0 5.14 1.03 7.02 2.91a9.85 9.85 0 0 1 2.9 7.02c0 5.47-4.45 9.89-9.93 9.89z" />
  </svg>
);

/** Shared timing for the idle breathing loop, so the orb's scale and its
 * glow layers stay perfectly in phase — they're driven by the same
 * `isHovered` state and the same transition config, not independently
 * timed animations that happen to line up. */
const BREATHE_TRANSITION = {
  duration: 3.6,
  ease: EASE_IN_OUT_SINE,
  repeat: Infinity,
} as const;

/**
 * Floating WhatsApp button — a small "light orb" rather than a flat icon
 * button: a dark glass core, a concentrated inner light, a soft outer halo
 * and a thin ring, all breathing together in a single hover-aware state
 * machine (`isHovered`) so nothing fights a CSS hover override — every
 * layer's animate target simply switches between "breathing loop" and
 * "fixed hover value" through the same variable, all transform/opacity
 * only.
 *
 * A real `<a>` to the wa.me link, not a button with a click handler —
 * matches how every other outbound link in this codebase behaves (Book a
 * Call, Facebook, LinkedIn) and gets native "open in new tab", long-press,
 * and keyboard behaviour for free. wa.me itself hands off to the WhatsApp
 * app on mobile and to WhatsApp Web/Desktop on desktop; no extra logic is
 * needed for that. Rendered once in Layout.tsx (the shared route shell), so
 * it appears fixed on every page without any per-page duplication.
 */
const FloatingWhatsApp = () => {
  const reduced = useReducedMotion() ?? false;
  const [isHovered, setIsHovered] = useState(false);

  const breathing = !reduced && !isHovered;

  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label="Chat on WhatsApp"
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: 14 }}
      animate={
        reduced
          ? { opacity: 1 }
          : {
              opacity: 1,
              y: 0,
              scale: isHovered ? 1.1 : breathing ? [1, 1.045, 1] : 1,
            }
      }
      transition={
        reduced
          ? { duration: 0.3 }
          : {
              opacity: { duration: 0.6, delay: 1.2, ease: EASE_OUT_EXPO },
              y: { duration: 0.6, delay: 1.2, ease: EASE_OUT_EXPO },
              scale: isHovered
                ? { duration: 0.35, ease: EASE_OUT_EXPO }
                : { ...BREATHE_TRANSITION, delay: 1.8 },
            }
      }
      whileTap={reduced ? undefined : { scale: 0.95 }}
      className="
        group fixed z-40
        right-4 bottom-5
        sm:right-6 sm:bottom-7
        lg:right-8 lg:bottom-8

        flex h-11 w-11 items-center justify-center
        sm:h-12 sm:w-12
        lg:h-[52px] lg:w-[52px]

        rounded-full
        border border-violet-400/30
        bg-[#0d0818]/92
        backdrop-blur-xl

        shadow-[0_10px_34px_rgba(6,4,18,.55)]

        transition-[border-color,background-color] duration-300 ease-out

        hover:border-violet-400/60
        hover:bg-[#17092b]/95

        outline-none
        focus-visible:ring-2
        focus-visible:ring-violet-400/60
        focus-visible:ring-offset-4
        focus-visible:ring-offset-transparent
      "
    >
      {/* Outer halo — soft, concentrated close to the orb rather than
          spread across the page. Breathes with the core when idle. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-2.5 -z-20 rounded-full bg-violet-500/25 blur-xl"
        animate={{ opacity: isHovered ? 1 : breathing ? [0.5, 0.85, 0.5] : 0.5 }}
        transition={
          reduced
            ? { duration: 0.3 }
            : isHovered
            ? { duration: 0.35, ease: EASE_OUT_EXPO }
            : { ...BREATHE_TRANSITION, delay: 1.8 }
        }
      />

      {/* Inner light — the concentrated "lit from within" core, tighter and
          brighter than the halo. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-0.5 -z-10 rounded-full bg-violet-400/45 blur-sm"
        animate={{ opacity: isHovered ? 1 : breathing ? [0.55, 0.9, 0.55] : 0.55 }}
        transition={
          reduced
            ? { duration: 0.3 }
            : isHovered
            ? { duration: 0.35, ease: EASE_OUT_EXPO }
            : { ...BREATHE_TRANSITION, delay: 1.8 }
        }
      />

      {/* Thin outer ring — a hair outside the core, static aside from its
          own hover brightening; doesn't need to breathe to read as "orb". */}
      <span
        aria-hidden
        className="
          pointer-events-none absolute -inset-[3px] rounded-full
          border border-violet-300/25
          transition-colors duration-300
          group-hover:border-violet-300/50
        "
      />

      <span
        className="
          relative flex items-center justify-center
          text-violet-200 transition-colors duration-300
          group-hover:text-violet-50
          [&>svg]:h-[25px] [&>svg]:w-[25px]
          sm:[&>svg]:h-[27px] sm:[&>svg]:w-[27px]
          lg:[&>svg]:h-[29px] lg:[&>svg]:w-[29px]
        "
      >
        <WhatsAppGlyph />
      </span>
    </motion.a>
  );
};

export default FloatingWhatsApp;
