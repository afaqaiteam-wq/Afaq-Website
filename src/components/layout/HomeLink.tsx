"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { href, stripLocale, type Locale } from "@/i18n/config";

/**
 * Link to the home page. On the home page itself a normal link does nothing, so it
 * glides back to the top instead.
 */
export function HomeLink({
  lang,
  className,
  label,
  children,
}: {
  lang: Locale;
  className?: string;
  label?: string;
  children: ReactNode;
}) {
  const path = stripLocale(usePathname() ?? "/");
  return (
    <Link
      href={href(lang, "/")}
      aria-label={label}
      className={className}
      onClick={(e) => {
        if (path !== "/") return;
        e.preventDefault();
        if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      {children}
    </Link>
  );
}
