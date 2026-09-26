import Link from "next/link";

import { LogoMark } from "@/components/brand/LogoMark";
import { HomeLink } from "@/components/layout/HomeLink";
import { Button } from "@/components/ui/Button";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { site, whatsappUrl } from "@/lib/site";

interface FooterProps {
  lang: Locale;
  dict: Dictionary;
}

export function Footer({ lang, dict }: FooterProps) {
  const { footer, nav, meta } = dict;
  const year = new Date().getFullYear();

  const groups = [
    {
      heading: footer.company,
      links: [
        { label: nav.about, to: "/about" },
        { label: nav.work, to: "/work" },
        { label: nav.contact, to: "/contact" },
      ],
    },
    {
      heading: footer.explore,
      links: [
        { label: nav.home, to: "/" },
        { label: nav.services, to: "/services" },
      ],
    },
  ];

  const linkCls = "inline-flex min-h-8 items-center text-sm text-muted transition-colors hover:text-ink";

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-12 lg:px-14">
        <div className="lg:col-span-5">
          <HomeLink lang={lang} className="inline-flex items-center gap-2.5" label={meta.siteName}>
            <LogoMark size={30} />
            <span className="font-display text-lg font-semibold tracking-[-0.02em]">{meta.siteName}</span>
          </HomeLink>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{footer.tagline}</p>
          <Button href={site.bookingUrl} external arrow size="sm" className="mt-6">
            {dict.common.bookCall}
          </Button>
        </div>

        {groups.map((g) => (
          <div key={g.heading} className="lg:col-span-2">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-soft">{g.heading}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {g.links.map((l) => (
                <li key={l.to}>
                  <Link href={href(lang, l.to)} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="lg:col-span-3">
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-soft">{footer.talk}</h2>
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <a href={`mailto:${site.email}`} className={linkCls} dir="ltr">
                {site.email}
              </a>
            </li>
            {site.whatsapp && (
              <li>
                <a href={whatsappUrl(site.whatsapp)} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  WhatsApp
                </a>
              </li>
            )}
            {site.socials.linkedin && (
              <li>
                <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  LinkedIn
                </a>
              </li>
            )}
            <li>
              <a href={site.socials.facebook} target="_blank" rel="noopener noreferrer" className={linkCls}>
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* The name on the horizon: a glowing line and the wordmark rising from behind it. */}
      <div aria-hidden="true" className="relative overflow-hidden">
        <div className="mx-auto h-px max-w-[1440px] bg-[linear-gradient(90deg,transparent,rgba(200,168,255,.7),transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-24 max-w-3xl bg-[radial-gradient(ellipse_at_top,rgba(124,77,255,.22),transparent_70%)]" />
        <p className="select-none bg-[linear-gradient(180deg,rgba(255,255,255,.22),rgba(255,255,255,.02)_78%)] bg-clip-text pt-2 text-center font-display text-[clamp(84px,19vw,300px)] font-semibold leading-[0.9] tracking-[-0.05em] text-transparent">
          {lang === "ar" ? "آفاق" : "AFAQ"}
        </p>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 border-t border-line px-4 py-6 text-sm text-dim sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-14">
        <p>
          © {year} {meta.siteName}. {footer.rights}
        </p>
        <a href="#main" className="inline-flex min-h-8 items-center transition-colors hover:text-ink">
          {footer.backToTop}
        </a>
      </div>
    </footer>
  );
}
