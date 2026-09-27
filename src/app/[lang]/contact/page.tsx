import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";

import { ContactForm } from "@/components/contact/ContactForm";
import { CopyEmail } from "@/components/contact/CopyEmail";
import { AccentText } from "@/components/ui/AccentText";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { StarBackdrop } from "@/components/ui/StarBackdrop";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { contact } = getDictionary(lang);
  return pageMetadata(lang, "/contact", { title: contact.metaTitle, description: contact.lead });
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { contact, common } = getDictionary(lang);
  // The form sends through Resend. Until both keys are set in the environment (read at build
  // time, so a redeploy picks them up), show a direct email panel instead of a form that fails.
  const formReady = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
  const card = "rounded-3xl border border-line bg-surface p-7 sm:p-10";

  const bookCard = (extra = "") => (
    <div
      data-spotlight
      className={`${card} ${extra} relative overflow-hidden border-lav/30 shadow-[0_40px_100px_-50px_rgb(124_77_255/0.7)]`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-24 -top-24 size-64 rounded-full bg-[radial-gradient(circle,rgb(124_77_255/0.35),transparent_70%)]"
      />
      <h2 className="relative font-display text-2xl font-medium tracking-[-0.02em]">{contact.orBook}</h2>
      <p className="relative mt-3 max-w-[30em] text-muted">{contact.orBookLead}</p>
      <Button href={site.bookingUrl} external arrow className="relative mt-8">
        {common.bookCall}
      </Button>
    </div>
  );

  return (
    <>
      <StarBackdrop />
      <section className="mx-auto max-w-[1440px] px-4 pb-24 pt-36 sm:px-8 lg:px-14 lg:pt-40">
        <header className="max-w-[52rem]">
          <p data-reveal className="eyebrow">
            {contact.eyebrow}
          </p>
          <h1
            data-reveal="rise"
            style={delay(80)}
            className="mt-6 font-display text-[clamp(40px,5.6vw,84px)] font-semibold leading-[1] tracking-[-0.04em]"
          >
            {contact.title} <span className="block"><AccentText text={contact.titleAccent} /></span>
          </h1>
          <p data-reveal style={delay(160)} className="mt-6 max-w-[34em] text-lg text-muted">
            {contact.lead}
          </p>
        </header>

        {formReady ? (
          <div className="mt-14 grid gap-x-14 gap-y-10 lg:grid-cols-12">
            <div data-reveal className="lg:col-span-7">
              <ContactForm lang={lang} form={contact.form} services={contact.services} bookCall={common.bookCall} />
            </div>
            <aside data-reveal style={delay(120)} className="flex flex-col gap-5 lg:col-span-5">
              {bookCard()}
              <div className="rounded-3xl border border-line p-7">
                <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-dim">{contact.emailLabel}</h2>
                <a href={`mailto:${site.email}`} dir="ltr" className="mt-2 inline-flex min-h-11 items-center text-lg text-ink underline-offset-4 hover:underline">
                  {site.email}
                </a>
              </div>
            </aside>
          </div>
        ) : (
          <div className="mt-14 grid gap-5 lg:grid-cols-2 lg:gap-6">
            <div data-reveal className="h-full">
              {bookCard("h-full")}
            </div>
            <div data-reveal style={delay(120)} data-spotlight className={`${card} h-full`}>
              <h2 className="font-display text-2xl font-medium tracking-[-0.02em]">{contact.direct.title}</h2>
              <p className="mt-3 max-w-[30em] text-muted">{contact.direct.lead}</p>
              <p className="mt-5">
                <a href={`mailto:${site.email}`} dir="ltr" className="inline-flex min-h-11 items-center text-xl text-ink underline-offset-4 hover:underline">
                  {site.email}
                </a>
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <CopyEmail email={site.email} label={contact.direct.copy} done={contact.direct.copied} />
                {/* A plain link: Button's external mode would open mailto in a blank tab. */}
                <a
                  href={`mailto:${site.email}`}
                  className="btn-ghost inline-flex h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-pill px-6 text-[15px] font-medium"
                >
                  {contact.direct.cta}
                  <ArrowIcon className="btn-arrow" />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
