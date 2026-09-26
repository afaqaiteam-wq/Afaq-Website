"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LogoMark } from "@/components/brand/LogoMark";
import { Button } from "@/components/ui/Button";
import { href, stripLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { site } from "@/lib/site";

const LINKS = [
  { key: "home", path: "/" },
  { key: "services", path: "/services" },
  { key: "work", path: "/work" },
  { key: "about", path: "/about" },
  { key: "contact", path: "/contact" },
] as const;

interface NavbarProps {
  lang: Locale;
  nav: Dictionary["nav"];
  common: Dictionary["common"];
  siteName: string;
}

export function Navbar({ lang, nav, common, siteName }: NavbarProps) {
  const path = stripLocale(usePathname() ?? "/");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const otherLang: Locale = lang === "en" ? "ar" : "en";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu whenever the route changes.
  const [menuPath, setMenuPath] = useState(path);
  if (menuPath !== path) {
    setMenuPath(path);
    setOpen(false);
  }

  // Open sheet: lock page scroll, trap focus, Escape closes and returns focus to the toggle.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const sheet = sheetRef.current;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    sheet?.querySelector<HTMLElement>("a,button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !sheet) return;
      const items = [toggle, ...sheet.querySelectorAll<HTMLElement>("a,button")].filter(Boolean) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
      toggle?.focus();
    };
  }, [open]);

  const isActive = (p: string) => (p === "/" ? path === "/" : path.startsWith(p));
  const langSwitch = (extra: string) => (
    <Link
      href={href(otherLang, path)}
      hrefLang={otherLang}
      lang={otherLang}
      aria-label={common.switchLanguageLabel}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-pill px-3 text-sm text-muted transition-colors hover:text-ink ${
        otherLang === "ar" ? "font-arabic" : "font-sans"
      } ${extra}`}
    >
      {common.switchLanguage}
    </Link>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled && !open ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="relative z-10 mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-8 lg:px-14">
        <Link href={href(lang, "/")} className="flex items-center gap-2.5" aria-label={siteName}>
          <LogoMark size={34} priority />
          <span className="font-display text-lg font-semibold tracking-[-0.02em]">{siteName}</span>
        </Link>

        <nav aria-label={nav.main} className="hidden lg:block">
          <ul className="flex gap-1 rounded-pill border border-line bg-surface/60 p-1.5 text-sm">
            {LINKS.map((l) => (
              <li key={l.key}>
                <Link
                  href={href(lang, l.path)}
                  aria-current={isActive(l.path) ? "page" : undefined}
                  className={`block rounded-pill px-4 py-2 transition-colors ${
                    isActive(l.path) ? "bg-white/8 text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {nav[l.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {langSwitch("hidden sm:inline-flex")}
          <Button href={site.bookingUrl} external size="sm" className="hidden sm:inline-flex">
            {common.bookCall}
          </Button>
          <button
            ref={toggleRef}
            type="button"
            className="flex size-11 items-center justify-center rounded-xl border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? nav.closeMenu : nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={sheetRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={nav.main}
          className="fixed inset-0 flex flex-col bg-bg/95 px-4 pb-8 pt-[88px] backdrop-blur-xl sm:px-8 lg:hidden"
        >
          <nav aria-label={nav.main} className="flex-1 overflow-y-auto">
            <ul className="flex flex-col">
              {LINKS.map((l, i) => (
                <li key={l.key} className="menu-item" style={{ animationDelay: `${i * 40}ms` }}>
                  <Link
                    href={href(lang, l.path)}
                    aria-current={isActive(l.path) ? "page" : undefined}
                    className={`block border-b border-line py-5 font-display text-[28px] font-medium ${
                      isActive(l.path) ? "text-ink" : "text-muted"
                    }`}
                  >
                    {nav[l.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center justify-between gap-4 pt-6">
            {langSwitch("border border-line")}
            <Button href={site.bookingUrl} external arrow className="flex-1">
              {common.bookCall}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
