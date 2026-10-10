"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import type { Person } from "@/content/about";

/*
 * The team as a constellation: the A of the logo traced in stars (the same figure as the
 * home intro), with each person on one of its stars. Choosing a star sends a shooting star
 * to the portrait; where it lands, the new portrait opens in a ring of light and a burst
 * of sparks scatters. The name rises word by word and the role decodes into place.
 */

// The logo's A, in logo units around its centre (matches components/home/hero/constellation.ts).
const NODES = [
  [0, -0.36],
  [-0.1, -0.18],
  [-0.2, 0.01],
  [-0.34, 0.26],
  [-0.19, 0.2],
  [0, -0.05],
  [0.19, 0.2],
  [0.34, 0.26],
  [0.2, 0.01],
  [0.1, -0.18],
] as const;
const PATH = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const MESH = [
  [1, 9],
  [2, 5],
  [5, 8],
];
// Which star each person sits on, in tier order: apex, the two shoulders, the inner apex, the feet.
// Mirrored in Arabic so the second person sits on the reading side.
const SEATS_LTR = [0, 2, 8, 5, 3, 7];
const SEATS_RTL = [0, 8, 2, 5, 7, 3];
// Where each star's name sits so labels never collide: above the apex, outward on the
// shoulders and over the inner apex (clear of its lines), below the feet.
const LABEL: Record<number, "up" | "down" | "start" | "end"> = { 0: "up", 2: "start", 8: "end", 5: "up", 3: "down", 7: "down" };

// viewBox in thousandths of a logo unit, with room for the labels
const VB = { x: -460, y: -470, w: 920, h: 830 };
const pct = (n: readonly [number, number]) => ({
  left: `${((n[0] * 1000 - VB.x) / VB.w) * 100}%`,
  top: `${((n[1] * 1000 - VB.y) / VB.h) * 100}%`,
});
const pathD = PATH.map((i, k) => `${k ? "L" : "M"}${NODES[i][0] * 1000} ${NODES[i][1] * 1000}`).join(" ");
const meshD = MESH.map(([a, b]) => `M${NODES[a][0] * 1000} ${NODES[a][1] * 1000}L${NODES[b][0] * 1000} ${NODES[b][1] * 1000}`).join(" ");

const GLYPHS = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي0123456789";

interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; s: number }

interface Els {
  stage: HTMLDivElement;
  canvas: HTMLCanvasElement;
  frame: HTMLDivElement;
  ring: HTMLSpanElement;
  layers: (HTMLDivElement | null)[];
  stars: (HTMLButtonElement | null)[];
}

