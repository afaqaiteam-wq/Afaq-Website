import { motion, useReducedMotion } from "framer-motion";

import Logo from "./Logo";
import NavMenu from "./NavMenu";
import CTAButton from "./CTAButton";
import MobileMenu from "./MobileMenu";

import { D, EASE_OUT_EXPO, T } from "../../../constants/motion";
import { useMediaQuery } from "../../../hooks/useIsMobile";

/** Matches the `lg:` (1024px) split every class below already uses. */
const COMPACT_QUERY = "(max-width: 1023px)";

const Navbar = () => {
  const reduced = useReducedMotion();
  /**
   * `Logo` runs continuous Framer Motion idle loops (float, breathe, light
   * sweep — all `repeat: Infinity`, driven by Framer's own rAF engine, not
   * CSS). The desktop and mobile halves below were both always mounted and
   * merely CSS-hidden by breakpoint (`hidden lg:grid` / `lg:hidden`), so the
   * invisible one kept animating forever regardless of viewport, doubling
   * this component's persistent JS workload on every page for no visual
   * benefit. Conditionally rendering only the visible half actually unmounts
   * — and stops — the other one.
   */
  const isCompact = useMediaQuery(COMPACT_QUERY);

  return (
    <motion.header
      className="fixed top-5 left-0 right-0 z-50"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: -130 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0.3 : D.navShell,
        delay: T.navShell,
        ease: EASE_OUT_EXPO,
      }}
    >
      <div className="flex justify-center px-6">
        <nav
          className="
            glass
            relative

            w-[min(82vw,1440px)]

            h-[80px]

            rounded-[24px]

            px-1 lg:px-8

            shadow-[0_12px_45px_rgba(79,40,183,.14)]
          "
        >
          <div className="glow absolute inset-0 rounded-[24px]" />

          {/* Desktop */}
          {!isCompact && (
            <div
              className="
                grid

                h-full

                grid-cols-[300px_auto_380px]

                items-center
              "
            >
              {/* Left Menu */}
              <div className="flex justify-end pr-10">
                <NavMenu side="left" />
              </div>

              {/* Logo */}
              <div className="flex justify-center">
                <Logo />
              </div>

              {/* Right Menu */}
              <div className="flex items-center justify-start pl-10 gap-6">
                <NavMenu side="right" />

                <CTAButton />
              </div>
            </div>
          )}

          {/* Mobile */}
          {isCompact && (
            <div className="flex h-full items-center justify-between px-2">
              <MobileMenu />
            </div>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;