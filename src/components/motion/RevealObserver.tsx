"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Reveals every `[data-reveal]` element once it scrolls into view (see globals.css).
 * Mounted once in the layout and re-scanned on every route change, so pages only mark
 * elements up. `style={{ "--d": "120ms" }}` on an element staggers it.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.setAttribute("data-reveal-ready", "");
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.setAttribute("data-shown", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-shown", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
