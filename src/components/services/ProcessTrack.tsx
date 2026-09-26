"use client";

import { useEffect, useRef } from "react";

import type { ProcessStep } from "@/content/services";

/**
 * Four steps on a horizon line. As the section scrolls through the viewport the line
 * fills and a star travels along it, lighting each step as it passes.
 */
export function ProcessTrack({ steps }: { steps: ProcessStep[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the track enters the lower third, 1 when it reaches the upper third
      const p = reduced ? 1 : Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (vh * 0.55)));
      el.style.setProperty("--p", p.toFixed(3));
      el.querySelectorAll<HTMLElement>("[data-step]").forEach((s, i) => {
        s.toggleAttribute("data-lit", p >= (i + 0.35) / steps.length);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [steps.length]);

  return (
    <div ref={ref} className="relative mt-16 [--p:0]">
      {/* the horizon line and the travelling star (desktop) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[5px] hidden h-px bg-line md:block">
        <span className="absolute inset-y-0 start-0 w-[calc(var(--p)*100%)] bg-[linear-gradient(90deg,rgba(140,92,255,.2),#a67bff)] rtl:bg-[linear-gradient(-90deg,rgba(140,92,255,.2),#a67bff)]" />
        <span className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_#c8a8ff,0_0_28px_rgba(140,92,255,.8)] [inset-inline-start:calc(var(--p)*100%_-_6px)]" />
      </div>
      <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
      {steps.map((s, i) => (
        <li key={s.title} data-step className="group relative ps-6 md:ps-0">
          <span className="absolute start-0 top-[3px] size-2.5 rounded-full border border-lav/40 bg-bg transition-colors duration-500 group-data-lit:border-lav group-data-lit:bg-lav md:relative md:top-0 md:block" />
          <p className="mt-0 text-xs font-medium tracking-[0.2em] text-dim md:mt-7">
            {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold text-muted transition-colors duration-500 group-data-lit:text-ink">{s.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.body}</p>
        </li>
      ))}
      </ol>
    </div>
  );
}
