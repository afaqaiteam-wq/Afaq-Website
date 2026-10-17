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

  // 44px tall so each link is an easy tap target on phones.
  const linkCls = "inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-ink";

  return (
    <footer className="relative">
      <div aria-hidden="true" className="h-px bg-[linear-gradient(90deg,transparent,rgba(140,92,255,.55)_50%,transparent)]" />
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-10 px-4 py-16 sm:px-8 lg:grid-cols-12 lg:px-14">
        <div className="col-span-2 lg:col-span-5">
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
            <ul className="mt-3 flex flex-col">
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

        <div className="col-span-2 lg:col-span-3">
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-soft">{footer.talk}</h2>
          <ul className="mt-3 flex flex-col">
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

      <div className="mx-auto flex max-w-[1440px] flex-col gap-1 border-t border-line px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 text-sm text-dim sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-14">
        <p>
          © {year} {meta.siteName}. {footer.rights}
        </p>
        <a href="#main" className="inline-flex min-h-11 items-center transition-colors hover:text-ink">
          {footer.backToTop}
        </a>
      </div>
    </footer>
  );
}
