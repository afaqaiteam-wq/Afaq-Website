"use client";

import Lenis from "lenis";
import { useEffect } from "react";

declare global {
  interface Window {
    /** The page's Lenis instance, so overlays (the mobile menu) can pause scrolling. */
    __lenis?: Lenis;
  }
}

/** Smooth wheel scrolling. Skipped entirely for visitors who prefer reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    window.__lenis = lenis;
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);
  return null;
}
