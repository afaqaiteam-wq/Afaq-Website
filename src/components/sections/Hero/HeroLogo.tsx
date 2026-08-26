// HeroLogo.tsx
import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { BrainCircuit, Bot, Cpu, Sparkles, Workflow } from "lucide-react";
import { Link } from "react-router-dom";

import logo from "../../../assets/logo/logo.png";
import {
  D,
  EASE_OUT_EXPO,
  IDLE,
  T,
} from "../../../constants/motion";

/**
 * The four floating icon cards.
 *
 * MOBILE PERFORMANCE (max-sm, i.e. below 640px — desktop is untouched):
 * `backdrop-blur-xl` is dropped and the translucent fill is made a little
 * more opaque instead.
 *
 * These cards sit directly on top of the orbit shells, which rotate
 * continuously, so each card's backdrop-filter had to re-sample and
 * re-blur its backdrop on every frame — four full backdrop re-blurs per
 * frame for as long as the Hero is on screen. Removing that is real work
 * saved on the GPU.
 *
 * Measured honestly, though, it is NOT what caps the mobile frame rate:
 * an interleaved A/B at a mobile-equivalent CPU (4x throttle) moved Home
 * from 3.7fps to 4.0fps — inside the run-to-run noise. What actually
 * dominates is the sheer NUMBER of elements Framer animates per frame in
 * the Hero (~20: five rings x two orbit layers, six comets, four cards,
 * plus the mark's own loops); style recalculation alone is ~1245ms of a
 * 2924ms budget, and it drops to ~446ms when the whole block is removed.
 * Reducing that element count is the lever that would move Home; this
 * change is not a substitute for it.
 *
 * The compensation stays on the SAME white wash the desktop card uses,
 * just doubled (0.05 -> 0.10). That matters: blurring the backdrop and
 * laying 5% white over it makes the card read slightly *lighter* than its
 * surroundings, so swapping in a dark fill would invert that relationship
 * and the cards would read as dark holes instead of glass. Everything else
 * — size, position, border, shadow, icon, float animation — is untouched.
 */
const card = `
absolute rounded-[22px] border border-violet-500/20 bg-white/[0.05]
backdrop-blur-xl p-2 sm:p-3 lg:p-4
max-sm:backdrop-blur-none max-sm:bg-white/[0.10]
shadow-[0_0_30px_rgba(79,40,183,.20)] transition-all duration-300
hover:scale-110 hover:border-violet-400/40 hover:bg-white/[0.08]
`;

/* ==========================================================
   ORBIT SYSTEM

   Rendered inside a 560x560 viewBox so it scales with the
   responsive container for free.
========================================================== */

const CX = 280;
const CY = 280;

/**
 * An ellipse expressed as a <path> so Framer's pathLength / pathOffset
 * can drive both the draw-in and the travelling comet head.
 */
const ellipsePath = (rx: number, ry: number) =>
  `M ${CX - rx},${CY} a ${rx},${ry} 0 1,0 ${rx * 2},0 a ${rx},${ry} 0 1,0 ${
    -rx * 2
  },0`;

/**
 * Vertical flatten applied to both orbit layers.
 *
 * The rings sweep a full 360deg, so every radius becomes the vertical one at
 * some point in the cycle — meaning the system's vertical envelope is set by
 * its largest radius (235) no matter how the individual ellipses are shaped.
 * Scaling the rendered layer is therefore the only way to compress it, and it
 * doubles as the perspective cue: a shell seen slightly off-plane. Applied to
 * the layer rather than the ring data so the orbit nodes stay circular to
 * within a fraction of a pixel.
 */
const ORBIT_TILT = "scaleY(0.86)";

/**
 * The first three rings preserve the original geometry and periods; two
 * more were added to match the ring density of the reference. Periods are
 * deliberately non-harmonic so the composite pattern never visibly repeats.
 */
const RINGS = [
  {
    rx: 235,
    ry: 235,
    tilt: 0,
    dur: 28,
    dir: 1,
    stroke: "rgba(208,194,227,.52)",
    w: 1.4,
    comet: true,
    cometDur: 9,
  },
  {
    rx: 105,
    ry: 225,
    tilt: 18,
    dur: 21,
    dir: -1,
    stroke: "rgba(255,255,255,.30)",
    w: 1.2,
    comet: true,
    cometDur: 7.5,
  },
  {
    rx: 225,
    ry: 105,
    tilt: -12,
    dur: 24,
    dir: 1,
    stroke: "rgba(164,124,237,.46)",
    w: 1.2,
    comet: true,
    cometDur: 11,
  },
  {
    rx: 200,
    ry: 152,
    tilt: 36,
    dur: 33,
    dir: -1,
    stroke: "rgba(216,180,254,.30)",
    w: 1,
    comet: false,
    cometDur: 0,
  },
  {
    rx: 152,
    ry: 215,
    tilt: -42,
    dur: 19,
    dir: 1,
    stroke: "rgba(255,255,255,.22)",
    w: 1,
    comet: false,
    cometDur: 0,
  },
];

