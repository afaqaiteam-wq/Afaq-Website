"use client";

import { usePathname } from "next/navigation";
import { ViewTransition, type ReactNode } from "react";

/**
 * Page-to-page transition. Keyed by path, so every navigation swaps the old page out and the
 * new one in (the page-exit / page-enter animations in globals.css). Same-page hash links keep
 * the path and don't animate. Browsers without the View Transitions API just swap instantly.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
