/**
 * Footer navigation and contact configuration.
 *
 * ─────────────────────────────────────────────────────────────
 * FILL THESE IN — social links still intentionally empty until real.
 *
 * Nothing here was invented. The codebase contains no social profiles for
 * LinkedIn yet, so rather than shipping a plausible-looking placeholder that
 * could end up live, each entry renders only once it has a real value:
 *
 *   • `EMAIL` empty  → the email row is not rendered (it sits alongside,
 *     not instead of, the "Send us a message" link — see Footer.tsx)
 *   • a social `href` empty → that icon is not rendered
 *
 * This mirrors how the About section handles its empty LinkedIn fields.
 * If you later want these shared beyond the footer, lift this to
 * `src/config/site.ts` alongside the EmailJS config.
 * ─────────────────────────────────────────────────────────────
 */

/** Public contact address. Leave empty to hide the email row. */
export const EMAIL = "afaq.ai.team@gmail.com";

export interface FooterLink {
  label: string;
  /**
   * A route path, optionally with a `#section` hash for a destination that
   * lives partway down a page rather than at its top (e.g. the About page's
   * Why Choose AFAQ / Our Process sub-sections). Passed straight to
   * React Router's `<Link to>`.
   */
  href: string;
}

export interface FooterGroup {
  heading: string;
  links: FooterLink[];
}

/**
 * Only real destinations — every route below is registered in App.tsx, and
 * every hash target is a section id that exists on the page it points into.
 * No Privacy or Terms links are included since those pages don't exist —
 * they would 404.
 */
export const FOOTER_NAV: FooterGroup[] = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Why Choose AFAQ", href: "/services#why-choose" },
      { label: "Our Process", href: "/about#process" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { label: "Services", href: "/services" },
      { label: "Technologies", href: "/#technologies" },
      { label: "Featured Projects", href: "/projects" },
    ],
  },
];

export type SocialId = "facebook" | "linkedin";

export interface SocialLink {
  id: SocialId;
  label: string;
  /** Full profile URL. Empty hides the link entirely. */
  href: string;
}

export const SOCIALS: SocialLink[] = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/1bBoJGiTi7/?mibextid=wwXIfr",
  },
  {
    // Placeholder until the real profile URL is available — swap the "#" for
    // the URL and nothing else needs to change. While it is "#", the link is
    // rendered but goes nowhere.
    id: "linkedin",
    label: "LinkedIn",
    href: "#",
  },
];
