"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";

import logo from "@/assets/brand/logo.png";
import { Button } from "@/components/ui/Button";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { site } from "@/lib/site";

/*
 * The home page opening, told in four scroll scenes inside one pinned stage:
 *   1. Ignition     stars rush past, the logo's star lights up and the mark resolves
 *   2. Orbits       the tools we build with orbit the logo in perspective
 *   3. Constellation the tools become stars that draw the A, one service per star
 *   4. Finale       the lines pull back into the star, the logo returns with the CTA
 * Everything is derived from one smoothed scroll progress value `p` (0–1).
 */

type Pt = { x: number; y: number };

const TOOLS = [
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

const RINGS = [
  { size: [0.82, 0.74], roll: -0.2, spin: 0.1 },
  { size: [1.12, 1.0], roll: 0.13, spin: -0.066 },
  { size: [1.44, 1.26], roll: -0.05, spin: 0.046 },
];

/** The A traced as stars, in units of the logo size, relative to the logo centre. */
const NODES: Pt[] = [
  { x: 0, y: -0.36 },
  { x: -0.1, y: -0.18 },
  { x: -0.2, y: 0.01 },
  { x: -0.34, y: 0.26 },
  { x: -0.19, y: 0.2 },
  { x: 0, y: -0.05 },
  { x: 0.19, y: 0.2 },
  { x: 0.34, y: 0.26 },
  { x: 0.2, y: 0.01 },
  { x: 0.1, y: -0.18 },
];
const NODE_FOR_TOOL = [1, 9, 2, 8, 5, 3, 7, 4, 6];
const LABELS = [
  { node: 1, key: "agents", side: -1 },
  { node: 2, key: "automation", side: -1 },
  { node: 3, key: "chatbots", side: -1 },
  { node: 9, key: "integrations", side: 1 },
  { node: 8, key: "web", side: 1 },
  { node: 7, key: "consulting", side: 1 },
] as const;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const sstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface HeroStoryProps {
  lang: Locale;
  hero: Dictionary["hero"];
  bookCall: string;
}

export function HeroStory({ lang, hero, bookCall }: HeroStoryProps) {
  const storyRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const igniteRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const meshRef = useRef<SVGPathElement>(null);
  const flareRef = useRef<SVGGElement>(null);
  const waveRef = useRef<SVGCircleElement>(null);
  const labelRefs = useRef<(SVGTextElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);

  const rtl = lang === "ar";

  useEffect(() => {
    const story = storyRef.current!;
    const stage = stageRef.current!;
    const back = backRef.current!;
    const front = frontRef.current!;
    const bctx = back.getContext("2d")!;
    const fctx = front.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const state = { p: 0, warp: reduced ? 0 : 1, ignite: reduced ? 1 : 0, reveal: reduced ? 1 : 0, mx: 0, my: 0, tmx: 0, tmy: 0 };
    let W = 0, H = 0, wide = true, L = 300, dpr = 1;
    let visible = true;

    // ---- starfield: points in a unit box flying towards the camera ----
    type Star = { x: number; y: number; z: number; px: number; py: number };
    let stars: Star[] = [];
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const makeStars = () => {
      const n = wide ? 420 : 200;
      stars = Array.from({ length: n }, () => ({ x: rnd() * 2 - 1, y: rnd() * 2 - 1, z: rnd(), px: NaN, py: NaN }));
    };

    const layout = () => {
      W = stage.clientWidth;
      H = stage.clientHeight;
      wide = W >= 1100;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const c of [back, front]) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      }
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Must match the CSS in the JSX below (--logo-size).
      L = wide ? Math.min(H * 0.34, 320) : Math.min(W * 0.58, H * 0.3);
      svgRef.current!.setAttribute("viewBox", `0 0 ${W} ${H}`);
      makeStars();
    };

    // ---- orbit geometry with perspective ----
    const project = (a: number, r: number, c: Pt, tilt: number, roll: number, persp: number) => {
      const x = Math.cos(a) * r;
      const y0 = Math.sin(a) * r;
      const z = y0 * Math.sin(tilt);
      const y = y0 * Math.cos(tilt);
      const k = persp / (persp - z);
      const cr = Math.cos(roll), sr = Math.sin(roll);
      const rx = (x * cr - y * sr) * k, ry = (x * sr + y * cr) * k;
      return { x: c.x + rx, y: c.y - ry, depth: z / r, k };
    };

    const drawRing = (c: Pt, r: number, tilt: number, roll: number, spin: number, persp: number, alpha: number, draw: number) => {
      if (alpha <= 0.001 || draw <= 0) return;
      const seg = 160;
      const end = Math.floor(seg * draw);
      let prev = project(spin, r, c, tilt, roll, persp);
      for (let i = 1; i <= end; i++) {
        const q = project(spin + (i / seg) * Math.PI * 2, r, c, tilt, roll, persp);
        const f = 0.14 + 0.86 * clamp((q.depth + 1) / 2);
        fctx.strokeStyle = `rgba(200,168,255,${(alpha * 0.6 * f).toFixed(3)})`;
        fctx.lineWidth = 1 * q.k;
        fctx.beginPath();
        fctx.moveTo(prev.x, prev.y);
        fctx.lineTo(q.x, q.y);
        fctx.stroke();
        if (i % 4 === 0) {
          fctx.fillStyle = `rgba(226,210,255,${(alpha * 0.75 * f).toFixed(3)})`;
          fctx.beginPath();
          fctx.arc(q.x, q.y, 1.3 * q.k, 0, 6.2832);
          fctx.fill();
        }
        prev = q;
      }
    };

    // ---- the frame ----
    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const t = now / 1000;
      const total = Math.max(1, story.offsetHeight - H);
      const rect = story.getBoundingClientRect();
      visible = rect.bottom > 0 && rect.top < H;
      const target = clamp(-rect.top / total);
      const prevP = state.p;
      state.p += (target - state.p) * (reduced ? 1 : 0.085);
      state.mx += (state.tmx - state.mx) * 0.05;
      state.my += (state.tmy - state.my) * 0.05;
      if (!visible) return;
      const p = state.p;
      const speed = Math.abs(state.p - prevP);

      const s1 = sstep(0.07, 0.25, p);
      const s2i = sstep(0.2, 0.36, p), s2o = sstep(0.52, 0.62, p);
      const s3i = sstep(0.52, 0.66, p), s3o = sstep(0.8, 0.88, p);
      const s4 = sstep(0.84, 0.96, p);
      const morph = ease(sstep(0.54, 0.7, p));
      const gather = ease(sstep(0.84, 0.93, p));

      // logo centre per scene (scene 1 must match the CSS anchor)
      const c1 = { x: W / 2, y: H * (wide ? 0.38 : 0.32) };
      const c2 = wide ? { x: W * (rtl ? 0.34 : 0.66), y: H * 0.5 } : { x: W / 2, y: H * 0.3 };
      const c4 = { x: W / 2, y: H * (wide ? 0.4 : 0.32) };
      const c = {
        x: lerp(lerp(c1.x, c2.x, ease(s1)), c4.x, ease(s4)) + state.mx * 10,
        y: lerp(lerp(c1.y, c2.y, ease(s1)), c4.y, ease(s4)) + state.my * 6,
      };

      // logo
      const logoEl = logoRef.current!;
      const logoScale = lerp(0.9, 1, state.reveal) * (1 + 0.06 * s4);
      logoEl.style.transform = `translate3d(${c.x - c1.x}px,${c.y - c1.y}px,0) scale(${logoScale})`;
      logoEl.style.opacity = String(state.reveal * lerp(1, 0.12, s3i * (1 - s4)));
      logoEl.style.filter = state.reveal < 1 ? `blur(${((1 - state.reveal) * 14).toFixed(1)}px)` : "";
      const ignite = igniteRef.current!;
      ignite.style.opacity = String(state.ignite * (1 - state.reveal * 0.85));
      ignite.style.transform = `translate(-50%,-50%) scale(${lerp(0.2, 1.4, state.ignite)})`;
      const glow = glowRef.current!;
      glow.style.transform = `translate3d(${c.x - c1.x}px,${c.y - c1.y}px,0)`;
      glow.style.opacity = String(Math.max(state.reveal * (1 - s3i * 0.6), s4));

      // stars
      bctx.clearRect(0, 0, W, H);
      const f = Math.min(W, H) * 0.55;
      const cx = W / 2 + state.mx * 18, cy = H / 2 + state.my * 12;
      const v = reduced ? 0 : 0.012 + state.warp * 0.9 + speed * 6;
      const dt = 1 / 60;
      for (const s of stars) {
        s.z -= v * dt;
        if (s.z <= 0.02) {
          s.x = rnd() * 2 - 1;
          s.y = rnd() * 2 - 1;
          s.z = 1;
          s.px = NaN;
        }
        const x = cx + (s.x / s.z) * f;
        const y = cy + (s.y / s.z) * f;
        const size = (1 - s.z) * (wide ? 1.8 : 1.4) + 0.2;
        const a = clamp((1 - s.z) * 1.3) * (reduced ? 0.8 : 0.55 + 0.45 * Math.sin(t * 2 + s.x * 40));
        if (x < -20 || x > W + 20 || y < -20 || y > H + 20) {
          s.z = 0;
          continue;
        }
        if (!Number.isNaN(s.px) && v > 0.08) {
          bctx.strokeStyle = `rgba(232,224,255,${a.toFixed(3)})`;
          bctx.lineWidth = size;
          bctx.beginPath();
          bctx.moveTo(s.px, s.py);
          bctx.lineTo(x, y);
          bctx.stroke();
        } else {
          bctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
          bctx.beginPath();
          bctx.arc(x, y, size * 0.6, 0, 6.2832);
          bctx.fill();
        }
        s.px = x;
        s.py = y;
      }

      // orbits
      fctx.clearRect(0, 0, W, H);
      const ringAlpha = s2i * (1 - s3i);
      const tilt = lerp(1.42, 1.12, ease(s2i)) + state.my * 0.1;
      const roll0 = (reduced ? 0 : t * 0.015) + state.mx * 0.08;
      const outer = L * RINGS[2].size[wide ? 0 : 1];
      const persp = outer * 3.2;
      const ringR = RINGS.map((ring) => L * ring.size[wide ? 0 : 1] * lerp(0.7, 1, ease(s2i)));
      const spins = RINGS.map((ring, k) => (reduced ? 0 : ring.spin * t) + k * 0.9);
      RINGS.forEach((ring, k) =>
        drawRing(c, ringR[k], tilt, ring.roll + roll0, spins[k], persp, ringAlpha, clamp(s2i * 1.25 - k * 0.12)),
      );

      // chips → constellation stars → gather into the guiding star
      const K = (wide ? 1.5 : 1.3) * L;
      const nodePt = (i: number) => ({ x: c.x + NODES[i].x * K, y: c.y + NODES[i].y * K });
      const apex = nodePt(0);
      const perRing = [0, 0, 0];
      const ringCount = [2, 3, 4];
      TOOLS.forEach((tool, i) => {
        const el = chipRefs.current[i];
        if (!el) return;
        const k = tool.ring;
        const a = spins[k] + (perRing[k]++ / ringCount[k]) * Math.PI * 2;
        const o = project(a, ringR[k], c, tilt, RINGS[k].roll + roll0, persp);
        const n = nodePt(NODE_FOR_TOOL[i]);
        let x = lerp(o.x, n.x, morph), y = lerp(o.y, n.y, morph);
        x = lerp(x, apex.x, gather);
        y = lerp(y, apex.y, gather);
        const depth01 = clamp((o.depth + 1) / 2);
        const sc = lerp(lerp(0.82, 1.08, depth01) * o.k, 1, morph);
        el.style.setProperty("--m", morph.toFixed(3));
        el.style.transform = `translate3d(${x - 14.5}px,${y - 16}px,0) scale(${sc.toFixed(3)})`;
        el.style.opacity = String(s2i * (1 - gather) * lerp(0.45 + 0.55 * depth01, 1, morph));
        el.style.zIndex = morph > 0.5 || o.depth > 0 ? "4" : "0";
      });

      // constellation
      const pts = NODES.map((_, i) => nodePt(i));
      const order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      const line = lineRef.current!, mesh = meshRef.current!;
      line.setAttribute("d", "M" + order.map((i) => `${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`).join(" L"));
      mesh.setAttribute(
        "d",
        `M${pts[1].x} ${pts[1].y} L${pts[9].x} ${pts[9].y} M${pts[2].x} ${pts[2].y} L${pts[5].x} ${pts[5].y} L${pts[8].x} ${pts[8].y}`,
      );
      const drawIn = sstep(0.62, 0.78, p);
      const retract = sstep(0.84, 0.92, p);
      line.style.strokeDashoffset = String(retract > 0 ? -retract : 1 - drawIn);
      line.style.opacity = String(1 - sstep(0.9, 0.95, p));
      mesh.style.strokeDashoffset = String(1 - sstep(0.7, 0.8, p));
      mesh.style.opacity = String(1 - retract);
      const labO = sstep(0.72, 0.8, p) * (1 - sstep(0.82, 0.86, p));
      LABELS.forEach((lab, i) => {
        const el = labelRefs.current[i];
        if (!el) return;
        const pt = pts[lab.node];
        el.setAttribute("x", (pt.x + lab.side * 18).toFixed(1));
        el.setAttribute("y", (pt.y + 5).toFixed(1));
        el.style.opacity = wide ? String(labO) : "0";
      });
      const flO = sstep(0.6, 0.7, p) * (1 - sstep(0.93, 0.98, p));
      const flash = 1 + 0.9 * Math.sin(Math.PI * sstep(0.88, 0.94, p));
      const pulse = reduced ? 1 : 1 + 0.12 * Math.sin(t * 2.2);
      flareRef.current!.setAttribute(
        "transform",
        `translate(${apex.x.toFixed(1)} ${apex.y.toFixed(1)}) scale(${((0.6 + 0.4 * flO) * pulse * flash).toFixed(3)}) rotate(${reduced ? 0 : (t * 8) % 360})`,
      );
      flareRef.current!.style.opacity = String(flO);
      const wave = sstep(0.89, 0.99, p);
      const waveEl = waveRef.current!;
      waveEl.setAttribute("cx", apex.x.toFixed(1));
      waveEl.setAttribute("cy", apex.y.toFixed(1));
      waveEl.setAttribute("r", (wave * Math.max(W, H) * 0.7).toFixed(1));
      waveEl.style.opacity = String(wave > 0 && wave < 1 ? (1 - wave) * 0.8 : 0);

      // copy
      const show = (el: HTMLElement | null, o: number, dy: number) => {
        if (!el) return;
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0,${dy}px,0)`;
        el.style.visibility = o < 0.02 ? "hidden" : "visible";
        el.style.pointerEvents = o < 0.5 ? "none" : "auto";
      };
      const [p1, p2, p3, p4] = panelRefs.current;
      show(p1, clamp(1 - s1 * 1.7) * state.reveal, -s1 * 50);
      show(p2, s2i * (1 - s2o), (1 - s2i) * 30 - s2o * 30);
      show(p3, s3i * (1 - s3o), (1 - s3i) * 30 - s3o * 30);
      show(p4, sstep(0.9, 0.98, p), (1 - sstep(0.9, 0.98, p)) * 30);
      if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - s1 * 4) * state.reveal);
    };

    // ---- intro: warp, ignition, reveal ----
    const intro = reduced
      ? null
      : gsap
          .timeline()
          .to(state, { warp: 0, duration: 2.2, ease: "power3.out" }, 0)
          .to(state, { ignite: 1, duration: 0.9, ease: "power2.out" }, 0.7)
          .to(state, { reveal: 1, duration: 1.4, ease: "expo.out" }, 1.1);

    const onMove = (e: PointerEvent) => {
      state.tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      state.tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (finePointer && !reduced) window.addEventListener("pointermove", onMove, { passive: true });
    const ro = new ResizeObserver(layout);
    ro.observe(stage);
    layout();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      intro?.kill();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [rtl]);

  const panelBase = "absolute z-[5] will-change-[transform,opacity]";
  const sidePanel = `${panelBase} inset-x-4 top-[58%] text-center min-[1100px]:top-1/2 min-[1100px]:w-[min(540px,38vw)] min-[1100px]:-translate-y-1/2 min-[1100px]:text-start min-[1100px]:start-[5vw] min-[1100px]:end-auto`;

  return (
    <section ref={storyRef} className="relative h-[520vh]" aria-label={hero.eyebrow}>
      <div
        ref={stageRef}
        className="sticky top-0 h-svh overflow-hidden [--logo-size:min(58vw,30vh)] [--logo-y:32%] min-[1100px]:[--logo-size:min(34vh,320px)] min-[1100px]:[--logo-y:38%]"
      >
        <canvas ref={backRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[var(--logo-y)] size-[calc(var(--logo-size)*2.8)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,77,255,.30)_0%,rgba(124,77,255,.09)_34%,transparent_64%)] opacity-0"
        />

        <div
          ref={igniteRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[calc(var(--logo-y)_-_var(--logo-size)*0.24)] z-[2] size-[calc(var(--logo-size)*0.9)] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,rgba(230,218,255,.55)_12%,rgba(200,168,255,.12)_34%,transparent_62%)] opacity-0"
        />

        <div
          ref={logoRef}
          data-intro
          className="absolute left-1/2 top-[var(--logo-y)] z-[1] size-[var(--logo-size)] -translate-x-1/2 -translate-y-1/2 will-change-[transform,opacity]"
        >
          <Image src={logo} alt="Afaq AI" fill priority sizes="(min-width: 1100px) 320px, 58vw" className="object-contain" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{
              maskImage: `url(${logo.src})`,
              WebkitMaskImage: `url(${logo.src})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          >
            <i className="animate-sweep absolute inset-y-0 w-[38%] [transform:translateX(-160%)_skewX(-18deg)] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent)]" />
          </div>
          <div
            aria-hidden="true"
            className="animate-glint pointer-events-none absolute left-1/2 top-[26%] size-[36%] bg-[radial-gradient(circle,rgba(255,255,255,.95)_0%,rgba(255,255,255,.22)_18%,transparent_55%)]"
          />
        </div>

        <canvas ref={frontRef} className="pointer-events-none absolute inset-0 z-[3] h-full w-full" aria-hidden="true" />

        {TOOLS.map((tool, i) => (
          <div
            key={tool.name}
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
            aria-hidden="true"
            dir="ltr"
            className="pointer-events-none absolute left-0 top-0 flex h-8 items-center gap-2 whitespace-nowrap rounded-pill border ps-[11px] pe-[13px] text-[13px] font-medium text-[#ece8f5] opacity-0 will-change-[transform,opacity] [--m:0] [background:rgba(18,14,30,calc(.86*(1_-_var(--m))))] [border-color:rgba(200,168,255,calc(.26*(1_-_var(--m))))]"
          >
            <span className="size-[7px] shrink-0 rounded-full bg-[#ede4ff] shadow-[0_0_10px_#c8a8ff,0_0_22px_rgba(200,168,255,.5)]" />
            <span className="[opacity:calc(1_-_var(--m)*1.6)]">{tool.name}</span>
          </div>
        ))}

        <svg ref={svgRef} className="pointer-events-none absolute inset-0 z-[4] h-full w-full overflow-visible" aria-hidden="true" direction="ltr">
          <defs>
            <radialGradient id="hero-flare">
              <stop offset="0" stopColor="#fff" stopOpacity="1" />
              <stop offset=".25" stopColor="#e6daff" stopOpacity=".5" />
              <stop offset="1" stopColor="#c8a8ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path ref={meshRef} pathLength={1} fill="none" stroke="rgba(200,168,255,.28)" strokeWidth={1} strokeDasharray={1} strokeDashoffset={1} />
          <path ref={lineRef} pathLength={1} fill="none" stroke="rgba(236,226,255,.9)" strokeWidth={1.4} strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1} />
          {LABELS.map((lab, i) => (
            <text
              key={lab.key}
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              textAnchor={lab.side < 0 ? "end" : "start"}
              className="fill-[#d3cde2] text-sm font-medium opacity-0"
            >
              {hero.constellation[lab.key]}
            </text>
          ))}
          <circle ref={waveRef} r={0} fill="none" stroke="rgba(226,210,255,.7)" strokeWidth={1.2} opacity={0} />
          <g ref={flareRef} opacity={0}>
            <circle r={48} fill="url(#hero-flare)" />
            <path d="M0 -42 L4 -4 L42 0 L4 4 L0 42 L-4 4 L-42 0 L-4 -4 Z" fill="#fff" />
            <path d="M0 -22 L2.5 -2.5 L22 0 L2.5 2.5 L0 22 L-2.5 2.5 L-22 0 L-2.5 -2.5 Z" fill="#fff" opacity={0.8} transform="rotate(45)" />
          </g>
        </svg>

        {/* Scene 1 */}
        <div
          ref={(el) => {
            panelRefs.current[0] = el;
          }}
          data-intro
          className={`${panelBase} inset-x-4 top-[calc(var(--logo-y)_+_var(--logo-size)*0.5_+_12px)] mx-auto max-w-[1000px] text-center`}
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-lav">{hero.eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(30px,3.6vw,54px)] font-medium leading-[1.08] tracking-[-0.04em]">{hero.title}</h1>
          <p className="mx-auto mt-4 hidden max-w-[36em] text-[clamp(16px,1.2vw,18px)] text-muted sm:block">{hero.lead}</p>
          <p className="mx-auto mt-3 max-w-[30em] text-muted sm:hidden">{hero.leadShort}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button href={site.bookingUrl} external arrow>
              {bookCall}
            </Button>
            <Button href={href(lang, "/services")} variant="ghost">
              {hero.secondary}
            </Button>
          </div>
        </div>

        {/* Scene 2 */}
        <div
          ref={(el) => {
            panelRefs.current[1] = el;
          }}
          className={`${sidePanel} invisible opacity-0`}
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-lav">{hero.stack.eyebrow}</p>
          <h2 className="mt-4 font-display text-[clamp(30px,4vw,60px)] font-medium leading-[1.05] tracking-[-0.04em]">
            {hero.stack.title} <span className="text-soft">{hero.stack.titleSoft}</span>
          </h2>
          <p className="mt-4 text-[clamp(15px,1.2vw,18px)] text-muted">{hero.stack.lead}</p>
        </div>

        {/* Scene 3 */}
        <div
          ref={(el) => {
            panelRefs.current[2] = el;
          }}
          className={`${sidePanel} invisible opacity-0`}
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-lav">{hero.services.eyebrow}</p>
          <h2 className="mt-4 font-display text-[clamp(30px,4vw,60px)] font-medium leading-[1.05] tracking-[-0.04em]">
            {hero.services.title} <span className="text-soft">{hero.services.titleSoft}</span>
          </h2>
          <p className="mt-4 text-[clamp(15px,1.2vw,18px)] text-muted">{hero.services.lead}</p>
        </div>

        {/* Scene 4 */}
        <div
          ref={(el) => {
            panelRefs.current[3] = el;
          }}
          className={`${panelBase} invisible inset-x-4 top-[calc(40%_+_var(--logo-size)*0.5_+_8px)] mx-auto max-w-[760px] text-center opacity-0 max-[1099px]:top-[calc(32%_+_var(--logo-size)*0.5_+_8px)]`}
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-lav">{hero.finale.eyebrow}</p>
          <h2 className="mt-4 font-display text-[clamp(30px,3.6vw,54px)] font-medium leading-[1.08] tracking-[-0.04em]">{hero.finale.title}</h2>
          <p className="mx-auto mt-4 max-w-[34em] text-muted">{hero.finale.lead}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button href={site.bookingUrl} external arrow>
              {bookCall}
            </Button>
            <Button href={href(lang, "/contact")} variant="ghost">
              {hero.finale.secondary}
            </Button>
          </div>
        </div>

        <div
          ref={hintRef}
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 z-[5] hidden -translate-x-1/2 flex-col items-center gap-2.5 text-[11px] uppercase tracking-[0.26em] text-dim opacity-0 min-[1100px]:flex"
        >
          {hero.scroll}
          <span className="animate-scroll-hint h-8 w-px origin-top bg-gradient-to-b from-lav to-transparent" />
        </div>
      </div>
    </section>
  );
}