/** The animation behind the component: the shooting star, the sparks and the portrait reveal. */
function createShow(el: Els, onActive: (k: number) => void) {
  let busy = false;
  let shown = 0;
  let queued: number | null = null;
  const sparks: Spark[] = [];
  let comet: { t0: number; from: [number, number]; to: [number, number]; ctl: [number, number]; trail: [number, number][]; k: number } | null = null;
  let raf = 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- canvas: the shooting star and the sparks ----
  function loop() {
    const c = el.canvas;
    const s = el.stage;
    if (!c || !s) return;
    const ctx = c.getContext("2d")!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = s.getBoundingClientRect();
    if (c.width !== Math.round(r.width * dpr) || c.height !== Math.round(r.height * dpr)) {
      c.width = Math.round(r.width * dpr);
      c.height = Math.round(r.height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, r.width, r.height);
    ctx.globalCompositeOperation = "lighter";
    const now = performance.now();

    const cm = comet;
    if (cm) {
      const k = Math.min(1, (now - cm.t0) / 720);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      const x = (1 - e) * (1 - e) * cm.from[0] + 2 * (1 - e) * e * cm.ctl[0] + e * e * cm.to[0];
      const y = (1 - e) * (1 - e) * cm.from[1] + 2 * (1 - e) * e * cm.ctl[1] + e * e * cm.to[1];
      cm.trail.unshift([x, y]);
      if (cm.trail.length > 22) cm.trail.pop();
      // tail: a line that thins and fades behind the head
      for (let i = 1; i < cm.trail.length; i++) {
        const a = 1 - i / cm.trail.length;
        ctx.strokeStyle = `rgba(214,196,255,${(a * 0.9).toFixed(3)})`;
        ctx.lineWidth = 3.2 * a + 0.4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(cm.trail[i - 1][0], cm.trail[i - 1][1]);
        ctx.lineTo(cm.trail[i][0], cm.trail[i][1]);
        ctx.stroke();
      }
      // the head
      const g = ctx.createRadialGradient(x, y, 0, x, y, 22);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.18, "rgba(236,226,255,0.85)");
      g.addColorStop(1, "rgba(140,92,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - 22, y - 22, 44, 44);
      // a few sparks shed along the way
      if (Math.random() < 0.7) sparks.push({ x, y, vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2, life: 0, max: 380 + Math.random() * 260, s: 0.8 + Math.random() * 1.2 });
      if (k >= 1) {
        comet = null;
        impact(cm.k, cm.to);
      }
    }

    // sparks: tiny four-point stars that drift, slow down and fade
    const list = sparks;
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      p.life += 16;
      if (p.life > p.max) {
        list.splice(i, 1);
        continue;
      }
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      const a = 1 - p.life / p.max;
      const sz = p.s * (0.6 + a);
      ctx.fillStyle = `rgba(240,232,255,${a.toFixed(3)})`;
      ctx.fillRect(p.x - sz * 2.2, p.y - 0.5, sz * 4.4, 1);
      ctx.fillRect(p.x - 0.5, p.y - sz * 2.2, 1, sz * 4.4);
      ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
      ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
    }

    if (comet || list.length) raf = requestAnimationFrame(loop);
    else raf = 0;
  }

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(loop);
  };

  // ---- the portrait opens from where the shooting star lands ----
  function reveal(k: number, at: [number, number] | null) {
    const prev = shown;
    shown = k;
    const f = el.frame;
    const L = el.layers;
    if (!f) return;
    const fr = f.getBoundingClientRect();
    const sr = el.stage!.getBoundingClientRect();
    const ix = at ? ((at[0] + sr.left - fr.left) / fr.width) * 100 : 50;
    const iy = at ? ((at[1] + sr.top - fr.top) / fr.height) * 100 : 50;
    L.forEach((el, i) => {
      if (!el) return;
      if (i === k) {
        el.style.transition = "none";
        el.style.zIndex = "3";
        el.style.clipPath = `circle(0% at ${ix}% ${iy}%)`;
        el.querySelector("img")?.animate([{ scale: "1.08" }, { scale: "1" }], { duration: 1600, easing: "cubic-bezier(.22,1,.36,1)" });
        void el.offsetWidth;
        el.style.transition = "clip-path 1.15s cubic-bezier(.65,0,.35,1)";
        el.style.clipPath = `circle(150% at ${ix}% ${iy}%)`;
      } else if (i === prev) {
        el.style.zIndex = "2";
      } else {
        el.style.zIndex = "1";
        el.style.transition = "none";
        el.style.clipPath = "circle(0% at 50% 50%)";
      }
    });
    const rg = el.ring;
    if (rg && !reduced) {
      rg.style.left = `${ix}%`;
      rg.style.top = `${iy}%`;
      rg.animate(
        [
          { transform: "translate(-50%,-50%) scale(0)", opacity: 1 },
          { transform: "translate(-50%,-50%) scale(1)", opacity: 0 },
        ],
        { duration: 1150, easing: "cubic-bezier(.65,0,.35,1)" },
      );
    }
    window.setTimeout(() => {
      const p = L[prev];
      if (p && shown !== prev) {
        p.style.transition = "none";
        p.style.zIndex = "1";
        p.style.clipPath = "circle(0% at 50% 50%)";
      }
      busy = false;
      if (queued != null && queued !== shown) {
        const q = queued;
        queued = null;
        go(q);
      }
    }, reduced ? 0 : 1200);
  }

  function impact(k: number, at: [number, number]) {
    for (let i = 0; i < 46; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 1.2 + Math.random() * 5.5;
      sparks.push({ x: at[0], y: at[1], vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 600 + Math.random() * 600, s: 0.8 + Math.random() * 1.6 });
    }
    kick();
    reveal(k, at);
  }

  function go(k: number) {
    if (k === shown && !busy) return;
    if (busy) {
      queued = k;
      onActive(k);
      return;
    }
    busy = true;
    onActive(k);
    if (reduced) {
      reveal(k, null);
      return;
    }
    const s = el.stage!.getBoundingClientRect();
    const st = el.stars[k]!.getBoundingClientRect();
    const fr = el.frame!.getBoundingClientRect();
    const from: [number, number] = [st.left + st.width / 2 - s.left, st.top + st.height / 2 - s.top];
    // land just inside the portrait, on the side facing the star
    const cx = Math.min(fr.right - fr.width * 0.18, Math.max(fr.left + fr.width * 0.18, st.left + st.width / 2));
    const cy = Math.min(fr.bottom - fr.height * 0.2, Math.max(fr.top + fr.height * 0.22, st.top + st.height / 2));
    const to: [number, number] = [cx - s.left, cy - s.top];
    const mx = (from[0] + to[0]) / 2;
    const my = (from[1] + to[1]) / 2;
    const dist = Math.hypot(to[0] - from[0], to[1] - from[1]);
    const ctl: [number, number] = [mx, my - dist * 0.28];
    comet = { t0: performance.now(), from, to, ctl, trail: [], k };
    kick();
  }

  return {
    go,
    destroy() {
      cancelAnimationFrame(raf);
    },
  };
}

