"use client";

import Image from "next/image";
import { Fragment, useEffect, useEffectEvent, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from "react";

import type { Person } from "@/content/about";

/*
 * The team as a star map beside a deck of portraits. The A of the logo hangs among a 3D cloud
 * of faint stars: it assembles out of the dark when it comes into view, then floats while the
 * cloud turns slowly around it and toward the pointer. Each person is one of its stars.
 * The portraits are a deck: the next two peek out from behind the front one, so it reads as
 * something to swipe. Throw the front card (touch or mouse) and the next comes forward; until
 * the visitor takes over, the deck turns by itself. Choosing a star brings its person forward.
 */

// The logo's A in logo units. It stays flat and upright so the letter never warps; the depth
// comes from the cloud of stars turning around it.
const NODES: readonly (readonly [number, number, number])[] = [
  [0, -0.36, 0],
  [-0.1, -0.18, 0],
  [-0.2, 0.01, 0],
  [-0.34, 0.26, 0],
  [-0.19, 0.2, 0],
  [0, -0.05, 0],
  [0.19, 0.2, 0],
  [0.34, 0.26, 0],
  [0.2, 0.01, 0],
  [0.1, -0.18, 0],
];
const EDGES: readonly (readonly [number, number])[] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0],
];
const MESH: readonly (readonly [number, number])[] = [[1, 9], [2, 5], [5, 8]];
// Which star each person sits on, in tier order: apex, shoulders, inner apex, feet.
// Mirrored in Arabic so the second person sits on the reading side.
const SEATS_LTR = [0, 2, 8, 5, 3, 7];
const SEATS_RTL = [0, 8, 2, 5, 7, 3];
type Side = "up" | "down" | "start" | "end";
const LABEL: Record<number, Side> = { 0: "up", 2: "start", 8: "end", 5: "up", 3: "down", 7: "down" };

