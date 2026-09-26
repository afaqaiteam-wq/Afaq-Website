import type { MetadataRoute } from "next";

import { href } from "@/i18n/config";
import { site } from "@/lib/site";

const PATHS = ["/", "/contact"];

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
