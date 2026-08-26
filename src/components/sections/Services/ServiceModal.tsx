import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, CalendarDays, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import logo from "../../../assets/logo/logo.png";
import { EASE_OUT_EXPO } from "../../../constants/motion";
import { BOOKING_URL } from "../../../config/booking";
import { useIsMobile } from "../../../hooks/useIsMobile";
import ServiceDetails from "./ServiceDetails";
import { SERVICE_DETAILS } from "./serviceDetails.data";
import type { Service } from "./services.data";

/**
 * Service detail modal.
 *
 * Rendered through a portal on document.body: the Services section clips its
 * overflow and sits inside transformed ancestors, either of which would trap
 * or crop a fixed-position dialog rendered in place.
 *
 * The page behind is blurred by a full-viewport `backdrop-filter` layer rather
 * than by filtering the page root — a filter on an ancestor creates a
 * containing block for fixed descendants, which would break both the fixed
 * Navbar and the fixed Background beneath it.
 */

/* ==========================================================
   BUTTONS

   Deliberately reproduce the Hero/Navbar CTA markup rather than inventing a
   new style: same layered glow, gradient body, top highlight and inner light
   on the primary; same outlined glass on the secondary. Defined once here so
   the modal itself stays free of duplicated class strings.
========================================================== */

const PrimaryButton = ({ children }: { children: React.ReactNode }) => (
  <a
    href={BOOKING_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="
      group relative inline-flex items-center justify-center gap-2.5
      h-[44px] min-w-[180px] px-[34px]
      rounded-full overflow-hidden
      transition-all duration-300 ease-out
      hover:scale-[1.03]
    "
  >
    <span className="absolute -inset-[3px] rounded-full bg-violet-500/30 blur-xl opacity-55 transition-all duration-300 group-hover:opacity-90 group-hover:blur-2xl" />
    <span className="absolute inset-0 rounded-full border border-[#D0C2E366] bg-[radial-gradient(circle_at_78%_25%,rgba(117,73,216,.45)_0%,transparent_30%),linear-gradient(90deg,#01010A_0%,#060612_20%,#29126E_48%,#4F28B7_72%,#7549D8_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,.28),inset_0_-8px_12px_rgba(18,10,58,.45),0_10px_24px_rgba(117,73,216,.12)]" />
    <span className="absolute left-[9px] right-[9px] top-[1px] h-[7px] rounded-full bg-gradient-to-r from-transparent via-white/55 to-transparent opacity-80" />
    <span className="absolute inset-[1px] rounded-full bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,.08),transparent_55%)] opacity-80" />
    <CalendarDays
      size={15}
      strokeWidth={2.2}
      className="relative z-10 text-white drop-shadow-[0_0_4px_rgba(255,255,255,.25)]"
    />
    <span className="relative z-10 whitespace-nowrap text-[15px] font-semibold tracking-[-0.01em] text-white drop-shadow-[0_0_4px_rgba(255,255,255,.15)] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,.35)]">
      {children}
    </span>
  </a>
);

const SecondaryButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="
      group inline-flex h-[44px] min-w-[180px] items-center justify-center gap-3
      rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-xl max-sm:backdrop-blur-md px-8
      text-[14px] font-semibold text-white
      transition-all duration-300
      hover:border-violet-400/40 hover:bg-white/[0.06]
    "
  >
    <ArrowLeft
      size={16}
      strokeWidth={2.2}
      aria-hidden
      className="transition-[translate] duration-300 group-hover:-translate-x-1"
    />
    {children}
  </button>
);

/* ========================================================== */

interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
}

