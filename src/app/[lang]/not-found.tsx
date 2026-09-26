"use client";

import { usePathname } from "next/navigation";

import { LogoMark } from "@/components/brand/LogoMark";
import { Button } from "@/components/ui/Button";
import { href, type Locale } from "@/i18n/config";
import { ar } from "@/i18n/dictionaries/ar";
import { en } from "@/i18n/dictionaries/en";

// not-found receives no params, so the language is read from the URL.
export default function NotFound() {
  const lang: Locale = (usePathname() ?? "").startsWith("/ar") ? "ar" : "en";
  const { notFound, nav } = lang === "ar" ? ar : en;
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-4 pt-24 text-center">
      <LogoMark size={96} />
      <p className="mt-6 text-xs font-medium uppercase tracking-[0.3em] text-lav">{notFound.eyebrow}</p>
      <h1 className="mt-4 font-display text-4xl font-medium tracking-[-0.03em] sm:text-5xl">{notFound.title}</h1>
      <p className="mt-4 text-muted">{notFound.lead}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href={href(lang, "/")}>{notFound.home}</Button>
        <Button href={href(lang, "/contact")} variant="ghost">
          {nav.contact}
        </Button>
      </div>
    </section>
  );
}