export function TeamConstellation({ people, lang, labels }: { people: Person[]; lang: string; labels: { quoteOpen: string; quoteClose: string } }) {
  const rtl = lang === "ar";
  const seats = rtl ? SEATS_RTL : SEATS_LTR;
  const sep = rtl ? "، " : ", ";
  const [active, setActive] = useState(0);
  const [drawn, setDrawn] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const ring = useRef<HTMLSpanElement>(null);
  const stars = useRef<(HTMLButtonElement | null)[]>([]);
  const roleEl = useRef<HTMLParagraphElement>(null);
  const show = useRef<ReturnType<typeof createShow> | null>(null);
  const reduced = useRef(false);

  // the role decodes into place, like a model writing it
  useEffect(() => {
    const el = roleEl.current;
    if (!el) return;
    const text = people[active].role;
    if (reduced.current) {
      el.textContent = text;
      return;
    }
    let id = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 850);
      const n = Math.floor(k * text.length);
      let out = text.slice(0, n);
      for (let i = n; i < text.length; i++) out += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      el.textContent = out;
      if (k < 1) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [active, people]);

  // draw the figure when it comes into view
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    show.current = createShow(
      { stage: stage.current!, canvas: canvas.current!, frame: frame.current!, ring: ring.current!, layers: layers.current, stars: stars.current },
      setActive,
    );
    const el = stage.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setDrawn(true);
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      show.current?.destroy();
    };
  }, []);

  const hoverTimer = useRef(0);
  const p = people[active];

  return (
    <div ref={stage} className="relative mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:items-center lg:gap-12" data-drawn={drawn ? "" : undefined}>
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 h-full w-full" />

      {/* the portrait */}
      <div className="lg:order-2 lg:col-span-7">
        <div
          ref={frame}
          className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[28px] border border-lav/20 bg-surface shadow-[0_60px_120px_-50px_rgb(124_77_255/0.6)]"
        >
          {people.map((m, i) => (
            <div
              key={m.name}
              ref={(el) => {
                layers.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ zIndex: i === 0 ? 3 : 1, clipPath: i === 0 ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)" }}
            >
              <Image
                src={m.photo}
                alt={m.name}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover object-[50%_24%]"
              />
            </div>
          ))}
          <div aria-hidden="true" className="absolute inset-0 z-[4] bg-[linear-gradient(180deg,transparent_60%,rgb(7_6_11/0.55))]" />
          <span
            ref={ring}
            aria-hidden="true"
            className="pointer-events-none absolute z-[5] size-[260%] rounded-full opacity-0 shadow-[0_0_0_2px_rgb(236_226_255/0.9),0_0_40px_10px_rgb(140_92_255/0.55),inset_0_0_40px_6px_rgb(140_92_255/0.45)]"
            style={{ transform: "translate(-50%,-50%) scale(0)" }}
          />
        </div>
      </div>

      {/* the constellation and the words */}
      <div className="min-w-0 lg:order-1 lg:col-span-5">
        <div dir="ltr" className="relative mx-auto aspect-[92/83] w-full max-w-[460px]">
          <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <defs>
              <filter id="team-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>
            <path d={meshD} fill="none" stroke="rgb(200 168 255 / 0.18)" strokeWidth="2" pathLength={1} className="team-draw" style={{ "--draw-d": "700ms" } as CSSProperties} />
            <path d={pathD} fill="none" stroke="rgb(200 168 255 / 0.35)" strokeWidth="8" pathLength={1} filter="url(#team-glow)" className="team-draw" />
            <path d={pathD} fill="none" stroke="rgb(236 226 255 / 0.85)" strokeWidth="2.2" strokeLinejoin="round" pathLength={1} className="team-draw" />
            {/* light running along the outline */}
            <path d={pathD} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" pathLength={1} className="team-pulse" />
            {NODES.map((n, i) =>
              seats.includes(i) ? null : <circle key={i} cx={n[0] * 1000} cy={n[1] * 1000} r="5" fill="rgb(236 226 255 / 0.7)" className="team-twinkle" style={{ animationDelay: `${i * 0.37}s` }} />,
            )}
          </svg>
          {people.map((m, i) => {
            const node = seats[i];
            const side = LABEL[node];
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
                onClick={() => show.current?.go(i)}
                onFocus={() => show.current?.go(i)}
                onMouseEnter={() => {
                  if (!window.matchMedia("(hover: hover)").matches) return;
                  window.clearTimeout(hoverTimer.current);
                  hoverTimer.current = window.setTimeout(() => show.current?.go(i), 120);
                }}
                onMouseLeave={() => window.clearTimeout(hoverTimer.current)}
                className="group/star absolute z-20 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
                style={pct(NODES[node])}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-1.5 rounded-full border border-lav/60 transition-[scale,opacity] duration-500 ${on ? "scale-100 opacity-100 [animation:team-ring_2.4s_ease-out_infinite]" : "scale-50 opacity-0"}`}
                />
                <span
                  aria-hidden="true"
                  className={`block rounded-full bg-[#efe6ff] shadow-[0_0_10px_#c8a8ff,0_0_24px_rgb(200_168_255/0.6)] transition-[width,height,background-color] duration-500 ${on ? "size-4 bg-white" : "size-2.5 group-hover/star:size-3.5"}`}
                />
                <span
                  dir={rtl ? "rtl" : "ltr"}
                  className={`pointer-events-none absolute whitespace-nowrap text-[11px] transition-colors duration-300 sm:text-[13px] ${on ? "font-medium text-ink" : "text-dim group-hover/star:text-soft"} ${
                    side === "up" ? "bottom-full mb-0.5" : side === "down" ? "top-full mt-0.5" : side === "start" ? "right-full mr-1" : "left-full ml-1"
                  }`}
                >
                  {m.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 min-h-[13rem] text-center lg:mt-10 lg:text-start" aria-live="polite">
          <p dir="ltr" className={`font-display text-[13px] tracking-[0.16em] text-dim ${rtl ? "lg:text-right" : ""}`}>
            <span className="text-lav">{String(active + 1).padStart(2, "0")}</span> / {String(people.length).padStart(2, "0")}
          </p>
          <h3 key={`n${active}`} className="mt-3 font-display text-[clamp(32px,3.6vw,52px)] font-semibold leading-[1.12] tracking-[-0.025em]">
            {p.name.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top">
                <span className="team-word inline-block" style={{ animationDelay: `${150 + i * 70}ms` }}>
                  {w}
                </span>
                {i < p.name.split(" ").length - 1 ? " " : ""}
              </span>
            ))}
          </h3>
          <p ref={roleEl} className="mt-1 text-[15px] text-lav">
            {p.role}
          </p>
          <p key={`l${active}`} className={`team-fade mx-auto mt-4 max-w-[30em] lg:mx-0 ${p.quote ? "text-[clamp(17px,1.5vw,21px)] text-ink" : "text-muted"}`}>
            {p.quote ? `${labels.quoteOpen}${p.quote}${labels.quoteClose}` : p.line}
          </p>
        </div>
      </div>

      {/* the whole team for screen readers and search, regardless of which star is chosen */}
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
