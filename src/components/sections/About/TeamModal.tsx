import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, Check, Quote, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import logo from "../../../assets/logo/logo.png";
import { EASE_OUT_EXPO } from "../../../constants/motion";
import { BOOKING_URL } from "../../../config/booking";
import { useIsMobile } from "../../../hooks/useIsMobile";
import type { TeamMember } from "./team.data";

/**
 * Team profile modal.
 *
 * Portalled to document.body: the About section clips its overflow and sits
 * under transformed ancestors, either of which would crop a dialog rendered
 * in place. The page behind is blurred by a full-viewport backdrop-filter
 * layer rather than by filtering the page root, which would create a
 * containing block for the fixed Navbar and Background.
 *
 * lucide 1.28 no longer ships brand marks, so the LinkedIn glyph is inline.
 */
export const LinkedInGlyph = ({ size = 15 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden
  >
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
);

/** Reproduces the Hero/Navbar CTA exactly — same layered glow and gradient. */
const PrimaryButton = ({ children }: { children: React.ReactNode }) => (
  <a
    href={BOOKING_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative inline-flex h-[44px] min-w-[176px] items-center justify-center gap-2.5 overflow-hidden rounded-full px-[32px] transition-all duration-300 ease-out hover:scale-[1.03]"
  >
    <span className="absolute -inset-[3px] rounded-full bg-violet-500/30 blur-xl opacity-55 transition-all duration-300 group-hover:opacity-90 group-hover:blur-2xl" />
    <span className="absolute inset-0 rounded-full border border-[#D0C2E366] bg-[radial-gradient(circle_at_78%_25%,rgba(117,73,216,.45)_0%,transparent_30%),linear-gradient(90deg,#01010A_0%,#060612_20%,#29126E_48%,#4F28B7_72%,#7549D8_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,.28),inset_0_-8px_12px_rgba(18,10,58,.45),0_10px_24px_rgba(117,73,216,.12)]" />
    <span className="absolute left-[9px] right-[9px] top-[1px] h-[7px] rounded-full bg-gradient-to-r from-transparent via-white/55 to-transparent opacity-80" />
    <span className="absolute inset-[1px] rounded-full bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,.08),transparent_55%)] opacity-80" />
    <CalendarDays size={15} strokeWidth={2.2} className="relative z-10 text-white" />
    <span className="relative z-10 whitespace-nowrap text-[14.5px] font-semibold tracking-[-0.01em] text-white drop-shadow-[0_0_4px_rgba(255,255,255,.15)] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,.35)]">
      {children}
    </span>
  </a>
);

/** Section label, one definition for every block in the body. */
const Block = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <section>
    <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300/70">
      {label}
    </h4>
    <div className="mt-4">{children}</div>
  </section>
);

interface TeamModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

const TeamModal = ({ member, onClose }: TeamModalProps) => {
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const open = Boolean(member);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;

    // <html> is the scrolling element here, so both must be locked or the
    // page still scrolls behind the dialog.
    const { body, documentElement } = document;
    const gutter = window.innerWidth - documentElement.clientWidth;
    const prevBody = body.style.overflow;
    const prevHtml = documentElement.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    document.addEventListener("keydown", onKeyDown);
    const raf = requestAnimationFrame(() => panelRef.current?.focus());

    return () => {
      body.style.overflow = prevBody;
      documentElement.style.overflow = prevHtml;
      body.style.paddingRight = prevPad;
      document.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(raf);
      restoreRef.current?.focus?.();
    };
  }, [open, onKeyDown]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && member && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8">
          <motion.div
            className="fixed inset-0 bg-[#01010A]/72 backdrop-blur-xl max-sm:backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reduced ? 0.15 : isMobile ? 0.24 : 0.35,
              ease: "easeOut",
            }}
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-modal-name"
            tabIndex={-1}
            className="relative my-auto w-full max-w-[900px] outline-none"
            initial={
              reduced
                ? { opacity: 0 }
                : isMobile
                ? { opacity: 0, scale: 0.98, y: 10 }
                : { opacity: 0, scale: 0.96, y: 14, filter: "blur(10px)" }
            }
            animate={
              reduced
                ? { opacity: 1 }
                : isMobile
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
            }
            exit={
              reduced
                ? { opacity: 0 }
                : isMobile
                ? { opacity: 0, scale: 0.98, y: 8 }
                : { opacity: 0, scale: 0.96, y: 10, filter: "blur(10px)" }
            }
            transition={{
              duration: reduced ? 0.15 : isMobile ? 0.3 : 0.44,
              ease: EASE_OUT_EXPO,
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[44px] bg-violet-600/20 blur-3xl max-sm:blur-xl"
            />

            <div className="relative overflow-hidden rounded-[26px] border border-white/[0.10] bg-[linear-gradient(180deg,rgba(23,17,40,.92)_0%,rgba(11,7,19,.96)_100%)] shadow-[0_40px_120px_rgba(4,2,12,.7)] sm:rounded-[30px]">
              <span
                aria-hidden
                className="pointer-events-none absolute left-12 right-12 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/45 to-transparent"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(90% 52% at 50% -8%, rgba(117,73,216,.16), transparent 62%)",
                }}
              />

              {/* ── Header: portrait + identity ─────────────── */}
              <div className="relative flex items-start gap-5 border-b border-white/[0.07] px-6 py-6 sm:px-9 sm:py-8">
                <div className="relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-[20px] border border-white/[0.10] bg-gradient-to-b from-white/[0.10] to-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,.14)] sm:h-[104px] sm:w-[104px]">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <>
                      <span
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(80% 70% at 50% 12%, rgba(117,73,216,.30), transparent 68%)",
                        }}
                      />
                      <span className="relative flex h-full w-full items-center justify-center font-['Space_Grotesk'] text-[28px] font-bold tracking-[0.06em] text-violet-100/85 sm:text-[34px]">
                        {member.initials}
                      </span>
                    </>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  {member.featured && (
                    <span className="mb-2 inline-block rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                      Founder
                    </span>
                  )}

                  <h3
                    id="team-modal-name"
                    className="font-['Space_Grotesk'] text-[21px] font-bold tracking-[-0.02em] text-white sm:text-[26px]"
                  >
                    {member.name}
                  </h3>

                  <p className="mt-1.5 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-violet-300/85 sm:text-[12.5px]">
                    {member.role}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <img
                      src={logo}
                      alt=""
                      aria-hidden
                      className="h-[16px] w-auto select-none opacity-70"
                    />
                    <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-white/35">
                      Afaq<span className="ml-1.5 text-violet-400/70">AI</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.03] text-white/55 transition-all duration-300 hover:border-violet-400/35 hover:bg-white/[0.07] hover:text-white"
                >
                  <X size={16} strokeWidth={2.2} />
                </button>
              </div>

              {/* ── Body ────────────────────────────────────── */}
              <div className="relative max-h-[min(60vh,600px)] overflow-y-auto overscroll-contain px-6 py-8 sm:px-9">
                <div className="flex flex-col gap-10">
                  <p className="text-[15px] leading-[1.85] text-white/70 lg:text-[16px]">
                    {member.bio}
                  </p>

                  <div className="grid gap-10 md:grid-cols-2">
                    <Block label="Core Skills">
                      <ul className="flex flex-wrap gap-2.5">
                        {member.skills.map((s) => (
                          <li
                            key={s}
                            className="rounded-full border border-white/[0.09] bg-white/[0.04] px-3.5 py-2 text-[12.5px] font-medium text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,.06)] transition-colors duration-300 hover:border-violet-400/30 hover:text-white"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </Block>

                    <Block label="Technologies">
                      <ul className="flex flex-wrap gap-2.5">
                        {member.tech.map((t) => (
                          <li
                            key={t}
                            className="rounded-full border border-violet-500/20 bg-violet-500/[0.07] px-3.5 py-2 text-[12.5px] font-medium text-violet-200/85 transition-colors duration-300 hover:border-violet-400/35 hover:text-white"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </Block>
                  </div>

                  <Block label="Experience Highlights">
                    <ul className="flex flex-col gap-3.5">
                      {member.highlights.map((h) => (
                        <li key={h} className="flex gap-3.5">
                          <span
                            aria-hidden
                            className="mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-violet-400/25 bg-violet-500/10"
                          >
                            <Check size={11} strokeWidth={3} className="text-violet-300" />
                          </span>
                          <span className="text-[14px] leading-[1.7] text-white/65">
                            {h}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Block>

                  {/* Quote — the one moment of scale in the body */}
                  <figure className="relative overflow-hidden rounded-[20px] border border-white/[0.07] bg-white/[0.025] px-6 py-6 sm:px-8">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(70% 100% at 0% 0%, rgba(117,73,216,.12), transparent 62%)",
                      }}
                    />
                    <Quote
                      aria-hidden
                      size={18}
                      strokeWidth={2}
                      className="relative text-violet-300/60"
                    />
                    <blockquote className="relative mt-3 font-['Space_Grotesk'] text-[16px] font-medium leading-[1.65] tracking-[-0.01em] text-white/85 sm:text-[18px]">
                      “{member.quote}”
                    </blockquote>
                    <figcaption className="relative mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                      {member.name}
                    </figcaption>
                  </figure>
                </div>
              </div>

              {/* ── Footer ──────────────────────────────────── */}
              <div className="relative flex flex-col gap-3 border-t border-white/[0.07] px-6 py-6 sm:flex-row sm:items-center sm:gap-4 sm:px-9">
                <PrimaryButton>Book a Call</PrimaryButton>

                {/* Rendered only when a real URL exists — see team.data.ts */}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-[44px] min-w-[176px] items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/[0.03] px-8 text-[14px] font-semibold text-white backdrop-blur-xl max-sm:backdrop-blur-md transition-all duration-300 hover:border-violet-400/40 hover:bg-white/[0.06]"
                  >
                    <LinkedInGlyph />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default TeamModal;