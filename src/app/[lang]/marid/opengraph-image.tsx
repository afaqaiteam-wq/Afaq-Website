import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { isLocale, locales } from "@/i18n/config";

/*
 * The Marid page's share image: his logo, with the name and the promise beside it. The two images are
 * rendered ahead of time in a browser (src/assets/marid/og-en.jpg, og-ar.jpg), because the built-in
 * renderer measures some Arabic words wider than they draw and leaves gaps between them.
 */
export const alt = "Marid · مارد";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = isLocale(raw) ? raw : "en";
  const image = await readFile(join(process.cwd(), "src/assets/marid", `og-${lang}.jpg`));
  return new Response(new Uint8Array(image), { headers: { "Content-Type": contentType } });
}
