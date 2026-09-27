import type { Metadata, Viewport } from "next";
import { Geist, IBM_Plex_Sans_Arabic, Sora } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MotionFX } from "@/components/motion/MotionFX";
import { PageTransition } from "@/components/motion/PageTransition";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { dirFor, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["400", "500", "600"], display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-plex-arabic",
  weight: ["400", "500", "600"],
  display: "swap",
  // Only Arabic pages render Arabic text; don't preload it on English pages.
  preload: false,
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#07060b",
  colorScheme: "dark",
  // Edge to edge on iPhone; globals.css and the navbar pad for the safe areas.
  viewportFit: "cover",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: `${meta.tagline} · ${meta.siteName}`, template: `%s · ${meta.siteName}` },
    description: meta.description,
    applicationName: meta.siteName,
    ...pageMetadata(lang, "/", { description: meta.description }),
    openGraph: {
      siteName: meta.siteName,
      title: `${meta.tagline} · ${meta.siteName}`,
      description: meta.description,
      locale: lang === "ar" ? "ar_EG" : "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: `${meta.tagline} · ${meta.siteName}`, description: meta.description },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html
      lang={lang}
      dir={dirFor(lang)}
      className={`${geist.variable} ${sora.variable} ${plexArabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Lets CSS hide intro-animated elements only when JS will reveal them. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add(\"js\")" }} />
      </head>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-lav focus:px-4 focus:py-2 focus:text-on-lav"
        >
          {dict.common.skipToContent}
        </a>
        <SmoothScroll />
        <RevealObserver />
        <MotionFX />
        <Navbar lang={lang} nav={dict.nav} common={dict.common} siteName={dict.meta.siteName} />
        <main id="main">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer lang={lang} dict={dict} />
      </body>
    </html>
  );
}