interface OrbitLayerProps {
  /** Front layer is depth-masked so rings appear to pass over the logo. */
  front?: boolean;
  reduced: boolean;
}

const OrbitLayer = ({ front = false, reduced }: OrbitLayerProps) => (
  <svg
    viewBox="0 0 560 560"
    width="100%"
    height="100%"
    className="absolute inset-0 overflow-visible"
  >
    {front && (
      <defs>
        {/*
          Depth illusion: in the front copy, only the lower part of each
          orbit is painted. The upper part stays hidden so the back copy
          shows through behind the logo — the ring reads as passing behind
          at the top and in front at the bottom.
        */}
        <linearGradient id="orbit-depth-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.44" stopColor="black" />
          <stop offset="0.70" stopColor="white" />
        </linearGradient>

        <mask id="orbit-depth">
          <rect
            x="0"
            y="0"
            width="560"
            height="560"
            fill="url(#orbit-depth-fade)"
          />
        </mask>
      </defs>
    )}

    <g mask={front ? "url(#orbit-depth)" : undefined}>
      {RINGS.map((ring, i) => {
        // Only the brighter rings are duplicated into the front layer — the
        // two faintest read identically without the second rotating group.
        if (front && !ring.comet) return null;

        const d = ellipsePath(ring.rx, ring.ry);
        const drawDelay = T.orbitDraw + i * T.orbitStagger;

        return (
          // Static tilt, so each ring starts at its own attitude.
          <g key={i} transform={`rotate(${ring.tilt} ${CX} ${CY})`}>
            <motion.g
              style={{
                transformOrigin: `${CX}px ${CY}px`,
                willChange: "transform",
              }}
              animate={reduced ? undefined : { rotate: 360 * ring.dir }}
              transition={{
                duration: ring.dur,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Orbit path — draws itself in on entrance */}
              <motion.path
                d={d}
                fill="none"
                stroke={ring.stroke}
                strokeWidth={ring.w}
                initial={
                  reduced
                    ? { opacity: 1, pathLength: 1 }
                    : { opacity: 0, pathLength: 0 }
                }
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{
                  pathLength: {
                    duration: reduced ? 0 : D.orbitDraw,
                    delay: reduced ? 0 : drawDelay,
                    ease: EASE_OUT_EXPO,
                  },
                  opacity: {
                    duration: reduced ? 0 : 0.5,
                    delay: reduced ? 0 : drawDelay,
                  },
                }}
              />

              {/* Travelling comet head */}
              {ring.comet && !reduced && (
                <motion.path
                  d={d}
                  fill="none"
                  stroke="rgba(245,242,249,.95)"
                  strokeWidth={ring.w + 0.7}
                  strokeLinecap="round"
                  initial={{ pathLength: 0.085, pathOffset: 0, opacity: 0 }}
                  animate={{ pathLength: 0.085, pathOffset: 1, opacity: 1 }}
                  transition={{
                    pathOffset: {
                      duration: ring.cometDur,
                      repeat: Infinity,
                      ease: "linear",
                      delay: drawDelay,
                    },
                    opacity: { duration: 0.8, delay: drawDelay + 0.3 },
                  }}
                />
              )}

              {/* Orbiting node — soft halo + bright core */}
              <motion.g
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: reduced ? 0 : 0.6,
                  delay: reduced ? 0 : drawDelay + 0.5,
                }}
              >
                <circle
                  cx={CX}
                  cy={CY - ring.ry}
                  r="7"
                  fill="rgba(216,180,254,.30)"
                />
                <circle cx={CX} cy={CY - ring.ry} r="3.2" fill="#fff" />
              </motion.g>
            </motion.g>
          </g>
        );
      })}
    </g>
  </svg>
);

/* ==========================================================
   FLOATING ICON CARDS
========================================================== */

