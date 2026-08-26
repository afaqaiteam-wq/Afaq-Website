import { motion, useReducedMotion } from "framer-motion";

import logo from "../../../assets/logo/logo.png";
import { EASE_OUT_QUINT } from "../../../constants/motion";
import { useIsMobile } from "../../../hooks/useIsMobile";
import ContactForm from "./ContactForm";
import { ASSURANCES } from "./contact.data";

/**
 * "Let's Build Something Intelligent".
 *
 * Composition: a slim editorial column carrying three reassurances beside the
 * form panel, rather than a lone centred form — which keeps the section from
 * reading as a template drop-in while leaving the form itself uncluttered.
 *
 * Continuity is structural: identical container rails to every other section,
 * the same badge / two-line heading / twin rules, the same −40px optical shift
 * onto the Navbar logo axis, and the shared easing tokens.
 *
 * The Navbar's existing "Contact" link already points at #contact, so no
 * navigation change was needed.
 */

const Rules = () => (
  <div aria-hidden className="mt-9 flex items-center justify-center gap-5">
    <span className="h-px w-16 bg-gradient-to-r from-transparent via-violet-400/70 to-transparent sm:w-20" />
    <span className="h-px w-16 bg-gradient-to-l from-transparent via-violet-400/70 to-transparent sm:w-20" />
  </div>
);

const Contact = () => {
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();

  // Mobile: no reveal at all — no initial/whileInView/viewport/transition
  // props, so Framer never creates an IntersectionObserver or animation
  // subscription for these elements. Content renders directly in its final
  // state. Desktop keeps the exact original entrance animation.
  const reveal = (delay: number) => {
    if (isMobile) return {};

    return {
      initial: reduced ? { opacity: 0 } : { opacity: 0, y: 22, filter: "blur(8px)" },
      whileInView: reduced
        ? { opacity: 1 }
        : { opacity: 1, y: 0, filter: "blur(0px)" },
      viewport: { once: true, margin: "-80px" } as const,
      transition: {
        duration: reduced ? 0.3 : 0.7,
        delay: reduced ? 0 : delay,
        ease: EASE_OUT_QUINT,
      },
    };
  };

  return (
    <section
      id="contact"
      /* max-sm:pt gives this page's own first section extra breathing room
         under the navbar on mobile only — see Services.tsx for the full note. */
      className="
        relative overflow-hidden
        scroll-mt-[124px]
        max-sm:pt-[136px]
        pt-[clamp(96px,13vw,168px)]
        pb-[clamp(88px,11vw,148px)]
      "
    >
      {/* Section ambience — offset from the Projects pools so the two do not
          read as the same stamp, and quieter than the Hero. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        <div
          className="absolute left-1/2 top-[34%] h-[620px] w-[940px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(79,40,183,.15) 0%, rgba(79,40,183,.05) 44%, transparent 72%)",
          }}
        />

        <div
          className="
            absolute inset-0 opacity-[0.028]
            [background-image:linear-gradient(rgba(255,255,255,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.09)_1px,transparent_1px)]
            [background-size:72px_72px]
            [mask-image:radial-gradient(ellipse_74%_62%_at_50%_44%,black,transparent_80%)]
          "
        />
      </div>

      <div
        className="
          relative mx-auto w-full
          max-w-[1180px] px-6
          lg:w-[min(82vw,1440px)] lg:max-w-none lg:px-0
        "
      >
        {/* ── Header ─────────────────────────────────────────
            Shifted onto the Navbar logo's axis — see the derivation in
            Services.tsx. Gated at 1180px where the Navbar grid stops
            overflowing its pill. */}
        <div className="flex flex-col items-center text-center min-[1180px]:-translate-x-[40px]">
          <motion.span
            {...reveal(0)}
            className="
              inline-flex w-fit items-center gap-3 rounded-full
              border border-violet-500/20 bg-violet-500/5
              px-9 py-3.5
              text-[13px] font-semibold uppercase tracking-[0.2em] text-violet-300
              shadow-[0_0_20px_rgba(79,40,183,.15)]
              sm:text-[14px]
            "
          >
            ✦ Get In Touch
          </motion.span>

          <motion.h2
            {...reveal(0.09)}
            className="
              mt-9
              font-['Space_Grotesk']
              text-[32px] sm:text-[40px] lg:text-[47px]
              font-bold uppercase
              leading-[1.06] tracking-[-0.035em]
              text-white
            "
          >
            <span className="block">Let&rsquo;s Build Something</span>
            <span className="block text-violet-400">Intelligent Together</span>
          </motion.h2>

          <motion.p
            {...reveal(0.16)}
            className="
              mt-7 max-w-[680px]
              text-[15px] lg:text-[16px]
              leading-[1.9] text-white/60
            "
          >
            Tell us what you are trying to build or automate. We will read every
            message and come back with a clear view of what is possible.
          </motion.p>

          <Rules />
        </div>

        {/* ── Aside │ Form ───────────────────────────────────── */}
        <motion.div
          {...reveal(0.2)}
          className="mt-[clamp(52px,6.5vw,80px)] grid gap-6 lg:grid-cols-12 lg:gap-8"
        >
          {/* Editorial column */}
          <aside className="flex flex-col justify-between gap-10 lg:col-span-4">
            <ul className="flex flex-col gap-7">
              {ASSURANCES.map(({ title, body }, i) => (
                <li key={title} className="relative pl-7">
                  <span
                    aria-hidden
                    className="absolute left-0 top-[7px] text-[10.5px] font-semibold tracking-[0.18em] text-violet-300/45"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-['Space_Grotesk'] text-[15.5px] font-bold tracking-[-0.01em] text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-[1.7] text-white/50">
                    {body}
                  </p>
                </li>
              ))}
            </ul>

            {/* Quiet brand sign-off, echoing the modal lockups */}
            <div className="hidden items-center gap-2.5 lg:flex">
              <img
                src={logo}
                alt=""
                aria-hidden
                className="h-[20px] w-auto select-none opacity-60"
              />
              <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-white/30">
                Afaq<span className="ml-1.5 text-violet-400/60">AI</span>
              </span>
            </div>
          </aside>

          {/* Form panel */}
          <div className="relative lg:col-span-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-4 -z-10 rounded-[38px] bg-violet-600/12 blur-3xl max-sm:blur-xl"
            />

            <div
              className="
                relative overflow-hidden rounded-[26px]
                border border-white/[0.09]
                bg-white/[0.035] backdrop-blur-xl max-sm:backdrop-blur-md
                p-6 shadow-[0_18px_54px_rgba(6,4,18,.42)]
                sm:p-9
              "
            >
              <span
                aria-hidden
                className="pointer-events-none absolute left-12 right-12 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/45 to-transparent"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(90% 46% at 50% -10%, rgba(117,73,216,.12), transparent 62%)",
                }}
              />

              <div className="relative">
                <ContactForm />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
