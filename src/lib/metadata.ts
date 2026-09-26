import type { Metadata } from "next";

import { href, type Locale } from "@/i18n/config";

/** Canonical URL, hreflang alternates and Open Graph for one page in one language. */
export function pageMetadata(
  lang: Locale,
  path: string,
  { title, description }: { title?: string; description?: string } = {},
): Metadata {
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: href(lang, path),
      languages: {
        en: href("en", path),
        ar: href("ar", path),
        "x-default": href("en", path),
      },
    },
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      url: href(lang, path),
      locale: lang === "ar" ? "ar_EG" : "en_US",
      type: "website",
    },
  };
}
