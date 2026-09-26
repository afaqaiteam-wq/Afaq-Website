import Link from "next/link";

import { LogoMark } from "@/components/brand/LogoMark";
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

  const linkCls = "text-sm text-muted transition-colors hover:text-ink";

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-12 lg:px-14">
        <div className="lg:col-span-5">
          <Link href={href(lang, "/")} className="inline-flex items-center gap-2.5">
            <LogoMark size={30} />
            <span className="font-display text-lg font-medium tracking-[-0.02em]">{meta.siteName}</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{footer.tagline}</p>
        </div>

        {groups.map((g) => (
          <div key={g.heading} className="lg:col-span-2">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-dim">{g.heading}</h2>
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
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-dim">{footer.talk}</h2>
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <a href={`mailto:${site.email}`} className={linkCls} dir="ltr">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>
                {dict.common.bookCall}
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

      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 border-t border-line px-4 py-6 text-sm text-dim sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-14">
        <p>
          © {year} {meta.siteName}. {footer.rights}
        </p>
        <a href="#main" className="transition-colors hover:text-ink">
          {footer.backToTop}
        </a>
      </div>
    </footer>
  );
}
