import type { Metadata } from "next";

import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * Canonical URL, hreflang alternates, Open Graph and Twitter cards for one page in one language.
 * A page's openGraph replaces the layout's rather than merging with it, so the share image and
 * the branded title are set here for every page, not only the home page.
 */
export function pageMetadata(
  lang: Locale,
  path: string,
  { title, description }: { title?: string; description?: string } = {},
): Metadata {
  const { meta } = getDictionary(lang);
  const shareTitle = title ? `${title} · ${meta.siteName}` : `${meta.tagline} · ${meta.siteName}`;
  const image = { url: `/${lang}/opengraph-image`, width: 1200, height: 630, alt: meta.siteName };
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
      title: shareTitle,
      ...(description ? { description } : {}),
      url: href(lang, path),
      siteName: meta.siteName,
      locale: lang === "ar" ? "ar_EG" : "en_US",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      ...(description ? { description } : {}),
      images: [image.url],
    },
  };
}
