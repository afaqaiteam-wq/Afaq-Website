"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Phones and tablets: a sticky row of the six services under the navbar, so moving between
 * long service sections never means scrolling back to the top. The chip for the section in
 * view lights up and scrolls itself into sight. Desktop keeps the sticky side column instead.
 */
export function ServiceChips({ items, label }: { items: { slug: string; name: string }[]; label: string }) {
  const [active, setActive] = useState(items[0]?.slug);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.slug)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      // a thin band just under the sticky bars decides which section is "current"
      { rootMargin: "-140px 0px -70% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items]);

  useEffect(() => {
    // "nearest" keeps the page itself still; only the chip row scrolls (works in RTL too).
    rowRef.current
      ?.querySelector<HTMLElement>(`[data-slug="${active}"]`)
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label={label}
      className="sticky top-[calc(72px+env(safe-area-inset-top))] z-40 border-y border-line bg-bg/85 backdrop-blur-md lg:hidden"
    >
      <div ref={rowRef} className="flex gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden">
        {items.map((i) => (
          <a
            key={i.slug}
            data-slug={i.slug}
            href={`#${i.slug}`}
            aria-current={active === i.slug ? "true" : undefined}
            className={`inline-flex h-10 shrink-0 items-center rounded-pill border px-4 text-sm transition-[color,background-color,border-color] duration-300 ${
              active === i.slug ? "border-lav/50 bg-violet/20 text-ink" : "border-line text-muted"
            }`}
          >
            {i.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
