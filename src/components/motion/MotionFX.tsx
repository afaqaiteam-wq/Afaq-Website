"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide ambient motion, mounted once in the layout:
 *  - a reading-progress hairline at the top of the window,
 *  - a slow parallax drift on `[data-parallax]` layers (the value is the speed, e.g. "0.06"),
 *  - the pointer spotlight on `[data-spotlight]` cards (sets --mx / --my, see globals.css).
 * One scroll listener and one pointer listener for the whole page, both rAF-throttled.
 */
export function MotionFX() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty("--progress", max > 0 ? Math.min(1, y / max).toFixed(4) : "0");
      if (reduced) return;
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.parallax) || 0.05;
        el.style.translate = `0 ${(-y * speed).toFixed(1)}px`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    let pointerRaf = 0;
    let last: PointerEvent | null = null;
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = e;
      if (pointerRaf) return;
      pointerRaf = requestAnimationFrame(() => {
        pointerRaf = 0;
        const card = (last?.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
        if (!card || !last) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${last.clientX - r.left}px`);
        card.style.setProperty("--my", `${last.clientY - r.top}px`);
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(pointerRaf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <div ref={barRef} aria-hidden="true" className="scroll-progress" />;
}