const ServiceModal = ({ service, onClose }: ServiceModalProps) => {
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const panelRef = useRef<HTMLDivElement>(null);
  /** Element that had focus before opening, restored on close. */
  const restoreRef = useRef<HTMLElement | null>(null);

  const open = Boolean(service);

  /** ESC to close, and a Tab loop so focus cannot escape the dialog. */
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;

    // Lock the page behind the modal. The scrolling element here is <html>,
    // not <body>, so locking body alone leaves the page scrollable — both are
    // set. The scrollbar's width is replaced with padding so the layout
    // underneath does not jump sideways as it disappears.
    const { body, documentElement } = document;
    const gutter = window.innerWidth - documentElement.clientWidth;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = documentElement.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    document.addEventListener("keydown", onKeyDown);
    // Move focus into the dialog once it exists.
    const raf = requestAnimationFrame(() => panelRef.current?.focus());

    return () => {
      body.style.overflow = prevBodyOverflow;
      documentElement.style.overflow = prevHtmlOverflow;
      body.style.paddingRight = prevPadding;
      document.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(raf);
      restoreRef.current?.focus?.();
    };
  }, [open, onKeyDown]);

  if (typeof document === "undefined") return null;

  const detail = service ? SERVICE_DETAILS[service.id] : undefined;

  return createPortal(
    <AnimatePresence>
      {open && service && detail && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8">
          {/* Backdrop — blurs and darkens the page, and closes on click */}
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

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
            tabIndex={-1}
            className="
              relative my-auto w-full max-w-[880px] outline-none
              lg:max-w-[900px]
            "
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
            {/* Outer violet bloom */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[44px] bg-violet-600/20 blur-3xl max-sm:blur-xl"
            />

            <div
              className="
                relative overflow-hidden rounded-[26px] sm:rounded-[30px]
                border border-white/[0.10]
                bg-[linear-gradient(180deg,rgba(23,17,40,.92)_0%,rgba(11,7,19,.96)_100%)]
                shadow-[0_40px_120px_rgba(4,2,12,.7)]
              "
            >
              {/* Top edge highlight — the motif from the Hero button and cards */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-12 right-12 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/45 to-transparent"
              />
              {/* Interior key light, so the panel reads as lit from above */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(90% 52% at 50% -8%, rgba(117,73,216,.16), transparent 62%)",
                }}
              />

              {/* ── Header ─────────────────────────────────── */}
              <div className="relative flex items-start gap-4 border-b border-white/[0.07] px-6 py-6 sm:gap-5 sm:px-9 sm:py-7">
                <div
                  className="
                    relative flex h-[50px] w-[50px] shrink-0 items-center justify-center
                    rounded-[15px] border border-white/[0.10]
                    bg-gradient-to-b from-white/[0.09] to-white/[0.02]
                    shadow-[inset_0_1px_0_rgba(255,255,255,.12)]
                  "
                >
                  <service.Icon
                    size={22}
                    strokeWidth={1.6}
                    className="text-violet-200"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h3
                      id="service-modal-title"
                      className="font-['Space_Grotesk'] text-[20px] font-bold tracking-[-0.02em] text-white sm:text-[23px]"
                    >
                      {service.title}
                    </h3>

                    <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300">
                      {detail.category}
                    </span>
                  </div>

                  {/* Brand lockup — quietly signs the panel */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <img
                      src={logo}
                      alt=""
                      aria-hidden
                      className="h-[18px] w-auto select-none opacity-70"
                    />
                    <span className="text-[10.5px] font-medium uppercase tracking-[0.26em] text-white/35">
                      Afaq<span className="ml-1.5 text-violet-400/70">AI</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="
                    group -mr-1 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center
                    rounded-full border border-violet-400/25 bg-white/[0.05]
                    text-white/70
                    transition-all duration-300
                    hover:scale-110 hover:border-violet-400/55 hover:bg-violet-500/10
                    hover:text-white hover:shadow-[0_0_16px_rgba(164,124,237,.5)]
                    focus-visible:scale-110 focus-visible:border-violet-400/55
                    focus-visible:text-white focus-visible:shadow-[0_0_16px_rgba(164,124,237,.5)]
                    focus-visible:ring-2 focus-visible:ring-violet-400/60
                  "
                >
                  <X size={18} strokeWidth={2.2} />
                </button>
              </div>

              {/* ── Body ───────────────────────────────────── */}
              <div className="relative max-h-[min(62vh,620px)] overflow-y-auto overscroll-contain px-6 py-8 sm:px-9 sm:py-9">
                <ServiceDetails detail={detail} />
              </div>

              {/* ── Footer ─────────────────────────────────── */}
              <div className="relative flex flex-col gap-3 border-t border-white/[0.07] px-6 py-6 sm:flex-row sm:items-center sm:gap-4 sm:px-9">
                <PrimaryButton>Book a Call</PrimaryButton>
                <SecondaryButton onClick={onClose}>
                  Back to Services
                </SecondaryButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ServiceModal;