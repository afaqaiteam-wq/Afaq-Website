import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  D,
  EASE_OUT_EXPO,
  EASE_OUT_QUINT,
  T,
} from "../../../constants/motion";
import { BOOKING_URL } from "../../../config/booking";

/**
 * Heading lines, previously separated by <br />. Rendered as block-level
 * spans so each can be revealed independently — with leading-[0.90] on the
 * parent the resulting line boxes are identical to the <br /> version.
 */
const TITLE_LINES: { text: string; accent?: boolean }[] = [
  { text: "BUILD" },
  { text: "INTELLIGENT AI", accent: true },
  { text: "FOR MODERN" },
  { text: "BUSINESSES." },
];

const HeroContent = () => {
  const reduced = useReducedMotion();

  /** Blur-to-sharp rise. Reduced motion gets the rise without the filter. */
  const revealFrom = (y = 26) =>
    reduced ? { opacity: 0 } : { opacity: 0, y, filter: "blur(12px)" };

  const revealTo = reduced
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: "blur(0px)" };

  return (
    <div
      className="
        w-full
        max-w-[560px]
        lg:max-w-none

        mx-auto

        flex
        flex-col

        items-center
        text-center

        lg:items-start
        lg:text-left
      "
    >
      {/* Badge */}

      <motion.div
        className="
          inline-flex
          w-fit

          items-center
          gap-2

          rounded-full

          border
          border-violet-500/20

          bg-violet-500/5

          px-5
          py-2.5

          text-[9px]
          sm:text-[10px]

          font-semibold

          uppercase

          tracking-[0.18em]

          text-violet-300

          shadow-[0_0_20px_rgba(79,40,183,.15)]
        "
        initial={revealFrom(14)}
        animate={revealTo}
        transition={{
          duration: reduced ? 0.3 : 0.65,
          delay: reduced ? 0 : T.badge,
          ease: EASE_OUT_QUINT,
        }}
      >
        ✦ Intelligent Solutions. Automated Growth.
      </motion.div>
      {/* Title */}

      <div className="mt-16 lg:mt-[48px]">
        <h1
          className="
            font-['Space_Grotesk']

            text-[42px]
            sm:text-[50px]
            lg:text-[58px]
            xl:text-[64px]

            font-bold

            leading-[0.90]

            tracking-[-0.05em]

            text-white
          "
        >
          {TITLE_LINES.map((line, i) => (
            <motion.span
              key={line.text}
              // lg:whitespace-nowrap guarantees the intended four-line
              // structure on desktop regardless of column width. Left to wrap
              // freely below lg, where the smaller type still fits.
              //
              // The accent line ("INTELLIGENT AI") gets one continuous
              // left-to-right gradient across the whole string, starting at
              // the very first pixel of "I" — no separate solid-white
              // section, and no flat/near-white hold at the start either:
              // the second stop (light lavender) lands at 22% instead of the
              // 45-70% range used previously, so the shift is already
              // visible by "T" rather than only becoming noticeable past the
              // midpoint. Stops: #F5F0FF (almost-white lavender start) ->
              // violet-200 (#D0C2E3) -> violet-300/400 (#A47CED, the "AFAQ
              // purple" used for the wordmark/CTA accents elsewhere) -> a
              // strong purple between that and --primary -> --primary
              // (#7d24a7), so "AI" lands on the deepest tone. bg-clip-text +
              // transparent color is the standard gradient-text technique;
              // the -webkit-text-fill-color override matches it for Safari.
              // No other line is touched, and this doesn't interact with the
              // color animation below, which only ever applied to
              // non-accent lines.
              className={`block lg:whitespace-nowrap ${
                line.accent
                  ? "bg-[linear-gradient(90deg,#F5F0FF_0%,#D0C2E3_22%,#A47CED_48%,#8B2FB8_72%,#7d24a7_100%)] bg-clip-text text-transparent [-webkit-text-fill-color:transparent]"
                  : ""
              }`}
              initial={
                reduced
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: 30,
                      filter: "blur(14px)",
                      // Lines resolve through a violet tint before settling
                      // white, as in the reference. The accent line is already
                      // violet and is left alone.
                      ...(line.accent ? {} : { color: "rgb(164,124,237)" }),
                    }
              }
              animate={
                reduced
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      ...(line.accent ? {} : { color: "rgb(255,255,255)" }),
                    }
              }
              transition={{
                duration: reduced ? 0.3 : D.titleLine,
                delay: reduced ? 0 : T.titleStart + i * T.titleStagger,
                ease: EASE_OUT_QUINT,
                color: {
                  duration: reduced ? 0.3 : D.titleLine * 1.25,
                  delay: reduced ? 0 : T.titleStart + i * T.titleStagger,
                  ease: "easeOut",
                },
              }}
            >
              {line.text}
            </motion.span>
          ))}
        </h1>
      </div>

      {/* Description */}

      <div className="mt-[clamp(44px,5vw,68px)] lg:mt-[40px]">
        <motion.p
          className="
            max-w-[500px]

            text-[16px]
            lg:text-[17px]

            leading-[1.9]

            text-white/65
          "
          initial={revealFrom(22)}
          animate={revealTo}
          transition={{
            duration: reduced ? 0.3 : D.paragraph,
            delay: reduced ? 0 : T.paragraph,
            ease: EASE_OUT_QUINT,
          }}
        >
        AI agents and automation that
        open new horizons
        for your business.
        </motion.p>
      </div>
      {/* Buttons */}

      <div className="mt-[clamp(48px,6vw,80px)] lg:mt-[48px]">
        <div
          className="
            flex
            flex-col
            sm:flex-row

            items-center
            lg:items-start

            gap-5
          "
        >
          {/* Primary Button */}

          <motion.div
            className="inline-flex"
            initial={
              reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: 12 }
            }
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: reduced ? 0.3 : D.button,
              delay: reduced ? 0 : T.buttons,
              ease: EASE_OUT_EXPO,
            }}
          >
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                relative

                inline-flex
                items-center
                justify-center

                h-[40px]
                min-w-[180px]
                px-[40px]

                rounded-full
                overflow-hidden

                transition-all
                duration-300
                ease-out

                hover:scale-[1.03]

                outline-none
                focus-visible:ring-2
                focus-visible:ring-violet-400/60
              "
            >
              {/* Purple Glow */}
              <div
                className="
                  absolute
                  -inset-[3px]

                  rounded-full

                  bg-violet-500/30

                  blur-xl

                  opacity-55

                  transition-all
                  duration-300

                  group-hover:opacity-90
                  group-hover:blur-2xl
                "
              />

              {/* Background */}
              <div
                className="
                  absolute
                  inset-0

                  rounded-full

                  border
                  border-[#D0C2E366]

                  bg-[radial-gradient(circle_at_78%_25%,rgba(117,73,216,.45)_0%,transparent_30%),linear-gradient(90deg,#01010A_0%,#060612_20%,#29126E_48%,#4F28B7_72%,#7549D8_100%)]

                  shadow-[inset_0_1px_0_rgba(255,255,255,.28),inset_0_-8px_12px_rgba(18,10,58,.45),0_10px_24px_rgba(117,73,216,.12)]
                "
              />

              {/* Top Highlight */}
              <div
                className="
                  absolute

                  top-[1px]
                  left-[9px]
                  right-[9px]

                  h-[7px]

                  rounded-full

                  bg-gradient-to-r
                  from-transparent
                  via-white/55
                  to-transparent

                  opacity-80
                "
              />

              {/* Inner Light */}
              <div
                className="
                  absolute
                  inset-[1px]

                  rounded-full

                  bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,.08),transparent_55%)]

                  opacity-80
                "
              />

              {/* Text */}
              <span
                className="
                  relative
                  z-10

                  whitespace-nowrap

                  text-[17px]
                  font-semibold

                  tracking-[-0.01em]

                  text-white

                  transition-all
                  duration-300

                  drop-shadow-[0_0_4px_rgba(255,255,255,.15)]

                  group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,.35)]
                "
              >
                Book a Call
              </span>
            </a>
          </motion.div>

          {/* Secondary Button */}

          <motion.div
            className="inline-flex"
            initial={
              reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: 12 }
            }
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: reduced ? 0.3 : D.button,
              delay: reduced ? 0 : T.buttons + T.buttonStagger,
              ease: EASE_OUT_EXPO,
            }}
          >
            <Link
              to="/services"
              className="
                group

                h-[50px]
                min-w-[180px]

                inline-flex
                items-center
                justify-center

                gap-3

                rounded-full

                border
                border-white/15

                bg-white/[0.03]

                backdrop-blur-xl

                px-8

                text-[15px]
                font-semibold

                text-white

                transition-all
                duration-300

                hover:border-violet-400/40
                hover:bg-white/[0.06]

                outline-none
                focus-visible:ring-2
                focus-visible:ring-violet-400/60
              "
            >
              View Services
              <span
                className="
                  transition-transform
                  duration-300

                  group-hover:translate-x-1
                "
              >
                →
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
