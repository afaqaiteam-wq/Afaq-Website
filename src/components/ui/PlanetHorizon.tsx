/**
 * The curve of a planet seen from orbit at sunrise: a dark world with faint cloud bands,
 * lit from a sun just breaking over its limb, under a thin glowing atmosphere.
 * Pure SVG, so it costs one static render; only the sun breathes (CSS, off with reduced motion).
 * `id` keeps the gradient and filter ids unique if the planet appears twice on a page.
 */
export function PlanetHorizon({ id, className = "" }: { id: string; className?: string }) {
  const u = (s: string) => `${id}-${s}`;
  // The planet is a circle far larger than the view; only its top cap shows.
  const cx = 800;
  const top = 150;
  const r = 2100;
  const cy = top + r;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1600 300"
      preserveAspectRatio="xMidYMax slice"
      className={`pointer-events-none ${className}`}
    >
      <defs>
        {/* daylight falls from the sun at the top of the limb and fades into night */}
        <radialGradient id={u("day")} gradientUnits="userSpaceOnUse" cx={cx} cy={top} r="980">
          <stop offset="0" stopColor="#e9dcff" stopOpacity="0.75" />
          <stop offset="0.06" stopColor="#a67bff" stopOpacity="0.55" />
          <stop offset="0.24" stopColor="#5b34c9" stopOpacity="0.32" />
          <stop offset="0.55" stopColor="#24124f" stopOpacity="0.18" />
          <stop offset="1" stopColor="#07060b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={u("dayMask")} gradientUnits="userSpaceOnUse" cx={cx} cy={top} r="1100">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={u("lit")}>
          <rect width="1600" height="300" fill={`url(#${u("dayMask")})`} />
        </mask>
        <clipPath id={u("body")}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        {/* cloud bands: stretched fractal noise, tinted violet */}
        <filter id={u("clouds")} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0016 0.021" numOctaves="4" seed="11" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.78  0 0 0 0 0.66  0 0 0 0 1  0 0 0 1.5 -0.62"
          />
        </filter>
        {/* the atmosphere is brightest under the sun and thins toward the sides */}
        <linearGradient id={u("rim")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#a67bff" stopOpacity="0" />
          <stop offset="0.3" stopColor="#a67bff" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#f4eeff" stopOpacity="1" />
          <stop offset="0.7" stopColor="#a67bff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#a67bff" stopOpacity="0" />
        </linearGradient>
        <filter id={u("haze")} x="-10%" y="-200%" width="120%" height="500%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={u("glow")} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <radialGradient id={u("sun")}>
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.22" stopColor="#f4eeff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#c8a8ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={u("streak")} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient
          id={u("air")}
          gradientUnits="userSpaceOnUse"
          cx={cx}
          cy={top}
          r="640"
          gradientTransform={`translate(${cx} ${top}) scale(1 0.24) translate(${-cx} ${-top})`}
        >
          <stop offset="0" stopColor="#8c5cff" stopOpacity="0.42" />
          <stop offset="1" stopColor="#8c5cff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* airglow in the sky just above the limb */}
      <rect width="1600" height="300" fill={`url(#${u("air")})`} />

      {/* the night side, then daylight and cloud bands where the sun reaches */}
      <g clipPath={`url(#${u("body")})`}>
        <rect width="1600" height="300" fill="#08060f" />
        <rect width="1600" height="300" fill={`url(#${u("day")})`} />
        <rect width="1600" height="300" filter={`url(#${u("clouds")})`} mask={`url(#${u("lit")})`} opacity="0.55" />
        {/* a little shade just inside the edge gives the sphere its curve */}
        <circle cx={cx} cy={cy} r={r - 2} fill="none" stroke="#07060b" strokeOpacity="0.35" strokeWidth="14" />
      </g>

      {/* atmosphere: a soft wide band and a sharp line of light on the limb */}
      <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={`url(#${u("rim")})`} strokeWidth="16" opacity="0.7" filter={`url(#${u("haze")})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#${u("rim")})`} strokeWidth="2" />

      {/* the sun, breaking over the edge */}
      <g className="animate-[sunrise-breathe_7s_ease-in-out_infinite]" style={{ transformOrigin: `${cx}px ${top}px` }}>
        <circle cx={cx} cy={top} r="150" fill="#a67bff" opacity="0.35" filter={`url(#${u("glow")})`} />
        <rect x={cx - 560} y={top - 1.5} width="1120" height="3" fill={`url(#${u("streak")})`} opacity="0.75" />
        <circle cx={cx} cy={top} r="34" fill={`url(#${u("sun")})`} />
      </g>
    </svg>
  );
}
