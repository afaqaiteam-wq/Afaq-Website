"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

declare global {
  interface Window {
    /** The page's Lenis instance, so overlays (the mobile menu) can pause scrolling. */
    __lenis?: Lenis;
  }
}

/**
 * Smooth wheel scrolling. Skipped entirely for visitors who prefer reduced motion.
 * Also starts every new page at the top: Lenis keeps its own scroll position, so without this
 * a link clicked halfway down one page opened the next page halfway down too. Back/forward
 * and links to a #section keep the browser's own scroll handling.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const historyNav = useRef(false);

  useEffect(() => {
    const onPop = () => {
      historyNav.current = true;
    };
    window.addEventListener("popstate", onPop);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => window.removeEventListener("popstate", onPop);
    }
    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    window.__lenis = lenis;
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      window.removeEventListener("popstate", onPop);
      cancelAnimationFrame(frame);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // A layout effect, so the new page is already at the top when the page transition captures it.
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (historyNav.current) {
      historyNav.current = false;
      return;
    }
    if (window.location.hash) return;
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
