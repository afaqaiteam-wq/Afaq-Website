export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

/** English is served without a prefix (`/services`); Arabic lives under `/ar`. */
export const defaultLocale: Locale = "en";

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const dirFor = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

/** Builds a public URL path for a locale: `href("ar", "/contact")` → `/ar/contact`. */
export function href(locale: Locale, path = "/") {
  const clean = path === "/" ? "" : path;
  return locale === defaultLocale ? clean || "/" : `/${locale}${clean}`;
}

/** Strips the locale prefix from a public pathname: `/ar/contact` → `/contact`. */
export function stripLocale(pathname: string) {
  const match = pathname.match(/^\/(ar|en)(?=\/|$)/);
  return match ? pathname.slice(match[0].length) || "/" : pathname;
}
