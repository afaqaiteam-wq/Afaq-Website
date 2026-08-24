import { ArrowUp, CalendarDays, Mail, Send } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

import logo from "../../../assets/logo/logo.png";
import { EASE_OUT_QUINT } from "../../../constants/motion";
import { BOOKING_URL } from "../../../config/booking";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { EMAIL, FOOTER_NAV, SOCIALS, type SocialId } from "./footer.data";

/**
 * Site footer — the closing chapter.
 *
 * Deliberately calmer than the Hero: one decorative element only (a soft
 * radial glow behind the closing CTA), no grid overlay, no particles. The
 * container rails, badge, heading treatment, button markup and easing tokens
 * are all the site's existing ones, so this reads as the same document rather
 * than an appended template.
 *
 * Everything that would require data we do not have — email, socials, Privacy
 * and Terms — is either configuration-gated (see footer.data.ts) or omitted.
 * Nothing links to a route that does not exist.
 *
 * lucide 1.28 dropped brand marks, so the two social glyphs are inline.
 */

const SOCIAL_GLYPHS: Record<SocialId, React.ReactNode> = {
  facebook: (
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
  ),
  linkedin: (
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  ),
};

/** Reproduces the Hero/Navbar CTA exactly — same layered glow and gradient. */
const PrimaryLink = ({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Link
    to={href}
    className="
      group relative inline-flex h-[48px] min-w-[196px] items-center justify-center gap-2.5
      overflow-hidden rounded-full px-[34px] outline-none
      transition-all duration-300 ease-out
      hover:scale-[1.03]
      focus-visible:ring-2 focus-visible:ring-violet-400/60
    "
  >
    <span className="absolute -inset-[3px] rounded-full bg-violet-500/30 opacity-55 blur-xl transition-all duration-300 group-hover:opacity-90 group-hover:blur-2xl" />
    <span className="absolute inset-0 rounded-full border border-[#D0C2E366] bg-[radial-gradient(circle_at_78%_25%,rgba(117,73,216,.45)_0%,transparent_30%),linear-gradient(90deg,#01010A_0%,#060612_20%,#29126E_48%,#4F28B7_72%,#7549D8_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,.28),inset_0_-8px_12px_rgba(18,10,58,.45),0_10px_24px_rgba(117,73,216,.12)]" />
    <span className="absolute left-[9px] right-[9px] top-[1px] h-[7px] rounded-full bg-gradient-to-r from-transparent via-white/55 to-transparent opacity-80" />
    <span className="absolute inset-[1px] rounded-full bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,.08),transparent_55%)] opacity-80" />
    <span className="relative z-10 text-white">{icon}</span>
    <span className="relative z-10 whitespace-nowrap text-[15px] font-semibold tracking-[-0.01em] text-white drop-shadow-[0_0_4px_rgba(255,255,255,.15)]">
      {children}
    </span>
  </Link>
);

/** The site's outlined glass secondary. */
const SecondaryLink = ({
  href,
  icon,
  children,
  target,
  rel,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}) => (
  <a
    href={href}
    target={target}
    rel={rel}
    className="
      group inline-flex h-[48px] min-w-[196px] items-center justify-center gap-2.5
      rounded-full border border-white/15 bg-white/[0.03] px-8
      text-[15px] font-semibold text-white outline-none backdrop-blur-xl max-sm:backdrop-blur-md
      transition-all duration-300
      hover:border-violet-400/40 hover:bg-white/[0.06]
      focus-visible:ring-2 focus-visible:ring-violet-400/60
    "
  >
    <span className="text-violet-200/80">{icon}</span>
    {children}
  </a>
);

const LINK =
  "text-[14px] leading-[1.7] text-white/50 outline-none transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:underline focus-visible:decoration-violet-400/60 focus-visible:underline-offset-4";

const Footer = () => {
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const socials = SOCIALS.filter((s) => s.href);

  /**
   * The closing CTA (badge, heading, description, buttons) and its dedicated
   * glow are Home-only. Everything else in this file — divider, brand/nav/
   * contact, bottom bar, and this component's own padding — is unchanged and
   * still renders on every page. Gated in place rather than relocated: both
   * pieces keep the exact DOM position and surrounding padding/margin
   * context they've always had, so Home's spacing can't drift by even a
   * pixel — only whether they render changes.
   */
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  // Mobile: no reveal at all — no initial/whileInView/viewport/transition
  // props, so Framer never creates an IntersectionObserver or animation
  // subscription for these elements. Content renders directly in its final
  // state. Desktop keeps the exact original entrance animation.
  const reveal = (delay: number) => {
    if (isMobile) return {};

    return {
      initial: reduced ? { opacity: 0 } : { opacity: 0, y: 20, filter: "blur(6px)" },
      whileInView: reduced
        ? { opacity: 1 }
        : { opacity: 1, y: 0, filter: "blur(0px)" },
      viewport: { once: true, margin: "-70px" } as const,
      transition: {
        duration: reduced ? 0.3 : 0.6,
        delay: reduced ? 0 : delay,
        ease: EASE_OUT_QUINT,
      },
    };
  };

  return (
    <footer className="relative overflow-hidden pt-[clamp(88px,11vw,150px)]">
      {/* The one decorative element: a soft radial glow behind the closing CTA.
          Home only — see isHome above. */}
      {isHome && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[620px] w-[1020px] -translate-x-1/2 -translate-y-[38%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(79,40,183,.16) 0%, rgba(79,40,183,.05) 44%, transparent 72%)",
          }}
        />
      )}

      <div
        className="
          relative mx-auto w-full
          max-w-[1180px] px-6
          lg:w-[1000px] lg:max-w-[82vw] lg:px-0
        "
      >
        {/* ── Closing CTA ─────────────────────────────────────
            Carries the same −40px optical shift as every other centred
            heading on the site, gated at 1180px. See Technologies.tsx.
            Home only — see isHome above. */}
        {isHome && (
          <motion.div
            {...reveal(0)}
            className="flex flex-col items-center text-center min-[1180px]:-translate-x-[40px]"
          >
            <span
              className="
                inline-flex w-fit items-center gap-3 rounded-full
                border border-violet-500/20 bg-violet-500/5
                px-9 py-3.5
                text-[13px] font-semibold uppercase tracking-[0.2em] text-violet-300
                shadow-[0_0_20px_rgba(79,40,183,.15)]
                sm:text-[14px]
              "
            >
              ✦ Let&rsquo;s Build The Future
            </span>

            <h2
              className="
                mt-9
                font-['Space_Grotesk']
                text-[32px] sm:text-[40px] lg:text-[47px]
                font-bold uppercase
                leading-[1.06] tracking-[-0.035em]
                text-white
              "
            >
              <span className="block">Ready to Build</span>
              <span className="block text-violet-400">Something Intelligent?</span>
            </h2>

            <p className="mt-7 max-w-[620px] text-[15px] leading-[1.9] text-white/60 lg:text-[16px]">
              Have an idea, a workflow that needs automation, or a product you
              want to bring to life? Let&rsquo;s build it together.
            </p>

            <div className="mt-11 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
              <PrimaryLink
                href="/contact"
                icon={<Send size={15} strokeWidth={2.2} aria-hidden />}
              >
                Start a Project
              </PrimaryLink>

              <SecondaryLink
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                icon={<CalendarDays size={15} strokeWidth={2.2} aria-hidden />}
              >
                Book a Call
              </SecondaryLink>
            </div>
          </motion.div>
        )}

        {/* ── Divider ─────────────────────────────────────────── */}
        <div
          aria-hidden
          className="mt-[clamp(64px,8vw,110px)] h-px w-full bg-gradient-to-r from-transparent via-white/[0.09] to-transparent"
        />

        {/* ── Brand │ Nav │ Contact ───────────────────────────── */}
        <motion.div
          {...reveal(0.08)}
          className="grid gap-12 py-[clamp(48px,6vw,72px)] md:grid-cols-2 lg:grid-cols-12 lg:gap-10"
        >
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link
              to="/"
              aria-label="AFAQ AI — home"
              className="inline-flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 rounded-xl"
            >
              <img
                src={logo}
                alt=""
                aria-hidden
                className="h-[38px] w-auto select-none"
                style={{ filter: "drop-shadow(0 0 22px rgba(79,40,183,.45))" }}
              />
              <span className="font-['Space_Grotesk'] text-[15px] font-medium uppercase tracking-[0.28em] leading-none text-white">
                Afaq<span className="ml-2 text-[#A47CED]">AI</span>
              </span>
            </Link>

            <p className="mt-6 max-w-[340px] text-[14px] leading-[1.8] text-white/50">
              Building intelligent systems, AI-powered products and digital
              experiences for ambitious businesses.
            </p>
          </div>

          {/* Navigation */}
          {FOOTER_NAV.map((group) => (
            <nav
              key={group.heading}
              aria-label={group.heading}
              className="lg:col-span-2"
            >
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300/70">
                {group.heading}
              </h3>
              <ul className="mt-5 flex flex-col gap-3.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className={LINK}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300/70">
              Let&rsquo;s Talk
            </h3>

            <div className="mt-5 flex flex-col gap-4">
              {EMAIL ? (
                <a
                  href={`mailto:${EMAIL}`}
                  className={`inline-flex items-center gap-2.5 ${LINK}`}
                >
                  <Mail size={15} strokeWidth={1.8} aria-hidden className="shrink-0 text-violet-300/70" />
                  {EMAIL}
                </a>
              ) : (
                <Link to="/contact" className={`inline-flex items-center gap-2.5 ${LINK}`}>
                  <Mail size={15} strokeWidth={1.8} aria-hidden className="shrink-0 text-violet-300/70" />
                  Send us a message
                </Link>
              )}

              {socials.length > 0 && (
                <ul className="mt-1 flex flex-wrap items-center gap-2.5">
                  {socials.map((s) => {
                    // "#" is the LinkedIn placeholder — it must not open a tab
                    // or advertise itself as an external destination.
                    const external = s.href !== "#";

                    return (
                      <li key={s.id}>
                        <a
                          href={s.href}
                          {...(external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="
                            inline-flex items-center gap-2 rounded-full
                            border border-white/[0.09] bg-white/[0.03]
                            px-3 py-1.5
                            text-[13px] leading-none text-white/50
                            outline-none transition-all duration-300
                            hover:border-violet-400/35 hover:bg-white/[0.06] hover:text-white
                            focus-visible:ring-2 focus-visible:ring-violet-400/60
                          "
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width={14}
                            height={14}
                            fill="currentColor"
                            aria-hidden
                            className="shrink-0 text-violet-300/70 transition-colors duration-300 group-hover:text-violet-200"
                          >
                            {SOCIAL_GLYPHS[s.id]}
                          </svg>
                          {s.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Bottom bar ──────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-4 border-t border-white/[0.07] py-8 sm:flex-row sm:justify-between">
          <p className="text-[12.5px] text-white/35">
            © 2026 AFAQ AI. All rights reserved.
          </p>

          <button
            type="button"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
            }
            className="
              group inline-flex items-center gap-2 rounded-full
              text-[12.5px] text-white/35 outline-none
              transition-colors duration-300
              hover:text-white
              focus-visible:ring-2 focus-visible:ring-violet-400/60
            "
          >
            Back to top
            <ArrowUp
              size={13}
              strokeWidth={2.2}
              aria-hidden
              className="transition-[translate] duration-300 group-hover:-translate-y-[2px]"
            />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
