/*
 * Math helpers and the scroll timeline for the hero story.
 *
 * `p` is the scroll progress through the pinned section (0 at the top, 1 at the end).
 * Each beat of the story owns a window of `p`; windows for copy never overlap, so one
 * headline always finishes leaving before the next one starts arriving.
 */

export const TAU = Math.PI * 2;

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const sstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** 0 → 1 → 0 across [a, b]. */
export const bell = (a: number, b: number, x: number) => Math.sin(Math.PI * clamp((x - a) / (b - a)));

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInCubic = (t: number) => t * t * t;
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutBack = (t: number, s = 1.7) => (t <= 0 ? 0 : 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2));

type Window = readonly [number, number];

export const T = {
  // 1 → 2: the headline leaves, the mark glides aside, orbits open around it
  introOut: [0.03, 0.1],
  logoToSide: [0.05, 0.17],
  ringsOpen: [0.08, 0.2],
  chipsIn: [0.1, 0.22],
  stackIn: [0.15, 0.22],
  stackOut: [0.33, 0.37],
  // 2 → 3: orbits unravel, the tools fly to their stars, the mark steps back
  ringsOut: [0.36, 0.46],
  chipsFly: [0.37, 0.5],
  logoGhost: [0.38, 0.46],
  servicesIn: [0.4, 0.47],
  linesDraw: [0.46, 0.6],
  starsLight: [0.52, 0.68],
  servicesOut: [0.72, 0.76],
  // 3 → 4: the lines pull into the guiding star, a flash, the mark returns
  retract: [0.76, 0.84],
  converge: [0.76, 0.86],
  logoCenter: [0.76, 0.9],
  flash: [0.82, 0.9],
  wave: [0.84, 0.97],
  wave2: [0.87, 1],
  logoReturn: [0.84, 0.92],
  finaleIn: [0.88, 0.96],
} as const satisfies Record<string, Window>;

export const at = (w: Window, p: number) => sstep(w[0], w[1], p);

/**
 * The story ends on the constellation (scene 3), fully lit and held while the page scrolls
 * on. Scroll progress is scaled into [0, STORY_END], so the windows from `servicesOut`
 * onward (the old finale: the A collapsing into the logo and the logo returning) are
 * never reached.
 */
export const STORY_END = 0.71;

/** Crossing one of these (in either direction) sends a short warp pulse through the starfield. */
export const WARP_GATES = [0.07, 0.4, 0.82];

/** Which of the three scenes `p` is in, for the progress dots. */
export const sceneIndex = (p: number) => (p < 0.15 ? 0 : p < 0.4 ? 1 : 2);
