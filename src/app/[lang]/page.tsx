import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HeroStory } from "@/components/home/hero/HeroStory";
import { HomeSections } from "@/components/home/HomeSections";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/");
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  // Tells search engines who the site belongs to. Only confirmed details; hidden links stay out.
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: dict.meta.siteName,
    url: new URL(href(lang, "/"), site.url).toString(),
    logo: new URL("/icon.png", site.url).toString(),
    description: dict.meta.description,
    email: site.email,
    sameAs: [site.socials.facebook, site.socials.linkedin].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }}
      />
      <HeroStory lang={lang} hero={dict.hero} bookCall={dict.common.bookCall} />
      <HomeSections lang={lang} dict={dict} />
    </>
  );
}