/**
 * `depth` places each card on its own plane rather than all on one:
 *   scale  — nearer cards render larger
 *   dim    — farther cards sit back into the haze
 *   z      — two cards sit *behind* the orbit shell, two in front, so the
 *            rings sweep over some and under others
 *   drift  — nearer cards travel further per float cycle (motion parallax)
 * Positions, icons, colours and float periods are unchanged.
 */
const ICONS = [
  {
    Icon: BrainCircuit,
    size: 30,
    float: -10,
    dur: 4,
    depth: { scale: 0.86, dim: 0.72, z: "z-[9]", drift: 0.8 },
    pos: `left-[20px] top-[20px]
          sm:left-[40px] sm:top-[40px]
          md:left-[70px] md:top-[55px]
          lg:left-[110px] lg:top-[70px]
          xl:left-[145px] xl:top-[80px]`,
  },
  {
    Icon: Cpu,
    size: 28,
    float: 10,
    dur: 5,
    depth: { scale: 1.0, dim: 0.9, z: "z-40", drift: 1 },
    pos: `right-[10px] top-[60px]
          sm:right-[20px] sm:top-[80px]
          md:right-[35px] md:top-[100px]
          lg:right-[45px] lg:top-[125px]
          xl:right-[55px] xl:top-[145px]`,
  },
  {
    Icon: Bot,
    size: 30,
    float: 12,
    dur: 4.5,
    depth: { scale: 1.12, dim: 1, z: "z-40", drift: 1.25 },
    pos: `left-[10px] bottom-[55px]
          sm:left-[20px] sm:bottom-[75px]
          md:left-[35px] md:bottom-[95px]
          lg:left-[45px] lg:bottom-[120px]
          xl:left-[60px] xl:bottom-[145px]`,
  },
  {
    Icon: Workflow,
    size: 28,
    float: -12,
    dur: 5.3,
    depth: { scale: 0.92, dim: 0.8, z: "z-[9]", drift: 0.88 },
    pos: `right-[18px] bottom-[35px]
          sm:right-[30px] sm:bottom-[55px]
          md:right-[45px] md:bottom-[70px]
          lg:right-[60px] lg:bottom-[95px]
          xl:right-[80px] xl:bottom-[115px]`,
  },
];

/**
 * Where the visible artwork ends inside the logo PNG, as a fraction of the
 * image element's height.
 *
 * Measured from the asset's alpha channel: the source is 1024x1024 with the
 * mark occupying y=167..767, so it ends at 74.9% and the remaining ~25% is
 * transparent padding. Percentage offsets against the element box are
 * therefore ~25% lower than they look, which is why the wordmark previously
 * read as detached from the mark.
 *
 * If the logo asset is ever replaced, re-measure this.
 */
const MARK_BOTTOM = "74.9%";

/**
 * Gap between the bottom of the mark and the wordmark.
 *
 * Renders ~6px tighter than the nominal value: the mark sits inside the
 * rotateY tilt wrapper, and perspective projection shrinks its painted box
 * slightly against the layout box this percentage resolves against, so the
 * on-screen gap reads ~6px tighter than the value set here.
 */
const WORDMARK_GAP = "4px";

/**
 * Mean ratio of the mark's rendered width to its container across breakpoints
 * (210/280 … 450/640). It varies by under 5%, so one value is enough.
 */
const IMG_TO_BOX = 0.712;

/**
 * The wordmark now sits on the container rather than on the mark's own box
 * (it stays in the Hero while the mark recedes), so the anchor is re-projected:
 * the mark is centred in the container, so its bottom in container space is
 * 50% + (MARK_BOTTOM - 50%) * IMG_TO_BOX ≈ 67.7%.
 */
const WORDMARK_TOP = `${(50 + (parseFloat(MARK_BOTTOM) - 50) * IMG_TO_BOX).toFixed(1)}%`;

/**
 * Light sweep mask — uses the existing transparent logo PNG so the
 * highlight travels across the mark's own silhouette.
 */
const logoMask: React.CSSProperties = {
  WebkitMaskImage: `url(${logo})`,
  maskImage: `url(${logo})`,
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
};

/**
 * Scroll recede tuning, expressed in viewport heights so the transition covers
 * the same visual distance on any screen.
 */
const RECEDE_DESKTOP = {
  /**
   * Scroll distance over which the composition settles into the background,
   * in viewport heights. Kept under 1vh so the recede is complete by the time
   * the next section reaches the viewport — matching the reference, where the
   * logo is already fully in the background when the cards scroll over it.
   */
  span: 0.85,
  /** How far it drifts up the viewport while receding, as a fraction of vh. */
  lift: 0.09,
  /**
   * Depth cues at the far end. Scale/opacity are read off the reference: the
   * background mark measures ~0.62 of its hero size and stays clearly legible
   * rather than fading out.
   */
  scale: 0.62,
  blur: 6.5,
  opacity: 0.38,
} as const;

