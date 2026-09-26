import { stamp } from "./glow";
import { TAU, clamp } from "./timeline";

/*
 * A small planetary system around the logo, following real orbital mechanics:
 *
 *  - Each tool has its own Keplerian orbit: an ellipse with the logo at one FOCUS
 *    (not the centre), defined by semi-major axis a, eccentricity e, inclination i,
 *    longitude of the ascending node Ω and argument of periapsis ω.
 *  - Like a real planetary system the orbits are nearly coplanar (inclinations of a degree
 *    or two) and nested, so they never tangle; depth comes from the camera and perspective.
 *  - Kepler's 2nd law: a body moves faster near periapsis. We solve Kepler's equation
 *    M = E − e·sin E for the eccentric anomaly E every frame.
 *  - Kepler's 3rd law: the period grows as a^1.5, so inner tools circle faster.
 *
 * The camera looks at the reference plane from an elevation φ and azimuth θ. Both are
 * driven by scroll within fixed limits — nothing accumulates, so the view never drifts.
 */

export interface Body {
  name: string;
  /** semi-major axis, in logo sizes */
  a: number;
  e: number;
  /** inclination, degrees */
  inc: number;
  /** longitude of the ascending node, degrees */
  node: number;
  /** argument of periapsis, degrees */
  peri: number;
  /** mean anomaly at t = 0, radians */
  m0: number;
  /** shown on phones (fewer orbits fit) */
  phone: boolean;
}

/**
 * Same order as NODE_FOR_TOOL in constellation.ts. Starting positions are spread by the
 * golden angle (≈2.4 rad) in order of distance, so the planets don't start bunched up.
 */
export const BODIES: Body[] = [
  { name: "OpenAI", a: 0.62, e: 0.03, inc: 1.2, node: 20, peri: 40, m0: 0, phone: true },
  { name: "n8n", a: 0.82, e: 0.04, inc: -1.5, node: 250, peri: 95, m0: 4.8, phone: true },
  { name: "Claude", a: 0.72, e: 0.05, inc: 2, node: 140, peri: 210, m0: 2.4, phone: true },
  { name: "Python", a: 1.02, e: 0.03, inc: -1, node: 195, peri: 20, m0: 3.4, phone: true },
  { name: "Next.js", a: 1.12, e: 0.05, inc: 1.8, node: 320, peri: 150, m0: 5.8, phone: false },
  { name: "Gemini", a: 0.92, e: 0.06, inc: -2.2, node: 60, peri: 300, m0: 1, phone: false },
  { name: "AWS", a: 1.23, e: 0.04, inc: 0.8, node: 100, peri: 260, m0: 2, phone: true },
  { name: "Supabase", a: 1.34, e: 0.05, inc: -1.4, node: 230, peri: 60, m0: 4.4, phone: false },
  { name: "Docker", a: 1.45, e: 0.03, inc: 1.1, node: 5, peri: 330, m0: 0.6, phone: true },
];

export const MAX_A = Math.max(...BODIES.map((b) => b.a * (1 + b.e)));

/** Orbital period (seconds) of a body with a = 1. */
const BASE_PERIOD = 34;
const D2R = Math.PI / 180;

export interface Camera {
  cx: number;
  cy: number;
  /** pixels per logo size */
  scale: number;
  /** elevation above the reference plane, radians */
  elev: number;
  /** azimuth, radians */
  azim: number;
  /** perspective distance, pixels */
  dist: number;
}

export interface Projected {
  x: number;
  y: number;
  /** distance towards the viewer, in logo sizes (negative = behind the logo) */
  depth: number;
  /** perspective scale */
  k: number;
}

/** Mean anomaly of a body at time t (seconds). */
export const meanAnomaly = (b: Body, t: number) => b.m0 + (TAU / (BASE_PERIOD * Math.pow(b.a, 1.5))) * t;

