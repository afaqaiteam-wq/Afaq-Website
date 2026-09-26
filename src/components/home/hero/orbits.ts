import { stamp } from "./glow";
import { TAU, clamp } from "./timeline";

/*
 * Three orbits around the logo, seen from slightly above. Each ring is a circle tilted
 * away from the viewer (so it reads as a flat ellipse) with a small fixed roll. The rings
 * never drift in orientation: only positions ALONG a ring move over time and with scroll.
 *
 * Depth is real: every segment knows whether it is behind or in front of the logo and is
 * drawn onto the back or front canvas accordingly, so the orbits pass behind the mark.
 */

export const RINGS = [
  { size: 0.8, roll: -0.16, speed: 0.09, dir: 1 },
  { size: 1.1, roll: 0.1, speed: 0.062, dir: -1 },
  { size: 1.42, roll: -0.04, speed: 0.045, dir: 1 },
] as const;

export const TOOLS = [
  { name: "OpenAI", ring: 0 },
  { name: "n8n", ring: 0 },
  { name: "Claude", ring: 1 },
  { name: "Python", ring: 1 },
  { name: "Next.js", ring: 1 },
  { name: "Gemini", ring: 2 },
  { name: "AWS", ring: 2 },
  { name: "Supabase", ring: 2 },
  { name: "Docker", ring: 2 },
] as const;

/** Evenly spaced starting angle of each tool on its ring (rings offset so chips don't line up). */
export const TOOL_PHASE: number[] = TOOLS.map((tool) => {
  const onRing = TOOLS.filter((t) => t.ring === tool.ring);
  const idx = onRing.findIndex((t) => t.name === tool.name);
  return (idx / onRing.length) * TAU + tool.ring * 0.75 + 0.4;
});

export interface RingView {
  cx: number;
  cy: number;
  r: number;
  tilt: number;
  roll: number;
  persp: number;
}

export interface Projected {
  x: number;
  y: number;
  /** -1 (far side, behind the logo) … 1 (near side, in front of it) */
  depth: number;
  /** perspective scale at this point */
  k: number;
}

export function project(v: RingView, a: number): Projected {
  const x = Math.cos(a) * v.r;
  const y0 = Math.sin(a) * v.r;
  const z = y0 * Math.sin(v.tilt);
  const y = y0 * Math.cos(v.tilt);
  const k = v.persp / (v.persp - z);
  const cr = Math.cos(v.roll);
  const sr = Math.sin(v.roll);
  return {
    x: v.cx + (x * cr - y * sr) * k,
    y: v.cy + (x * sr + y * cr) * k,
    depth: z / v.r,
    k,
  };
}

const front01 = (d: number) => clamp((d + 1) / 2);

/** Draws the part of a ring between `from` and `to` (fractions of the loop), with beads. */
export function drawRing(
  back: CanvasRenderingContext2D,
  front: CanvasRenderingContext2D,
  v: RingView,
  spin: number,
  alpha: number,
  from: number,
  to: number,
  seg: number,
) {
  if (alpha < 0.004 || to <= from) return;
  const start = Math.floor(seg * from);
  const end = Math.ceil(seg * to);
  let prev = project(v, spin + (start / seg) * TAU);
  for (let i = start + 1; i <= end; i++) {
    const q = project(v, spin + (i / seg) * TAU);
    const f = front01((prev.depth + q.depth) / 2);
    const ctx = prev.depth + q.depth < 0 ? back : front;
    ctx.strokeStyle = `rgba(200,168,255,${(alpha * (0.14 + 0.52 * f)).toFixed(3)})`;
    ctx.lineWidth = (0.75 + 0.55 * f) * q.k;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
    if (i % 5 === 0) {
      ctx.fillStyle = `rgba(234,224,255,${(alpha * (0.18 + 0.6 * f)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(q.x, q.y, (0.8 + 0.8 * f) * q.k, 0, TAU);
      ctx.fill();
    }
    prev = q;
  }
}

/** A bright comet running along a ring, with a fading tail behind it. */
export function drawComet(
  back: CanvasRenderingContext2D,
  front: CanvasRenderingContext2D,
  v: RingView,
  head: number,
  dir: number,
  alpha: number,
  sprite: HTMLCanvasElement,
) {
  if (alpha < 0.004) return;
  const steps = 24;
  const span = 0.95;
  let prev = project(v, head);
  for (let j = 1; j <= steps; j++) {
    const q = project(v, head - dir * (j / steps) * span);
    const fade = Math.pow(1 - j / steps, 2);
    const f = front01((prev.depth + q.depth) / 2);
    const ctx = prev.depth + q.depth < 0 ? back : front;
    ctx.strokeStyle = `rgba(238,230,255,${(alpha * fade * (0.3 + 0.7 * f)).toFixed(3)})`;
    ctx.lineWidth = (0.6 + 1.6 * fade) * q.k;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
    prev = q;
  }
  const h = project(v, head);
  stamp(h.depth < 0 ? back : front, sprite, h.x, h.y, 11 * h.k, alpha * (0.35 + 0.65 * front01(h.depth)));
}