// the role decodes out of letters of its own script
const GLYPHS = { ar: "ابتثجحخدذرزسشصضطظعغفقكلمنهوي0123456789", en: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" };
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* ───────────── the star map (canvas 2D, projected from 3D) ───────────── */

function createSky(box: HTMLDivElement, canvas: HTMLCanvasElement, buttons: (HTMLButtonElement | null)[], seats: number[]) {
  const ctx = canvas.getContext("2d")!;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // where every A star starts before it flies into place
  const starts = NODES.map(() => {
    const a = Math.random() * Math.PI * 2;
    const b = (Math.random() - 0.5) * Math.PI;
    const r = 1.2 + Math.random() * 0.8;
    // never behind the viewer: they come in from the far side and the edges
    return [Math.cos(a) * Math.cos(b) * r, Math.sin(b) * r * 0.8, 0.4 + Math.abs(Math.sin(a) * Math.cos(b)) * r] as const;
  });
  const delays = NODES.map((_, i) => i * 0.045 + Math.random() * 0.08);
  // faint background stars in a loose cloud around the figure
  const dust = Array.from({ length: 170 }, () => {
    const g = () => (Math.random() + Math.random() + Math.random()) / 3 - 0.5;
    return { x: g() * 1.5, y: g() * 1.3 - 0.03, z: g() * 1.1, s: 0.4 + Math.random() * 1.1, ph: Math.random() * 6.28, sp: 0.6 + Math.random() * 1.6 };
  });
  let active = 0;
  let shownAt = -1;
  let raf = 0;
  let running = false;
  const view = { yaw: 0, pitch: 0, ty: 0, tp: 0 };
  let drift = 0;
  const ring = { t0: 0 };

  // the cloud turns with the view; the A itself (rigid) only drifts a little, never rotates
  function project(x: number, y: number, z: number, W: number, H: number, S: number, rigid = false) {
    const yaw = rigid ? 0 : view.yaw, pitch = rigid ? 0 : view.pitch;
    if (rigid) {
      x += view.yaw * 0.03;
      y += drift - view.pitch * 0.03;
    }
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const x1 = x * cy - z * sy;
    const z1 = x * sy + z * cy;
    const y1 = (y + 0.05) * cp - z1 * sp;
    const z2 = (y + 0.05) * sp + z1 * cp;
    const f = 1.7 / Math.max(0.6, 1.7 + z2);
    return { x: W / 2 + x1 * S * f, y: H / 2 + y1 * S * f, f, z: z2 };
  }

  function frame(now: number) {
    const t = now / 1000;
    const r = box.getBoundingClientRect();
    const W = r.width, H = r.height;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    // narrow boxes leave room for the names on the shoulders
    const S = Math.min(W / (W < 440 ? 1.12 : 0.9), H / 0.8);

    // a slow sway, nudged toward the pointer
    const sway = reduced ? 0 : Math.sin(t * 0.22) * 0.35;
    drift = reduced ? 0 : Math.sin(t * 0.6) * 0.008;
    const nod = reduced ? 0 : Math.sin(t * 0.17) * 0.06;
    view.yaw += (sway + view.ty - view.yaw) * 0.05;
    view.pitch += (nod + view.tp - view.pitch) * 0.05;

    const asm = shownAt < 0 ? 0 : reduced ? 1 : (now - shownAt) / 1000 / 1.9;
    const prog = NODES.map((_, i) => ease(clamp((asm - delays[i]) / 0.62)));
    const pos = NODES.map((n, i) => {
      const k = prog[i];
      const s = starts[i];
      return project(s[0] + (n[0] - s[0]) * k, s[1] + (n[1] - s[1]) * k, s[2] + (n[2] - s[2]) * k, W, H, S, true);
    });

    ctx.globalCompositeOperation = "lighter";
    // dust
    const dustA = clamp(asm * 1.6);
    for (const d of dust) {
      const p = project(d.x, d.y, d.z, W, H, S);
      const a = dustA * (0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * d.sp + d.ph))) * clamp(p.f * 0.9);
      const sz = d.s * p.f;
      ctx.fillStyle = `rgba(226,214,255,${a.toFixed(3)})`;
      ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
    }

    // lines: the outline, then the faint cross-links; the chosen star's own lines burn brighter
    const seat = seats[active];
    const line = (a: number, b: number, base: number) => {
      const k = Math.min(prog[a], prog[b]);
      if (k <= 0.01) return;
      const lit = a === seat || b === seat;
      const pa = pos[a], pb = pos[b];
      const depth = clamp(((pa.f + pb.f) / 2 - 0.75) * 1.6, 0.35, 1);
      ctx.strokeStyle = `rgba(214,196,255,${(k * depth * (lit ? 0.95 : base)).toFixed(3)})`;
      ctx.lineWidth = lit ? 1.6 : 1;
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pa.x + (pb.x - pa.x) * k, pa.y + (pb.y - pa.y) * k);
      ctx.stroke();
      if (lit && !reduced) {
        // a bead of light running out from the chosen star
        const u = (t * 0.6) % 1;
        const [from, to] = a === seat ? [pa, pb] : [pb, pa];
        const x = from.x + (to.x - from.x) * u, y = from.y + (to.y - from.y) * u;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
        g.addColorStop(0, `rgba(255,255,255,${(0.9 * (1 - u)).toFixed(3)})`);
        g.addColorStop(1, "rgba(200,168,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(x - 7, y - 7, 14, 14);
      }
    };
    EDGES.forEach(([a, b]) => line(a, b, 0.5));
    MESH.forEach(([a, b]) => line(a, b, 0.18));

    // stars: spare ones small, people's bright, the chosen one with a breathing halo
    NODES.forEach((_, i) => {
      const p = pos[i];
      const k = prog[i];
      if (k <= 0) return;
      const person = seats.indexOf(i);
      const on = i === seat;
      const rad = (person < 0 ? 1.4 : on ? 4.2 : 2.6) * p.f;
      const glow = (person < 0 ? 6 : on ? 26 : 14) * p.f;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow);
      g.addColorStop(0, `rgba(255,255,255,${k.toFixed(3)})`);
      g.addColorStop(0.25, `rgba(226,214,255,${(0.55 * k).toFixed(3)})`);
      g.addColorStop(1, "rgba(140,92,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(p.x - glow, p.y - glow, glow * 2, glow * 2);
      ctx.fillStyle = `rgba(255,255,255,${k.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      ctx.fill();
      if (on && !reduced) {
        const c = ((now - ring.t0) / 1000 / 2.4) % 1;
        ctx.strokeStyle = `rgba(200,168,255,${(0.7 * (1 - c) * k).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (10 + c * 22) * p.f, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
    ctx.globalCompositeOperation = "source-over";

    // the buttons ride on their stars
    buttons.forEach((b, i) => {
      if (!b) return;
      const p = pos[seats[i]];
      b.style.transform = `translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px) translate(-50%,-50%)`;
      b.style.opacity = prog[seats[i]].toFixed(3);
    });

    if (running) raf = requestAnimationFrame(frame);
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || reduced) return;
    const r = box.getBoundingClientRect();
    view.ty = clamp((e.clientX - r.left) / r.width - 0.5, -0.8, 0.8) * 0.7;
    view.tp = -clamp((e.clientY - r.top) / r.height - 0.5, -0.8, 0.8) * 0.3;
  };
  const onLeave = () => {
    view.ty = 0;
    view.tp = 0;
  };
  box.addEventListener("pointermove", onMove);
  box.addEventListener("pointerleave", onLeave);

  return {
    start() {
      if (shownAt < 0) shownAt = performance.now();
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    setActive(k: number) {
      active = k;
      ring.t0 = performance.now();
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
    },
  };
}

/* ───────────── the deck of portraits ───────────── */

// how long each person stays in front while the deck turns by itself
const AUTO_MS = 7000;
const MOVE = "transform 700ms cubic-bezier(0.22,1,0.36,1), opacity 500ms ease";
const THROW = "transform 650ms cubic-bezier(0.2,0.8,0.3,1), opacity 420ms ease 140ms";

type Pose = { transform: string; opacity: number; z: number; dim: string };

// `rel` is how far a card sits behind the front one. `fan` is the side the deck opens toward
// (the end of the line: right in English, left in Arabic). While a card is dragged, --dx moves
// the front one and --pull draws the next one forward; both live on the deck, so no re-render.
function pose(rel: number, fan: number, dealt: boolean): Pose {
  if (rel === 0)
    return {
      transform: "translate3d(calc(var(--dx,0) * 1px),0,0) rotate(calc(var(--dx,0) * 0.045deg)) scale(1)",
      opacity: 1,
      z: 30,
      dim: "0",
    };
  if (!dealt) return { transform: "translate3d(0,0,0) rotate(0deg) scale(0.96)", opacity: rel < 3 ? 1 : 0, z: 30 - rel * 10, dim: "0.6" };
  if (rel === 1)
    return {
      transform: `translate3d(calc(${10 * fan}% * (1 - var(--pull,0))),calc(-3% * (1 - var(--pull,0))),0) rotate(calc(${5 * fan}deg * (1 - var(--pull,0)))) scale(calc(0.93 + 0.07 * var(--pull,0)))`,
      opacity: 1,
      z: 20,
      dim: "calc(0.3 * (1 - var(--pull,0)))",
    };
  if (rel === 2) return { transform: `translate3d(${19 * fan}%,-5%,0) rotate(${9 * fan}deg) scale(0.86)`, opacity: 1, z: 10, dim: "0.5" };
  return { transform: `translate3d(${23 * fan}%,-7%,0) rotate(${12 * fan}deg) scale(0.8)`, opacity: 0, z: 0, dim: "0.7" };
}
const away = (dir: number): Pose => ({
  transform: `translate3d(${dir * 125}%,-6%,0) rotate(${dir * 16}deg) scale(0.96)`,
  opacity: 0,
  z: 40,
  dim: "0",
});

function Chevron({ back = false }: { back?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="rtl:-scale-x-100"
    >
      <path d={back ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

/* ───────────── the component ───────────── */

type Labels = { quoteOpen: string; quoteClose: string; hint: { touch: string; pointer: string }; prev: string; next: string };

export function TeamConstellation({ people, lang, labels }: { people: Person[]; lang: string; labels: Labels }) {
  const rtl = lang === "ar";
  const seats = rtl ? SEATS_RTL : SEATS_LTR;
  const sep = rtl ? "، " : ", ";
  const n = people.length;
  // moving forward throws the card toward the start of the line; the deck fans toward the end
  const fwd = rtl ? 1 : -1;
  const fan = -fwd;

  const [active, setActive] = useState(0);
  const [thrown, setThrown] = useState<{ i: number; dir: number } | null>(null);
  const [entering, setEntering] = useState(-1);
  const [dealt, setDealt] = useState(false);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const [touched, setTouched] = useState(false);
  const [tease, setTease] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const skyBox = useRef<HTMLDivElement>(null);
  const skyCanvas = useRef<HTMLCanvasElement>(null);
  const stars = useRef<(HTMLButtonElement | null)[]>([]);
  const deck = useRef<HTMLDivElement>(null);
  const roleEl = useRef<HTMLParagraphElement>(null);
  const sky = useRef<ReturnType<typeof createSky> | null>(null);
  const activeRef = useRef(0);
  const throwTimer = useRef(0);
  const hoverTimer = useRef(0);
  const drag = useRef({ id: -1, x: 0, y: 0, dx: 0, lx: 0, t: 0, v: 0, axis: "" as "" | "x" | "y" });

  // bring person k to the front: the next one by throwing the front card away, the previous one
  // by bringing its card back in from the side it left by, anyone else up from the back of the deck
  const goTo = (k: number, o: { dir?: number; user?: boolean } = {}) => {
    if (o.user) setTouched(true);
    const cur = activeRef.current;
    if (k === cur) return;
    if (!o.dir && k === (cur - 1 + n) % n) {
      setEntering(k);
      requestAnimationFrame(() => requestAnimationFrame(() => setEntering(-1)));
    } else {
      setThrown({ i: cur, dir: o.dir ?? fwd });
      window.clearTimeout(throwTimer.current);
      throwTimer.current = window.setTimeout(() => setThrown(null), 800);
    }
    activeRef.current = k;
    setActive(k);
    sky.current?.setActive(k);
  };
  const next = (user = true) => goTo((activeRef.current + 1) % n, { user });
  const prev = () => goTo((activeRef.current - 1 + n) % n, { user: true });

  useEffect(() => {
    const seatsNow = lang === "ar" ? SEATS_RTL : SEATS_LTR;
    sky.current = createSky(skyBox.current!, skyCanvas.current!, stars.current, seatsNow);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) sky.current?.start();
        else sky.current?.stop();
      },
      { threshold: 0.15 },
    );
    io.observe(stage.current!);
    return () => {
      io.disconnect();
      sky.current?.destroy();
    };
  }, [lang]);

  // the deck deals itself out the first time it's in view, then once teases a swipe
  const teaseOnce = useEffectEvent(() => {
    if (!touched) setTease(true);
  });
  useEffect(() => {
    let dealtYet = false;
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        const vis = e.intersectionRatio >= 0.5;
        setInView(vis);
        if (vis && !dealtYet) {
          dealtYet = true;
          setDealt(true);
          if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) t = window.setTimeout(teaseOnce, 1300);
        }
      },
      { threshold: [0, 0.5] },
    );
    io.observe(deck.current!);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // until the visitor takes over, the deck turns by itself while it's in view and not under the pointer
  const running = !touched && inView && !hover;
  const advance = useEffectEvent(() => next(false));
  useEffect(() => {
    if (!running || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(advance, AUTO_MS);
    return () => window.clearTimeout(id);
  }, [active, running]);

  // the role decodes into place, like a model writing it
  useEffect(() => {
    const el = roleEl.current;
    if (!el) return;
    const text = people[active].role;
    const glyphs = lang === "ar" ? GLYPHS.ar : GLYPHS.en;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = text;
      return;
    }
    let id = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 850);
      const m = Math.floor(k * text.length);
      let out = text.slice(0, m);
      for (let i = m; i < text.length; i++) out += text[i] === " " ? " " : glyphs[(Math.random() * glyphs.length) | 0];
      el.textContent = out;
      if (k < 1) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [active, people, lang]);

  /* dragging: the front card follows the finger or mouse and tilts; let go past a quarter of its
     width (or with a flick) and it's thrown, otherwise it settles back. A tap brings the next one. */
  const setDx = (el: HTMLElement, dx: number) => {
    el.style.setProperty("--dx", dx.toFixed(1));
    el.style.setProperty("--pull", Math.min(1, Math.abs(dx) / (el.offsetWidth * 0.6)).toFixed(3));
  };
  const tilt = (el: HTMLElement, x: number, y: number) => {
    el.style.setProperty("--ry", (x * 8).toFixed(2));
    el.style.setProperty("--rx", (-y * 6).toFixed(2));
    el.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, lx: e.clientX, t: e.timeStamp, v: 0, axis: "" };
  };
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const s = drag.current;
    if (s.id !== e.pointerId) {
      if (e.pointerType === "mouse") {
        const r = el.getBoundingClientRect();
        tilt(el, (e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
      }
      return;
    }
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (!s.axis) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        s.axis = "x";
        el.setPointerCapture(e.pointerId);
        el.dataset.drag = "";
        tilt(el, 0, 0);
        setTouched(true);
        setTease(false);
      } else if (Math.abs(dy) > 8) {
        s.axis = "y";
      }
      if (s.axis !== "x") return;
    }
    if (s.axis !== "x") return;
    const dt = e.timeStamp - s.t;
    if (dt > 0) s.v = ((e.clientX - s.lx) / dt) * 0.6 + s.v * 0.4;
    s.lx = e.clientX;
    s.t = e.timeStamp;
    s.dx = dx;
    setDx(el, dx);
  };
  const onUp = (e: RPointerEvent<HTMLDivElement>) => {
    const s = drag.current;
    if (s.id !== e.pointerId) return;
    s.id = -1;
    const el = e.currentTarget;
    if (s.axis === "x") {
      delete el.dataset.drag;
      const thrownAway = Math.abs(s.dx) > el.offsetWidth * 0.25 || (Math.abs(s.v) > 0.45 && Math.abs(s.dx) > 24);
      setDx(el, 0);
      if (thrownAway) goTo((activeRef.current + 1) % n, { dir: s.dx < 0 ? -1 : 1, user: true });
    } else if (!s.axis) {
      next();
    }
  };
  const onCancel = (e: RPointerEvent<HTMLDivElement>) => {
    const s = drag.current;
    if (s.id !== e.pointerId) return;
    s.id = -1;
    if (s.axis === "x") {
      delete e.currentTarget.dataset.drag;
      setDx(e.currentTarget, 0);
    }
  };

  const p = people[active];
  const words = p.name.split(" ");

  return (
    <div
      ref={stage}
      className="relative mt-14 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:items-center lg:gap-x-12 lg:gap-y-8"
    >
      {/* the star map: the A of the logo, one star per person */}
      <div className="min-w-0 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-end">
        <div ref={skyBox} dir="ltr" className="relative mx-auto aspect-[6/5] w-full max-w-[480px] touch-pan-y sm:aspect-square">
          <canvas ref={skyCanvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />
          {people.map((m, i) => {
            const side = LABEL[seats[i]];
            const on = i === active;
            return (
              <button
                key={m.name}
                ref={(el) => {
                  stars.current[i] = el;
                }}
                type="button"
                aria-pressed={on}
                aria-label={`${m.name}${sep}${m.role}`}
                onClick={() => goTo(i, { user: true })}
                onFocus={() => goTo(i, { user: true })}
                onMouseEnter={() => {
                  if (!window.matchMedia("(hover: hover)").matches) return;
                  window.clearTimeout(hoverTimer.current);
                  hoverTimer.current = window.setTimeout(() => goTo(i, { user: true }), 200);
                }}
                onMouseLeave={() => window.clearTimeout(hoverTimer.current)}
                className="group/star absolute left-0 top-0 grid size-11 place-items-center rounded-full opacity-0"
              >
                <span
                  dir={rtl ? "rtl" : "ltr"}
                  className={`pointer-events-none absolute whitespace-nowrap text-[11px] transition-colors duration-300 sm:text-[13px] ${on ? "font-medium text-ink" : "text-dim group-hover/star:text-soft"} ${
                    side === "up" ? "bottom-full -mb-1" : side === "down" ? "top-full -mt-1" : side === "start" ? "right-full -mr-1" : "left-full -ml-1"
                  }`}
                >
                  {m.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* the deck of portraits, with its controls right under it */}
      <div className="min-w-0 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
        <div className="relative -start-[5%] mx-auto w-[74%] max-w-[330px] sm:w-[56%] sm:max-w-[380px] lg:w-[74%] lg:max-w-[440px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-y-10 inset-x-0 -z-10 rounded-[60px] bg-[radial-gradient(60%_55%_at_50%_60%,rgb(124_77_255/0.42),transparent_72%)] blur-2xl sm:-inset-x-10"
          />
          <div
            ref={deck}
            role="group"
            tabIndex={0}
            aria-label={labels.hint.pointer}
            style={{ "--fwd": fwd } as CSSProperties}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onCancel}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setHover(true);
            }}
            onPointerLeave={(e) => {
              tilt(e.currentTarget, 0, 0);
              setHover(false);
            }}
            onDragStart={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
              e.preventDefault();
              if ((e.key === "ArrowRight") !== rtl) next();
              else prev();
            }}
            className="group/deck relative aspect-[4/5] cursor-grab touch-pan-y select-none rounded-[24px] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lav active:cursor-grabbing"
          >
            {people.map((m, i) => {
              const rel = (i - active + n) % n;
              const isThrown = thrown?.i === i;
              const isEntering = entering === i;
              const front = rel === 0 && !isThrown;
              const ps = isThrown ? away(thrown.dir) : isEntering ? away(fwd) : pose(rel, fan, dealt);
              const live = rel <= 1 && !isThrown && !isEntering;
              return (
                <div
                  key={m.name}
                  data-front={front ? "" : undefined}
                  aria-hidden={!front}
                  onAnimationEnd={(e) => {
                    if (e.animationName === "team-tease") setTease(false);
                  }}
                  style={{ transform: ps.transform, opacity: ps.opacity, zIndex: ps.z, transition: isEntering ? "none" : isThrown ? THROW : MOVE }}
                  className={`team-card absolute inset-0 [perspective:1400px] ${live ? "group-data-[drag]/deck:transition-none!" : ""} ${front && tease ? "team-tease" : ""}`}
                >
                  <div
                    className="relative h-full transition-transform duration-700 ease-out"
                    style={front ? { transform: "rotateY(calc(var(--ry,0) * 1deg)) rotateX(calc(var(--rx,0) * 1deg))" } : undefined}
                  >
                    <div className="relative h-full overflow-hidden rounded-[24px] border border-lav/25 bg-surface shadow-[0_30px_70px_-25px_rgb(0_0_0/0.95)]">
                      <Image
                        src={m.photo}
                        alt={m.name}
                        fill
                        draggable={false}
                        priority={i === 0}
                        loading={i === 0 ? undefined : "eager"}
                        sizes="(min-width: 1024px) 440px, (min-width: 640px) 380px, 74vw"
                        className="object-cover object-[50%_24%]"
                      />
                      {/* a dusk at the foot of the photo, a soft glare under the pointer, and shade on the cards behind */}
                      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_62%,rgb(7_6_11/0.5))]" />
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(420px_circle_at_var(--gx,50%)_var(--gy,30%),rgb(255_255_255/0.1),transparent_60%)] mix-blend-screen transition-opacity duration-500 ${front ? "" : "opacity-0"}`}
                      />
                      <span
                        aria-hidden="true"
                        style={{ opacity: ps.dim }}
                        className={`pointer-events-none absolute inset-0 bg-[#07060b] transition-opacity duration-500 ${live ? "group-data-[drag]/deck:transition-none!" : ""}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* previous · where you are, filling while it turns by itself · next */}
        <div className="mt-8 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={prev}
            aria-label={labels.prev}
            className="grid size-11 place-items-center rounded-full border border-line text-soft transition-colors duration-300 hover:border-lav/50 hover:text-ink"
          >
            <Chevron back />
          </button>
          <div className="w-[164px] sm:w-[200px]">
            <p dir="ltr" className="text-center font-display text-[13px] tabular-nums tracking-[0.16em] text-dim">
              <span className="text-lav">{String(active + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
            </p>
            <div aria-hidden="true" className="mt-2.5 flex gap-1.5">
              {people.map((m, i) => (
                <span key={m.name} className="h-0.5 flex-1 overflow-hidden rounded-full bg-lav/15">
                  <span
                    key={i === active ? `${active}-${running}` : "s"}
                    style={i === active && running ? { animationDuration: `${AUTO_MS}ms` } : undefined}
                    className={`block h-full origin-left rounded-full bg-lav transition-[scale] duration-500 rtl:origin-right ${
                      i < active ? "scale-x-100" : i === active ? `scale-x-100 ${running ? "team-fill" : ""}` : "scale-x-0"
                    }`}
                  />
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => next()}
            aria-label={labels.next}
            className="grid size-11 place-items-center rounded-full border border-line text-soft transition-colors duration-300 hover:border-lav/50 hover:text-ink"
          >
            <Chevron />
          </button>
        </div>
        <p
          aria-hidden={touched}
          style={{ "--fwd": fwd } as CSSProperties}
          className={`mt-4 flex items-center justify-center gap-2.5 text-[13px] text-dim transition-opacity duration-700 ${touched ? "opacity-0" : ""}`}
        >
          <span aria-hidden="true" className="relative h-px w-8 bg-lav/30">
            <span className="team-swipe absolute start-[calc(50%-3px)] top-[-2.5px] size-1.5 rounded-full bg-lav" />
          </span>
          <span className="[@media(pointer:fine)]:hidden">{labels.hint.touch}</span>
          <span className="hidden [@media(pointer:fine)]:inline">{labels.hint.pointer}</span>
        </p>
      </div>

      {/* who's in front: the name rises word by word, the role decodes, the line fades in */}
      <div
        className="min-h-[13rem] min-w-0 text-center lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start lg:text-start"
        aria-live={touched ? "polite" : "off"}
      >
        <h3 key={`n${active}`} className="font-display text-[clamp(32px,3.6vw,52px)] font-semibold leading-[1.12] tracking-[-0.025em]">
          {words.map((w, i) => (
            <Fragment key={i}>
              <span className="inline-block overflow-hidden pb-[0.12em] align-top">
                <span className="team-word inline-block" style={{ animationDelay: `${150 + i * 70}ms` }}>
                  {w}
                </span>
              </span>
              {i < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </h3>
        <p ref={roleEl} className="mt-1 text-[15px] text-lav">
          {p.role}
        </p>
        <p key={`l${active}`} className={`team-fade mx-auto mt-4 max-w-[30em] lg:mx-0 ${p.quote ? "text-[clamp(17px,1.5vw,21px)] text-ink" : "text-muted"}`}>
          {p.quote ? `${labels.quoteOpen}${p.quote}${labels.quoteClose}` : p.line}
        </p>
      </div>

      {/* the whole team for screen readers and search, whoever is in front */}
      <ul className="sr-only">
        {people.map((m) => (
          <li key={m.name}>
            {m.name}
            {sep}
            {m.role}. {m.line}
          </li>
        ))}
      </ul>
    </div>
  );
}
