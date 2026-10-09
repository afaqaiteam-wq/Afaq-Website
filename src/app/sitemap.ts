import type { MetadataRoute } from "next";

import { workSlugs } from "@/content/work-slugs";
import { href } from "@/i18n/config";
import { site } from "@/lib/site";

const PATHS = ["/", "/services", "/work", ...workSlugs.map((slug) => `/work/${slug}`), "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: new URL(href("en", path), site.url).toString(),
    lastModified: new Date(),
    alternates: {
      languages: {
        en: new URL(href("en", path), site.url).toString(),
        ar: new URL(href("ar", path), site.url).toString(),
      },
    },
  }));
}
