import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactForm } from "@/components/contact/ContactForm";
import { Button } from "@/components/ui/Button";
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

  return (
    <section className="mx-auto grid max-w-[1440px] gap-14 px-4 pb-24 pt-36 sm:px-8 lg:grid-cols-12 lg:px-14">
      <div className="lg:col-span-7">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-lav">{contact.eyebrow}</p>
        <h1 className="mt-4 max-w-[16em] font-display text-[clamp(34px,4.4vw,60px)] font-medium leading-[1.05] tracking-[-0.04em]">
          {contact.title}
        </h1>
        <p className="mt-5 max-w-[34em] text-lg text-muted">{contact.lead}</p>
        <div className="mt-12">
          <ContactForm lang={lang} form={contact.form} services={contact.services} bookCall={common.bookCall} />
        </div>
      </div>

      <aside className="flex flex-col gap-5 lg:col-span-4 lg:col-start-9 lg:pt-40">
        <div className="rounded-3xl border border-line bg-surface p-7">
          <h2 className="font-display text-xl font-medium tracking-[-0.02em]">{contact.orBook}</h2>
          <p className="mt-2 text-muted">{contact.orBookLead}</p>
          <Button href={site.bookingUrl} external arrow className="mt-6">
            {common.bookCall}
          </Button>
        </div>
        <div className="rounded-3xl border border-line p-7">
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-dim">{contact.emailLabel}</h2>
          <a href={`mailto:${site.email}`} dir="ltr" className="mt-3 block text-lg text-ink underline-offset-4 hover:underline">
            {site.email}
          </a>
        </div>
      </aside>
    </section>
  );
}
