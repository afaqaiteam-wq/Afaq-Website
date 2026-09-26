import { lang as rootLang } from "next/root-params";

import { LogoMark } from "@/components/brand/LogoMark";
import { Button } from "@/components/ui/Button";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function NotFound() {
  const raw = await rootLang();
  const lang = isLocale(raw) ? raw : "en";
  const { notFound, nav } = getDictionary(lang);
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-4 pt-24 text-center">
      <LogoMark size={96} />
      <p className="eyebrow mt-6">{notFound.eyebrow}</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">{notFound.title}</h1>
      <p className="mt-4 text-muted">{notFound.lead}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href={href(lang, "/")}>{notFound.home}</Button>
        <Button href={href(lang, "/contact")} variant="ghost">
          {nav.contact}
        </Button>
      </div>
    </section>
  );
}