/**
 * Mobile plays the same recede — same direction, same depth relationship,
 * same 0.62 scale floor — over a shorter scroll distance and with lighter
 * visual weight: less drift, less blur, a shallower fade. The heavy desktop
 * version read as slow and dramatic when squeezed onto a phone; this keeps
 * the concept but makes it quick and easy on the eyes.
 */
const RECEDE_MOBILE = {
  span: 0.55,
  lift: 0.05,
  scale: 0.62,
  blur: 3.5,
  opacity: 0.5,
} as const;

/**
 * Smooths the mobile recede so it reads as one fluid, controlled motion
 * instead of snapping 1:1 to every pixel of scroll/touch input — desktop
 * keeps reading the raw scroll-coupled values below, untouched. `bounce: 0`
 * is a critically-damped spring: quick response, no overshoot, settles in
 * ~500ms regardless of how fast the scroll input itself changes.
 */
const MOBILE_SPRING = { duration: 0.5, bounce: 0 } as const;

/** Below this, the recede uses the mobile tuning above. */
const MOBILE_BREAKPOINT = 640;

const HeroLogo = () => {
  const reduced = useReducedMotion() ?? false;

  /* ==========================================================
     SCROLL RECEDE

     The composition stays in the Hero's layout box — nothing is portalled,
     duplicated or remounted — and is pushed by a scroll-linked transform.

     `y` counteracts the page scroll: at scroll s it translates by
     s * (span - lift) / span, so the element drifts up by s * lift / span
     while the page moves it up by s — all without ever switching to
     position:fixed, so there is no frame where anything jumps. Every
     transform here (including `y`) clamps at `end`: the recede belongs only
     to the Hero → Technologies range, so past `end` the offset stops
     growing and the composition scrolls away with the rest of the Hero at
     the page's normal rate instead of staying pinned to the viewport.

     Everything animated here is transform/opacity plus one filter; the Hero
     section's clip was removed so the composition can travel past its bounds.
  ========================================================== */
  const { scrollY } = useScroll();

  const [vp, setVp] = useState(() =>
    typeof window === "undefined"
      ? { w: 1440, h: 900, max: 1000 }
      : {
          w: window.innerWidth,
          h: window.innerHeight,
          max: Math.max(
            1,
            document.documentElement.scrollHeight - window.innerHeight
          ),
        }
  );

  useEffect(() => {
    const measure = () =>
      setVp({
        w: window.innerWidth,
        h: window.innerHeight,
        max: Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight
        ),
      });

    measure();
    window.addEventListener("resize", measure);
    // Page height changes as sections are added or images settle; without this
    // the span can exceed the scrollable distance and the recede never lands.
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  const vh = vp.h;
  const isMobile = vp.w < MOBILE_BREAKPOINT;
  const RECEDE = isMobile ? RECEDE_MOBILE : RECEDE_DESKTOP;

  /**
   * The span is capped at the distance the page can actually scroll. On a tall
   * viewport with a short page (e.g. 1920x1080 before more sections exist)
   * 0.85vh of scroll simply does not exist, and the composition would freeze
   * part-way — under-blurred and off-centre. Capping guarantees the recede
   * always completes; once the page grows, vh*span takes over again.
   */
  const end = Math.min(vh * RECEDE.span, vp.max * 0.92);
  const lift = vh * RECEDE.lift;

  /**
   * Horizontal drift to viewport centre.
   *
   * In the reference the receded mark sits dead centre, but in the Hero it
   * lives in the right grid column. That column's centre sits a fixed
   * distance right of the container centre:
   *
   *   colCentre - containerCentre = (0.74W + 20) - 0.5W = 0.24W + 20
   *
   * for the 48/52 template with an 80px gap, where W = min(1000, 82vw) — the
   * shared Navbar/Hero container. Below lg the Hero stacks to one column and
   * the mark is already centred, so the drift is zero.
   */
  const centreShift =
    vp.w >= 1024 ? -(0.24 * Math.min(1000, vp.w * 0.82) + 20) : 0;

  // Clamped at `end`, like every other transform below: past the recede
  // range the offset stops growing, so the element's viewport position moves
  // at the page's normal 1:1 scroll rate again instead of staying pinned —
  // it scrolls away with the rest of the Hero exactly like ordinary content,
  // and reverses smoothly on the way back up since it's a pure function of
  // scrollY with no one-shot state.
  const rawY = useTransform(scrollY, [0, end], [0, end - lift]);
  const rawX = useTransform(scrollY, [0, end], [0, centreShift]);
  const rawScale = useTransform(scrollY, [0, end], [1, RECEDE.scale]);
  const rawOpacity = useTransform(
    scrollY,
    [0, end * 0.4, end],
    [1, 0.8, RECEDE.opacity]
  );

  // Blur is quantised to 0.5px steps: a continuously varying blur radius
  // forces a fresh rasterisation every frame, whereas stepping it lets the
  // compositor reuse the previous raster across most frames. At this radius
  // the steps are not perceptible.
  const rawBlur = useTransform(scrollY, [0, end], [0, RECEDE.blur]);

  // Springs must be called unconditionally (rules of hooks), but only their
  // output is actually read on mobile — desktop selects the raw values
  // below and never sees the spring, so its motion is byte-for-byte what it
  // was before this existed.
  const springY = useSpring(rawY, MOBILE_SPRING);
  const springX = useSpring(rawX, MOBILE_SPRING);
  const springScale = useSpring(rawScale, MOBILE_SPRING);
  const springOpacity = useSpring(rawOpacity, MOBILE_SPRING);
  const springBlur = useSpring(rawBlur, MOBILE_SPRING);

  const y = isMobile ? springY : rawY;
  const x = isMobile ? springX : rawX;
  const scale = isMobile ? springScale : rawScale;
  const opacity = isMobile ? springOpacity : rawOpacity;
  const blur = isMobile ? springBlur : rawBlur;

  const filter = useTransform(
    blur,
    (b) => `blur(${(Math.round(b * 2) / 2).toFixed(1)}px)`
  );

  /** Reduced motion keeps the composition exactly where it is. */
  const recedeStyle = reduced
    ? undefined
    : { x, y, scale, opacity, filter, willChange: "transform, filter, opacity" };

  return (
    // The lg/2xl translate raises the whole composition — logo, orbit layers,
    // glow and icon cards — because it sits on the root element. Two steps:
    // headroom above the outermost ring grows with viewport width (~46px at
    // 1366, ~65px at 1920), so a single value tuned for wide screens would
    // tuck the ring under the navbar at 1366.
    //
    // min-[1920px]:scale: every element in this composition (glow, cards,
    // sparkle, wordmark) is sized in fixed px per breakpoint rather than in
    // %, so growing this box's own width/height past 640px would pull it out
    // of registration with its children instead of scaling them together.
    // A uniform transform scales the whole rigid composition as one unit —
    // safe here because nothing inside it is an interactive hit target on
    // desktop. Below 1600px this box is still being flex-shrunk to fit
    // Hero's own (48/52%) grid column, which already tracks the column
    // continuously with no freeze; the column only outgrows the fixed 640px
    // box above ~1567px viewport width, and its growth ceiling (container
    // caps at min(82vw,1440px)) works out to 708.8px, i.e. 640 * 1.1075 —
    // hence the factor, applied from 1920px where the gap becomes visible.
    <div
      style={{ perspective: 1400 }}
      className="
        relative flex items-center justify-center

        mt-[clamp(48px,8.2vw,84px)]
        lg:mt-0

        lg:translate-y-[-36px]
        2xl:translate-y-[-50px]
        min-[1920px]:scale-[1.1075]

        w-[280px] h-[280px]
        sm:w-[380px] sm:h-[380px]
        md:w-[460px] md:h-[460px]
        lg:w-[560px] lg:h-[560px]
        xl:w-[640px] xl:h-[640px]
      "
    >
      {/*
        THE RECEDING COMPOSITION.

        Everything that travels into the background lives inside this one
        wrapper — mark, orbit shells, glow, contact shadow, icon cards and
        sparkle — so it moves as a single object. It keeps `inset-0` and
        re-declares the parent's centring, so every child sits exactly where
        it did before; at scroll 0 the transform is identity and the frame is
        pixel-identical to the previous build.

        pointer-events-none: once it is behind the page it must never
        intercept clicks meant for the content scrolling over it.
      */}
      <motion.div
        style={recedeStyle}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
      {/* Ambient blurred logo copy */}
      <img
        src={logo}
        alt=""
        className="
          absolute w-[260px] sm:w-[340px] md:w-[420px] lg:w-[500px] xl:w-[580px]
          opacity-[0.03] blur-[10px] pointer-events-none select-none
        "
      />

      {/* Pulsing core glow */}
      <motion.div
        className="
          absolute h-[260px] w-[260px]
          sm:h-[340px] sm:w-[340px]
          md:h-[420px] md:w-[420px]
          lg:h-[530px] lg:w-[530px]
          xl:h-[580px] xl:w-[580px]
          rounded-full bg-violet-600/28 blur-[130px] lg:blur-[170px]
        "
        // Pulses on opacity only. Animating scale here would re-rasterise a
        // 170px-radius blur every frame; opacity on a promoted layer is free.
        initial={reduced ? { opacity: 1 } : { opacity: 0 }}
        animate={reduced ? { opacity: 1 } : { opacity: [0.7, 1, 0.7] }}
        transition={
          reduced
            ? { duration: 0 }
            : {
                duration: IDLE.corePulse,
                repeat: Infinity,
                ease: "easeInOut",
                delay: T.heroLogo,
              }
        }
      />

      {/* Volumetric core — a tighter, hotter pool of light inside the wide
          ambient glow. Two falloffs read as light with volume rather than a
          single flat wash. Opacity-only pulse, offset from the outer glow's
          period so the two never beat in sync. */}
      <motion.div
        className="
          pointer-events-none absolute
          h-[150px] w-[150px]
          sm:h-[200px] sm:w-[200px]
          md:h-[250px] md:w-[250px]
          lg:h-[300px] lg:w-[300px]
          xl:h-[340px] xl:w-[340px]
          rounded-full blur-[60px] lg:blur-[80px]
        "
        style={{
          background:
            "radial-gradient(circle, rgba(164,124,237,.42) 0%, rgba(79,40,183,.22) 45%, transparent 72%)",
        }}
        initial={reduced ? { opacity: 1 } : { opacity: 0 }}
        animate={reduced ? { opacity: 1 } : { opacity: [0.65, 0.95, 0.65] }}
        transition={
          reduced
            ? { duration: 0 }
            : {
                duration: IDLE.corePulse * 1.45,
                repeat: Infinity,
                ease: "easeInOut",
                delay: T.heroLogo,
              }
        }
      />

      {/* Contact shadow — grounds the mark so it reads as a solid object
          sitting in the scene instead of a flat cut-out. A blurred element
          rather than a second drop-shadow on the (animated, large) PNG,
          which would re-rasterise every frame. */}
      <div
        className="
          pointer-events-none absolute z-[15]
          h-[26px] w-[150px]
          sm:h-[32px] sm:w-[200px]
          md:h-[38px] md:w-[250px]
          lg:h-[46px] lg:w-[300px]
          xl:h-[52px] xl:w-[330px]
          rounded-[50%] blur-[26px] lg:blur-[34px]
        "
        style={{
          top: "63%",
          background:
            "radial-gradient(ellipse, rgba(24,10,58,.62) 0%, rgba(24,10,58,.28) 55%, transparent 78%)",
        }}
      />

      {/* Entrance portal — expanding ring, plays once as the logo lands */}
      {!reduced && (
        <motion.div
          className="pointer-events-none absolute rounded-full border border-violet-300/50"
          style={{ width: "44%", height: "44%" }}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.2, 1.9, 2.4] }}
          transition={{
            duration: 1.5,
            delay: T.heroLogo,
            ease: EASE_OUT_EXPO,
            times: [0, 0.35, 1],
          }}
        />
      )}

      {/* Orbits — behind the logo.
          Inset negatively so the sphere reads as enclosing the mark rather
          than hugging it, as in the reference.

          ORBIT_TILT flattens the whole system vertically, so it reads as an
          orbital shell viewed slightly off its plane rather than a perfect
          sphere — the perspective the reference has. It also shrinks the
          vertical envelope, which is what buys the headroom to sit closer
          under the navbar.

          The back copy is dimmed: the far side of a shell should not be as
          bright as the near side. */}
      <div
        className="absolute -inset-[7%] z-10 opacity-[0.78]"
        style={{ transform: ORBIT_TILT }}
      >
        <OrbitLayer reduced={reduced} />
      </div>

      {/* Logo.
          Promoted to its own compositor layer: the source PNG is very large,
          and without promotion each float/tilt frame re-rasterises that
          texture together with its 90px drop-shadow. */}
      <motion.div
        style={{ willChange: "transform" }}
        className="relative z-20 flex flex-col items-center"
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.35 }}
        animate={
          reduced
            ? { opacity: 1 }
            : { opacity: 1, scale: 1, y: [0, -10, 0], rotate: [-2, 2, -2] }
        }
        transition={
          reduced
            ? { duration: 0.3 }
            : {
                opacity: {
                  duration: 0.7,
                  delay: T.heroLogo,
                  ease: EASE_OUT_EXPO,
                },
                scale: {
                  duration: D.heroLogo,
                  delay: T.heroLogo,
                  ease: EASE_OUT_EXPO,
                },
                y: {
                  duration: IDLE.logoFloat,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: T.heroLogo + D.heroLogo,
                },
                rotate: {
                  duration: IDLE.logoFloat,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: T.heroLogo + D.heroLogo,
                },
              }
        }
      >
        {/* Subtle 3D tilt, applied to the mark only so the wordmark stays flat */}
        <motion.div
          className="relative"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
          animate={reduced ? undefined : { rotateY: [-9, 9, -9] }}
          transition={{
            duration: IDLE.logoTilt,
            repeat: Infinity,
            ease: "easeInOut",
            delay: T.heroLogo + D.heroLogo,
          }}
        >
          {/* Mobile only: the mark becomes a tap target back to Home. Wraps
              only the <img> — the tilt/float motion.divs above it, its size,
              position and every animation are untouched. Since this Hero
              only ever renders on the Home route itself, a tap here is
              always "navigate to the page already showing" — Link's own
              behavior for that is a no-op (no reload, no remount), which is
              exactly the required "already on Home: do nothing" case.
              Desktop renders the bare <img>, unchanged. */}
          {isMobile ? (
            <Link
              to="/"
              aria-label="Go to Home"
              className="block rounded-full outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
            >
              <img
                src={logo}
                alt="AFAQ AI"
                className="
                  w-[210px] sm:w-[270px] md:w-[330px] lg:w-[400px] xl:w-[450px]
                  select-none drop-shadow-[0_0_90px_rgba(79,40,183,.65)]
                "
              />
            </Link>
          ) : (
            <img
              src={logo}
              alt="AFAQ AI"
              className="
                w-[210px] sm:w-[270px] md:w-[330px] lg:w-[400px] xl:w-[450px]
                select-none drop-shadow-[0_0_90px_rgba(79,40,183,.65)]
              "
            />
          )}

          {/* Light sweep across the mark */}
          {!reduced && (
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={logoMask}
            >
              <motion.div
                className="absolute inset-y-0 w-[38%] bg-gradient-to-r from-transparent via-white/55 to-transparent blur-[6px]"
                initial={{ x: "-180%" }}
                animate={{ x: "300%" }}
                transition={{
                  duration: 1.6,
                  delay: T.heroLogo + D.heroLogo,
                  repeat: Infinity,
                  repeatDelay: IDLE.lightSweep,
                  ease: "easeInOut",
                }}
              />
            </div>
          )}
        </motion.div>

      </motion.div>

      {/* Orbits — in front of the logo, depth-masked. Same flatten as the
          back copy so the two halves stay one coherent shell.

          MOBILE (<640px): not rendered at all. This is the *duplicate* of the
          back shell, drawn a second time under an SVG mask so the bright rings
          appear to pass in front of the mark on their way round. It costs a
          second full set of infinitely-rotating groups and travelling comets —
          the single biggest block of per-frame animation work in the Hero —
          and at phone size the masked sliver it adds is barely legible.
          Conditionally rendered rather than CSS-hidden on purpose: Framer's
          loops are driven by its own rAF engine, which keeps running on a
          `display:none` subtree, so hiding it would cost exactly as much as
          showing it. The back shell (line ~753) is untouched, so the orbit
          system, its ring count and its geometry all stay as they are.
          Desktop renders this exactly as before. */}
      {!isMobile && (
        <div
          className="pointer-events-none absolute -inset-[7%] z-30"
          style={{ transform: ORBIT_TILT }}
        >
          <OrbitLayer front reduced={reduced} />
        </div>
      )}

      {/* Floating icon cards — each on its own depth plane (see ICONS) */}
      {ICONS.map(({ Icon, size, float, dur, pos, depth }, i) => {
        const delay = T.orbitIcons + i * T.orbitIconStagger;
        const drift = float * depth.drift;

        return (
          <motion.div
            key={i}
            className={`${card} ${depth.z} ${pos}`}
            initial={
              reduced ? { opacity: 0 } : { opacity: 0, scale: depth.scale * 0.4 }
            }
            // Settles at depth.dim, not 1 — Framer owns inline opacity here,
            // so the resting value has to be the animation target.
            animate={
              reduced
                ? { opacity: depth.dim }
                : { opacity: depth.dim, scale: depth.scale, y: [0, drift, 0] }
            }
            transition={
              reduced
                ? { duration: 0.3 }
                : {
                    opacity: {
                      duration: D.orbitIcon,
                      delay,
                      ease: EASE_OUT_EXPO,
                    },
                    scale: {
                      duration: D.orbitIcon,
                      delay,
                      ease: EASE_OUT_EXPO,
                    },
                    y: {
                      duration: dur,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: delay + D.orbitIcon,
                    },
                  }
            }
          >
            <Icon size={size} className="text-violet-300" />
          </motion.div>
        );
      })}

      {/* Sparkle */}
      <motion.div
        className="
          absolute z-40
          left-[5px] top-[120px]
          sm:left-[12px] sm:top-[150px]
          md:left-[18px] md:top-[180px]
          lg:left-[24px] lg:top-[210px]
          xl:left-[30px] xl:top-[235px]
          text-violet-300
          drop-shadow-[0_0_18px_rgba(164,124,237,.85)]
        "
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.3 }}
        animate={
          reduced
            ? { opacity: 1 }
            : { opacity: 1, rotate: [0, 15, 0], scale: [1, 1.15, 1] }
        }
        transition={
          reduced
            ? { duration: 0.3 }
            : {
                opacity: {
                  duration: 0.6,
                  delay: T.orbitIcons + ICONS.length * T.orbitIconStagger,
                },
                rotate: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: T.orbitIcons + ICONS.length * T.orbitIconStagger,
                },
                scale: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: T.orbitIcons + ICONS.length * T.orbitIconStagger,
                },
              }
        }
      >
        <Sparkles size={34} strokeWidth={2} />
      </motion.div>

      {/* ── end of the receding composition ──────────────────── */}
      </motion.div>

      {/*
        WORDMARK — deliberately OUTSIDE the receding wrapper.

        It belongs to the Hero, so it scrolls away with the Hero rather than
        travelling into the background with the mark. That means it can no
        longer be anchored to the mark's own box, so the anchor is restated
        against the container:

          markBottom% = 0.5 + 0.249 * (imgHeight / containerHeight)

        which lands at 67.5–68.7% across every breakpoint (the ratio barely
        moves), so a single 67.8% reproduces the previous position to ~2px.

        The float and tilt are duplicated here with identical duration, easing
        and delay, so at rest it rides with the mark exactly as before — but
        as a peer, not a child, which is what lets the two separate on scroll.
      */}
      <motion.div
        style={{ top: `calc(${WORDMARK_TOP} + ${WORDMARK_GAP})` }}
        className="absolute left-1/2 z-20 flex -translate-x-1/2 flex-col items-center"
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.35 }}
        animate={
          reduced
            ? { opacity: 1 }
            : { opacity: 1, scale: 1, y: [0, -10, 0], rotate: [-2, 2, -2] }
        }
        transition={
          reduced
            ? { duration: 0.3 }
            : {
                opacity: {
                  duration: 0.7,
                  delay: T.heroLogo,
                  ease: EASE_OUT_EXPO,
                },
                scale: {
                  duration: D.heroLogo,
                  delay: T.heroLogo,
                  ease: EASE_OUT_EXPO,
                },
                y: {
                  duration: IDLE.logoFloat,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: T.heroLogo + D.heroLogo,
                },
                rotate: {
                  duration: IDLE.logoFloat,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: T.heroLogo + D.heroLogo,
                },
              }
        }
      >
        <h2
          className="
            font-['Space_Grotesk']
            text-[18px] sm:text-[22px] md:text-[24px] lg:text-[30px] xl:text-[34px]
            font-bold uppercase tracking-[0.34em] leading-none text-white
            drop-shadow-[0_0_18px_rgba(164,124,237,.35)]
          "
        >
          AFAQ
          <span className="ml-2 text-violet-400">AI</span>
        </h2>

        <div className="mt-3 flex gap-5">
          <span
            className="
              h-px w-10 sm:w-14 md:w-16 lg:w-20
              bg-gradient-to-r from-transparent via-violet-400 to-transparent
            "
          />
          <span
            className="
              h-px w-10 sm:w-14 md:w-16 lg:w-20
              bg-gradient-to-l from-transparent via-violet-400 to-transparent
            "
          />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroLogo;
