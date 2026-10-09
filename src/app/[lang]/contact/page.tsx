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
  const card =
    "relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-[linear-gradient(180deg,rgb(255_255_255/0.035),rgb(255_255_255/0.008))] p-7 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] sm:p-10";
  const iconTile =
    "relative grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-lav shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]";

  const bookCard = (
    <div data-spotlight className={`${card} border-lav/25`}>
      {/* a hairline of light along the top edge, and an orbit in the corner */}
      <div
        aria-hidden="true"
        className="absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,#c8a8ff,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-28 -top-28 size-72 rounded-full bg-[radial-gradient(circle,rgb(124_77_255/0.28),transparent_68%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -end-16 -top-16 size-56 rounded-full border border-lav/15">
        {/* a planet on the ring, on its inner side where it can't sit on the heading */}
        <span className="absolute start-0 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lav shadow-[0_0_10px_#c8a8ff] rtl:translate-x-1/2" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute -end-6 -top-6 size-32 rounded-full border border-lav/10" />

      <span aria-hidden="true" className={iconTile}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="5" width="17" height="15" rx="3" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
          <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <h2 className="relative mt-8 font-display text-[clamp(24px,2.2vw,30px)] font-semibold tracking-[-0.025em]">{contact.orBook}</h2>
      <p className="relative mt-3 max-w-[30em] text-[17px] leading-relaxed text-muted">{contact.orBookLead}</p>
      <div className="relative mt-auto pt-10">
        <Button href={site.bookingUrl} external arrow>
          {common.bookCall}
        </Button>
      </div>
    </div>
  );

  const emailIcon = (
    <span aria-hidden="true" className={iconTile}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M4 7.5l8 5.5 8-5.5" />
      </svg>
    </span>
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
              {bookCard}
              <div className="flex items-center gap-5 rounded-3xl border border-line p-6 sm:p-7">
                {emailIcon}
                <div className="min-w-0">
                  <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-dim">{contact.emailLabel}</h2>
                  <a href={`mailto:${site.email}`} dir="ltr" className="mt-1 inline-flex min-h-11 items-center text-lg text-ink underline-offset-4 hover:underline">
                    {site.email}
                  </a>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-2 lg:gap-6">
            <div data-reveal className="h-full">
              {bookCard}
            </div>
            <div data-reveal style={delay(120)} className="h-full">
              <div data-spotlight className={card}>
                {emailIcon}
                <h2 className="mt-8 font-display text-[clamp(24px,2.2vw,30px)] font-semibold tracking-[-0.025em]">{contact.direct.title}</h2>
                <p className="mt-3 max-w-[30em] text-[17px] leading-relaxed text-muted">{contact.direct.lead}</p>
                <div className="mt-auto pt-10">
                  <a
                    href={`mailto:${site.email}`}
                    dir="ltr"
                    className="inline-flex min-h-11 max-w-full items-center break-all font-display text-[clamp(22px,2.4vw,32px)] tracking-[-0.02em] text-ink underline-offset-[6px] decoration-lav/50 hover:underline"
                  >
                    {site.email}
                  </a>
                  {/* Full-width on phones so the two buttons line up instead of wrapping unevenly */}
                  <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
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
            </div>
          </div>
        )}
      </section>
    </>
  );
}
