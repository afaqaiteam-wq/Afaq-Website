import { lang as rootLang } from "next/root-params";
import type { CSSProperties } from "react";

import { LogoMark } from "@/components/brand/LogoMark";
import { Button } from "@/components/ui/Button";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function NotFound() {
  const raw = await rootLang();
  const lang = isLocale(raw) ? raw : "en";
  const { notFound, nav, meta } = getDictionary(lang);
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-4 pt-24 text-center">
      {/* The layout's metadata would title this like the home page; React hoists this into <head>. */}
      <title>{`${notFound.metaTitle} · ${meta.siteName}`}</title>
      <div data-reveal>
        <LogoMark size={96} />
      </div>
      <p data-reveal style={{ "--d": "80ms" } as CSSProperties} className="eyebrow mt-6">
        {notFound.eyebrow}
      </p>
      <h1 data-reveal="rise" style={{ "--d": "140ms" } as CSSProperties} className="mt-4 font-display text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">{notFound.title}</h1>
      <p data-reveal style={{ "--d": "220ms" } as CSSProperties} className="mt-4 text-muted">
        {notFound.lead}
      </p>
      <div data-reveal style={{ "--d": "300ms" } as CSSProperties} className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href={href(lang, "/")}>{notFound.home}</Button>
        <Button href={href(lang, "/contact")} variant="ghost">
          {nav.contact}
        </Button>
      </div>
    </section>
  );
}
