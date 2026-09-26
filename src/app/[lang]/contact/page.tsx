import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactForm } from "@/components/contact/ContactForm";
import { ArrowIcon, Button } from "@/components/ui/Button";
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

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { contact, common } = getDictionary(lang);
  // The form sends through Resend. Until both keys are set in the environment (read at build
  // time, so a redeploy picks them up), show a direct email panel instead of a form that fails.
  const formReady = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);

  return (
    <section className="mx-auto grid max-w-[1440px] gap-x-14 gap-y-12 px-4 pb-24 pt-36 sm:px-8 lg:grid-cols-12 lg:px-14">
      <header className="lg:col-span-8">
        <p className="eyebrow">{contact.eyebrow}</p>
        <h1 className="mt-4 max-w-[16em] font-display text-[clamp(36px,4.6vw,64px)] font-semibold leading-[1.04] tracking-[-0.035em]">
          {contact.title}
        </h1>
        <p className="mt-5 max-w-[34em] text-lg text-muted">{contact.lead}</p>
      </header>

      <div className="lg:col-span-7 lg:row-start-2">
        {formReady ? (
          <ContactForm lang={lang} form={contact.form} services={contact.services} bookCall={common.bookCall} />
        ) : (
          <div className="rounded-3xl border border-line bg-surface p-8 sm:p-10">
            <h2 className="font-display text-2xl font-medium tracking-[-0.02em]">{contact.direct.title}</h2>
            <p className="mt-3 max-w-[32em] text-muted">{contact.direct.lead}</p>
            <p className="mt-6">
              <a href={`mailto:${site.email}`} dir="ltr" className="inline-block text-xl text-ink underline-offset-4 hover:underline">
                {site.email}
              </a>
            </p>
            {/* A plain link: Button's external mode would open mailto in a blank tab. */}
            <a
              href={`mailto:${site.email}`}
              className="btn-primary mt-8 inline-flex h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-pill px-6 text-[15px] font-medium"
            >
              {contact.direct.cta}
              <ArrowIcon className="btn-arrow" />
            </a>
          </div>
        )}
      </div>

      <aside className="flex flex-col gap-5 lg:col-span-4 lg:col-start-9 lg:row-start-2">
        <div className="rounded-3xl border border-line bg-surface p-7">
          <h2 className="font-display text-xl font-medium tracking-[-0.02em]">{contact.orBook}</h2>
          <p className="mt-2 text-muted">{contact.orBookLead}</p>
          <Button href={site.bookingUrl} external arrow className="mt-6">
            {common.bookCall}
          </Button>
        </div>
        {formReady && (
          <div className="rounded-3xl border border-line p-7">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-dim">{contact.emailLabel}</h2>
            <a href={`mailto:${site.email}`} dir="ltr" className="mt-3 block text-lg text-ink underline-offset-4 hover:underline">
              {site.email}
            </a>
          </div>
        )}
      </aside>
    </section>
  );
}
