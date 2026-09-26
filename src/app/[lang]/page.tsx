import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HeroStory } from "@/components/home/hero/HeroStory";
import { HomeSections } from "@/components/home/HomeSections";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/");
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <HeroStory lang={lang} hero={dict.hero} bookCall={dict.common.bookCall} />
      <HomeSections lang={lang} dict={dict} />
    </>
  );
}