/** Solves Kepler's equation M = E − e·sin E (Newton's method). */
export function eccentricAnomaly(M: number, e: number) {
  let E = M;
  for (let k = 0; k < 6; k++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  return E;
}

/** Position of a body at eccentric anomaly E, projected through the camera. */
export function projectAt(b: Body, E: number, cam: Camera, radiusScale = 1): Projected {
  const a = b.a * radiusScale;
  // in the orbital plane, with the focus (the logo) at the origin
  const xo = a * (Math.cos(E) - b.e);
  const yo = a * Math.sqrt(1 - b.e * b.e) * Math.sin(E);
  // orient the orbit: ω about z, i about x, Ω about z
  const w = b.peri * D2R;
  const i = b.inc * D2R;
  const n = b.node * D2R;
  const x1 = xo * Math.cos(w) - yo * Math.sin(w);
  const y1 = xo * Math.sin(w) + yo * Math.cos(w);
  const y2 = y1 * Math.cos(i);
  const z2 = y1 * Math.sin(i);
  const X = x1 * Math.cos(n) - y2 * Math.sin(n);
  const Y = x1 * Math.sin(n) + y2 * Math.cos(n);
  const Z = z2;
  // camera: turn by the azimuth, then look down at the plane from the elevation
  const xa = X * Math.cos(cam.azim) - Y * Math.sin(cam.azim);
  const ya = X * Math.sin(cam.azim) + Y * Math.cos(cam.azim);
  const depth = -ya * Math.cos(cam.elev) + Z * Math.sin(cam.elev);
  const up = ya * Math.sin(cam.elev) + Z * Math.cos(cam.elev);
  const k = cam.dist / (cam.dist - depth * cam.scale);
  return { x: cam.cx + xa * cam.scale * k, y: cam.cy - up * cam.scale * k, depth, k };
}

const front01 = (depth: number) => clamp(0.5 + depth / 2.4);

/** Draws a whole orbit (or the part between `from` and `to`), split behind/in front of the logo. */
export function drawOrbit(
  back: CanvasRenderingContext2D,
  front: CanvasRenderingContext2D,
  b: Body,
  cam: Camera,
  alpha: number,
  from: number,
  to: number,
  seg: number,
  radiusScale: number,
) {
  if (alpha < 0.004 || to <= from) return;
  const start = Math.floor(seg * from);
  const end = Math.ceil(seg * to);
  let prev = projectAt(b, (start / seg) * TAU, cam, radiusScale);
  for (let i = start + 1; i <= end; i++) {
    const q = projectAt(b, (i / seg) * TAU, cam, radiusScale);
    const d = (prev.depth + q.depth) / 2;
    const f = front01(d);
    const ctx = d < 0 ? back : front;
    ctx.strokeStyle = `rgba(214,196,255,${(alpha * (0.05 + 0.22 * f)).toFixed(3)})`;
    ctx.lineWidth = 0.8 * q.k;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
    prev = q;
  }
}

/** The bright arc a body leaves behind it along its orbit. */
export function drawTrail(
  back: CanvasRenderingContext2D,
  front: CanvasRenderingContext2D,
  b: Body,
  E: number,
  cam: Camera,
  alpha: number,
  radiusScale: number,
  sprite: HTMLCanvasElement,
) {
  if (alpha < 0.004) return;
  const steps = 16;
  const span = 0.42;
  let prev = projectAt(b, E, cam, radiusScale);
  for (let j = 1; j <= steps; j++) {
    const q = projectAt(b, E - (j / steps) * span, cam, radiusScale);
    const fade = Math.pow(1 - j / steps, 1.6);
    const d = (prev.depth + q.depth) / 2;
    const ctx = d < 0 ? back : front;
    ctx.strokeStyle = `rgba(240,232,255,${(alpha * fade * (0.18 + 0.45 * front01(d))).toFixed(3)})`;
    ctx.lineWidth = (0.6 + 1.5 * fade) * q.k;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
    prev = q;
  }
  const h = projectAt(b, E, cam, radiusScale);
  stamp(h.depth < 0 ? back : front, sprite, h.x, h.y, 26 * h.k, alpha * 0.22);
}
