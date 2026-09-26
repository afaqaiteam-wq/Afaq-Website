import { stamp } from "./glow";

/*
 * The constellation: the letter A of the logo traced as stars. Coordinates are in units
 * of the (scaled) logo size, relative to the logo centre. Node 0 is the apex — the
 * guiding star — and every other node is a star one of the orbiting tools turns into.
 */

export type Pt = { x: number; y: number };

export const NODES: Pt[] = [
  { x: 0, y: -0.36 }, // 0 apex
  { x: -0.1, y: -0.18 }, // 1
  { x: -0.2, y: 0.01 }, // 2
  { x: -0.34, y: 0.26 }, // 3 left foot
  { x: -0.19, y: 0.2 }, // 4
  { x: 0, y: -0.05 }, // 5 inner apex
  { x: 0.19, y: 0.2 }, // 6
  { x: 0.34, y: 0.26 }, // 7 right foot
  { x: 0.2, y: 0.01 }, // 8
  { x: 0.1, y: -0.18 }, // 9
];

/** Outline of the A, starting and ending at the apex. */
export const PATH = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
/** Faint cross-links that make it read as a constellation, not a drawing. */
export const MESH: [number, number][] = [
  [1, 9],
  [2, 5],
  [5, 8],
];

/** Which star each tool (in TOOLS order) flies to. */
export const NODE_FOR_TOOL = [1, 9, 2, 8, 5, 3, 7, 4, 6];

/** Services light up one star at a time, in reading order down each leg of the A. */
export const LABELS = [
  { node: 1, key: "agents", side: -1 },
  { node: 9, key: "integrations", side: 1 },
  { node: 2, key: "automation", side: -1 },
  { node: 8, key: "web", side: 1 },
  { node: 3, key: "chatbots", side: -1 },
  { node: 7, key: "consulting", side: 1 },
] as const;

/** Point at fraction `u` (0–1) along a polyline, by length. */
function along(pts: Pt[], lengths: number[], total: number, u: number): Pt {
  let d = u * total;
  for (let i = 0; i < lengths.length; i++) {
    if (d <= lengths[i] || i === lengths.length - 1) {
      const t = lengths[i] ? Math.min(1, d / lengths[i]) : 0;
      return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * t, y: pts[i].y + (pts[i + 1].y - pts[i].y) * t };
    }
    d -= lengths[i];
  }
  return pts[pts.length - 1];
}

/**
 * Draws the stretch of the outline between `from` and `to` (fractions of its length) as a
 * glowing line, with a few light pulses travelling along the visible part.
 */
export function drawOutline(
  ctx: CanvasRenderingContext2D,
  pts: Pt[],
  from: number,
  to: number,
  alpha: number,
  t: number,
  sprite: HTMLCanvasElement,
) {
  if (alpha < 0.004 || to <= from) return;
  const lengths = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
  const total = lengths.reduce((a, b) => a + b, 0);

  const a0 = along(pts, lengths, total, from);
  const passes = [
    { width: 5, color: "200,168,255", a: 0.12 },
    { width: 1.6, color: "244,238,255", a: 0.95 },
  ];
  for (const pass of passes) {
    ctx.strokeStyle = `rgba(${pass.color},${(alpha * pass.a).toFixed(3)})`;
    ctx.lineWidth = pass.width;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(a0.x, a0.y);
    // Walk the real vertices inside the window so corners stay sharp.
    let acc = 0;
    for (let i = 0; i < lengths.length; i++) {
      const end = acc + lengths[i];
      if (end / total > from && end / total < to) ctx.lineTo(pts[i + 1].x, pts[i + 1].y);
      acc = end;
    }
    const a1 = along(pts, lengths, total, to);
    ctx.lineTo(a1.x, a1.y);
    ctx.stroke();
  }

  // pulses of light running along the lines
  for (let m = 0; m < 3; m++) {
    const u = from + (((t * 0.07 + m / 3) % 1) * (to - from));
    const q = along(pts, lengths, total, u);
    stamp(ctx, sprite, q.x, q.y, 9, alpha * 0.85);
  }
}

export function drawMesh(ctx: CanvasRenderingContext2D, pts: Pt[], alpha: number) {
  if (alpha < 0.004) return;
  ctx.strokeStyle = `rgba(200,168,255,${(alpha * 0.3).toFixed(3)})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const [a, b] of MESH) {
    ctx.moveTo(pts[a].x, pts[a].y);
    ctx.lineTo(pts[b].x, pts[b].y);
  }
  ctx.stroke();
}
