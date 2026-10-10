import gsap from "gsap";

import { LABELS, NODES, NODE_FOR_TOOL, PATH, drawMesh, drawOutline, type Pt } from "./constellation";
import { makeGlowSprite, stamp } from "./glow";
import { BODIES, MAX_A, drawOrbit, drawTrail, eccentricAnomaly, meanAnomaly, projectAt, type Camera } from "./orbits";
import { Starfield } from "./starfield";
import {
  T,
  at,
  bell,
  clamp,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  lerp,
  sceneIndex,
  sstep,
} from "./timeline";

/*
 * The hero's render loop. React renders the DOM once; from then on this engine is the
 * only thing that writes styles to it, every frame, from two inputs: the smoothed scroll
 * progress `p` and a few intro values animated by GSAP on load.
 */

export interface HeroPanel {
  root: HTMLElement;
  /** Heading words, revealed one after another. */
  words: HTMLElement[];
  /** Eyebrow, lead and buttons, revealed as blocks. First item leads, the rest follow the heading. */
  rest: HTMLElement[];
}

export interface HeroElements {
  story: HTMLElement;
  stage: HTMLElement;
  back: HTMLCanvasElement;
  front: HTMLCanvasElement;
  logo: HTMLElement;
  glow: HTMLElement;
  ignite: HTMLElement;
  flash: HTMLElement;
  chips: HTMLElement[];
  chipPills: HTMLElement[];
  chipLabels: HTMLElement[];
  chipStars: HTMLElement[];
  labels: HTMLElement[];
  flare: SVGGElement;
  waves: SVGCircleElement[];
  svg: SVGSVGElement;
  panels: HeroPanel[];
  hint: HTMLElement | null;
  dots: HTMLElement[];
}

/** Where the logo's own star sits, in units of logo size from its centre. */
const LOGO_STAR_Y = -0.24;

export function startHero(el: HeroElements, { rtl }: { rtl: boolean }) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const bctx = el.back.getContext("2d")!;
  const fctx = el.front.getContext("2d")!;
  const lav = makeGlowSprite([200, 168, 255]);
  const white = makeGlowSprite([236, 228, 255]);
  const stars = new Starfield();

  const state = {
    p: 0,
    warp: reduced ? 0 : 1,
    ignite: reduced ? 1 : 0,
    reveal: reduced ? 1 : 0,
    introText: reduced ? 1 : 0,
    mx: 0,
    my: 0,
    tmx: 0,
    tmy: 0,
  };

  let W = 0;
  let H = 0;
  let wide = true;
  let L = 300;
  let storyTop = 0;
  let scrollable = 1;
  let lastScene = -1;

  const layout = () => {
    W = el.stage.clientWidth;
    H = el.stage.clientHeight;
    wide = W >= 1100;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (const c of [el.back, el.front]) {
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
    }
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Must match --logo-size in HeroStory.tsx.
    L = wide ? Math.min(H * 0.32, 300) : Math.min(W * 0.58, H * 0.28);
    storyTop = el.story.getBoundingClientRect().top + window.scrollY;
    scrollable = Math.max(1, el.story.offsetHeight - H);
    el.svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    stars.resize(wide ? 620 : 260);
  };

  /** Scroll-scrubbed copy: words rise out of a blur one after another, and leave the same way. */
  const drivePanel = (panel: HeroPanel | undefined, inP: number, outP: number) => {
    if (!panel) return;
    const vis = inP * (1 - outP);
    panel.root.style.visibility = vis < 0.01 ? "hidden" : "visible";
    panel.root.style.pointerEvents = vis > 0.6 ? "auto" : "none";
    if (vis < 0.01) return;

    const n = panel.words.length;
    panel.words.forEach((w, i) => {
      const lag = 0.08 + (n > 1 ? (i / (n - 1)) * 0.45 : 0);
      const wi = easeOutCubic(clamp((inP - lag) / 0.45));
      const wo = easeInCubic(clamp((outP - lag * 0.5) / 0.5));
      const o = wi * (1 - wo);
      w.style.opacity = o.toFixed(3);
      w.style.transform = `translate3d(0,${((1 - wi) * 26 - wo * 18).toFixed(1)}px,0)`;
      w.style.filter = wide && o < 0.995 ? `blur(${((1 - wi) * 8 + wo * 6).toFixed(1)}px)` : "";
    });

    panel.rest.forEach((r, j) => {
      const lag = j === 0 ? 0 : 0.36 + (j - 1) * 0.12;
      const ri = easeOutCubic(clamp((inP - lag) / 0.45));
      const ro = easeInCubic(clamp(outP / 0.6));
      r.style.opacity = (ri * (1 - ro)).toFixed(3);
      r.style.transform = `translate3d(0,${((1 - ri) * 16 - ro * 12).toFixed(1)}px,0)`;
    });
  };

  let raf = 0;
  let last = performance.now();

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    const t = now / 1000;

    // ---- scroll progress: eased for small steps, snapped for big jumps (anchors, End key) ----
    const target = clamp((window.scrollY - storyTop) / scrollable);
    state.p =
      reduced || Math.abs(target - state.p) > 0.2 ? target : state.p + (target - state.p) * (1 - Math.exp(-dt * 5.5));
    const p = state.p;
    state.mx += (state.tmx - state.mx) * 0.06;
    state.my += (state.tmy - state.my) * 0.06;
    if (window.scrollY > storyTop + scrollable + H) return; // hero is off screen

    // ---- where the system (logo + orbits + constellation) sits ----
    const c1 = { x: W / 2, y: H * (wide ? 0.36 : 0.3) }; // must match --logo-y
    // Beside the text column, inside the same 1440px frame as the navbar (56px gutters).
    const edge = Math.max(56, (W - 1440) / 2 + 56);
    const span = W - 2 * edge;
    const c2 = wide ? { x: rtl ? edge + span * 0.3 : W - edge - span * 0.3, y: H * 0.52 } : c1;
    // the logo comes home to the upper part of the screen; the work section rises beneath it
    const c4 = { x: W / 2, y: H * (wide ? 0.33 : 0.28) };
    const move = easeInOutCubic(at(T.logoToSide, p));
    const home = easeInOutCubic(at(T.logoCenter, p));
    const sys = lerp(lerp(1, wide ? 0.86 : 0.94, move), 1, home);
    const cx = lerp(lerp(c1.x, c2.x, move), c4.x, home) + state.mx * 10;
    const cy = lerp(lerp(c1.y, c2.y, move), c4.y, home) + state.my * 6;
    const Ls = L * sys;

    // ---- logo: resolves on load, steps back for the constellation, returns for the finale ----
    const ghost = at(T.logoGhost, p);
    const ret = at(T.logoReturn, p);
    const reveal = state.reveal;
    const shift = `translate3d(${(cx - c1.x).toFixed(1)}px,${(cy - c1.y).toFixed(1)}px,0)`;
    const blur = (1 - reveal) * 16 + ghost * (1 - ret) * 10;
    el.logo.style.opacity = clamp(reveal * (1 - ghost) + ret).toFixed(3);
    el.logo.style.transform = `${shift} scale(${(sys * lerp(0.88, 1, easeOutCubic(reveal))).toFixed(4)})`;
    el.logo.style.filter = blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : "none";
    el.glow.style.opacity = clamp(reveal * (1 - 0.65 * ghost) + ret * 0.65).toFixed(3);
    el.glow.style.transform = `${shift} scale(${sys.toFixed(4)})`;
    el.ignite.style.opacity = (state.ignite * (1 - reveal) * (1 - move)).toFixed(3);
    el.ignite.style.transform = `translate(-50%,-50%) scale(${lerp(0.2, 1.6, state.ignite).toFixed(3)})`;

    // ---- starfield: a slow drift towards the viewer; the warp only plays on load ----
    const constel = at([0.44, 0.5], p) * (1 - at(T.retract, p));
    const speed = reduced ? 0 : 0.035 + state.warp * 1.9;
    bctx.globalCompositeOperation = "source-over";
    fctx.globalCompositeOperation = "source-over";
    bctx.clearRect(0, 0, W, H);
    fctx.clearRect(0, 0, W, H);
    const vx = lerp(W / 2, cx, 0.35) + state.mx * 18;
    const vy = lerp(H * 0.45, cy, 0.35) + state.my * 12;
    stars.draw(bctx, W, H, vx, vy, t, dt, speed, 1 - 0.35 * constel, white);

    // ---- orbits: a 3D planetary system; the camera rises and turns as the scene scrolls by ----
    bctx.globalCompositeOperation = "lighter";
    fctx.globalCompositeOperation = "lighter";
    const open = easeOutCubic(at(T.ringsOpen, p));
    const out = at(T.ringsOut, p);
    const ringAlpha = open * (1 - out);
    const fit = wide ? 1 : Math.min(1, (W / 2 - 26) / (Ls * MAX_A));
    const D2R = Math.PI / 180;
    const orbitScene = at([0.1, 0.4], p);
    const cam: Camera = {
      cx,
      cy,
      scale: Ls * fit,
      elev: (lerp(3, wide ? 22 : 30, open) + out * 12 + state.my * 3) * D2R,
      azim: (lerp(-20, 16, orbitScene) + state.mx * 5) * D2R,
      dist: Ls * fit * MAX_A * 4.5,
    };
    const radiusScale = lerp(0.82, 1, open) * lerp(1, 1.12, out);
    // scrolling through the scene also moves time forward a little
    const tt = reduced ? 0 : t + at([0.08, 0.5], p) * 16;
    const anomalies = BODIES.map((b) => eccentricAnomaly(meanAnomaly(b, tt), b.e));
    if (ringAlpha > 0.004) {
      BODIES.forEach((b, j) => {
        if (!wide && !b.phone) return;
        const to = clamp(open * 1.35 - b.ring * 0.14);
        const from = clamp(out * 1.3 - b.ring * 0.1);
        // draw each shared orbit once, from its first body
        if (BODIES.findIndex((o) => o.ring === b.ring) === j) drawOrbit(bctx, fctx, b, cam, ringAlpha, from, to, wide ? 160 : 100, radiusScale);
        drawTrail(bctx, fctx, b, anomalies[j], cam, ringAlpha * clamp(to * 1.5 - 0.4), radiusScale, lav);
      });
    }

    // ---- constellation geometry; in the finale the A collapses onto the logo's own star ----
    const K = (wide ? 1.5 : 1.3) * Ls;
    const conv = at(T.converge, p);
    const convAll = easeInOutCubic(conv);
    const logoStar = { x: cx, y: cy + LOGO_STAR_Y * Ls };
    const apex = {
      x: lerp(cx + NODES[0].x * K, logoStar.x, convAll),
      y: lerp(cy + NODES[0].y * K, logoStar.y, convAll),
    };
    const pts: Pt[] = NODES.map((n, i) => (i === 0 ? apex : { x: cx + n.x * K, y: cy + n.y * K }));
    const retract = at(T.retract, p);
    const lit = LABELS.map((_, i) => {
      const a = T.starsLight[0] + i * 0.022;
      return at([a, a + 0.04], p) * (1 - retract);
    });
    const litOfNode = (node: number) => {
      const i = LABELS.findIndex((l) => l.node === node);
      return i < 0 ? 0 : lit[i];
    };

    // ---- tools: planets on their orbits → stars of the A → gathered into the guiding star ----
    const chipsIn = at(T.chipsIn, p);
    const flyP = at(T.chipsFly, p);
    const labelWants: { j: number; x: number; y: number; o: number; depth: number }[] = [];
    BODIES.forEach((b, j) => {
      const chip = el.chips[j];
      if (!chip) return;
      const shown = wide || b.phone;
      const o = projectAt(b, anomalies[j], cam, radiusScale);
      const f01 = clamp(0.5 + o.depth / 2.4);
      const appearRaw = clamp((chipsIn - j * 0.05) / 0.5);
      const appear = easeOutBack(appearRaw);
      const fly = easeInOutCubic(clamp((flyP - j * 0.04) / 0.62));
      const node = pts[NODE_FOR_TOOL[j]];
      const bend = (j % 2 ? 1 : -1) * 0.3;
      const ctrl = {
        x: (o.x + node.x) / 2 - (node.y - o.y) * bend,
        y: (o.y + node.y) / 2 + (node.x - o.x) * bend,
      };
      const iu = 1 - fly;
      let x = iu * iu * o.x + 2 * iu * fly * ctrl.x + fly * fly * node.x;
      let y = iu * iu * o.y + 2 * iu * fly * ctrl.y + fly * fly * node.y;
      const cj = easeInCubic(clamp((conv - (j % 5) * 0.04) / 0.75));
      const fromX = x;
      const fromY = y;
      x = lerp(x, apex.x, cj);
      y = lerp(y, apex.y, cj);
      if (cj > 0.02 && cj < 0.98) {
        // light trail back towards where the star came from
        fctx.strokeStyle = `rgba(230,220,255,${((1 - cj) * 0.7).toFixed(3)})`;
        fctx.lineWidth = 1.4;
        fctx.beginPath();
        fctx.moveTo(x, y);
        fctx.lineTo(lerp(x, fromX, 0.45), lerp(y, fromY, 0.45));
        fctx.stroke();
      }
      const glowUp = litOfNode(NODE_FOR_TOOL[j]);
      if (glowUp > 0.01) stamp(fctx, lav, x, y, 14 + 12 * glowUp, glowUp * 0.8);

      // perspective size, clamped so near planets never balloon
      const size = clamp(o.k, 0.8, 1.2) * (wide ? 1 : 0.86);
      const scale = lerp(size * Math.max(0.001, appear), 1 + 0.45 * glowUp, fly) * (1 - 0.5 * cj);
      // far side: dimmer and slightly out of focus; phones only keep the near side
      const farFade = wide ? 0.45 + 0.55 * f01 : clamp((f01 - 0.3) * 2.4);
      const planetVisible = shown ? 1 : fly;
      const opacity = clamp(appearRaw * 3) * lerp(farFade, 1, fly) * (1 - sstep(0.75, 1, cj)) * planetVisible;
      const defocus = (1 - fly) * clamp(-o.depth) * 1.2;

      const pill = el.chipPills[j];
      if (pill) {
        pill.style.opacity = (1 - fly).toFixed(3);
        pill.style.visibility = fly > 0.99 ? "hidden" : "visible";
      }
      labelWants.push({ j, x, y, o: clamp(1 - fly * 1.8) * clamp((o.depth - 0.1) * 2.5) * (shown ? 1 : 0), depth: o.depth });
      const star = el.chipStars[j];
      if (star) star.style.opacity = fly.toFixed(3);
      chip.style.setProperty("--lit", glowUp.toFixed(3));
      chip.style.transform = `translate3d(${(x - 17).toFixed(1)}px,${(y - 17).toFixed(1)}px,0) scale(${scale.toFixed(3)})`;
      chip.style.opacity = opacity.toFixed(3);
      chip.style.zIndex = fly > 0.5 || o.depth > 0 ? "6" : "2";
      chip.style.filter = wide && defocus > 0.05 ? `blur(${defocus.toFixed(2)}px)` : "none";
    });

    // Names only for near planets, and never on top of another name: nearest wins.
    const kept: { x: number; y: number }[] = [];
    labelWants
      .sort((a, b) => b.depth - a.depth)
      .forEach((w) => {
        const free = kept.every((k) => Math.abs(k.x - w.x) > 78 || Math.abs(k.y - w.y) > 26);
        const o = free ? w.o : 0;
        if (o > 0.05) kept.push({ x: w.x, y: w.y });
        const label = el.chipLabels[w.j];
        if (label) label.style.opacity = o.toFixed(3);
      });

    // ---- constellation lines, labels, the guiding star, flash and light waves ----
    drawMesh(fctx, pts, at([0.54, 0.62], p) * (1 - retract));
    drawOutline(fctx, PATH.map((i) => pts[i]), retract, at(T.linesDraw, p), 1 - at([0.84, 0.88], p), t, lav);
    fctx.globalCompositeOperation = "source-over";

    LABELS.forEach((lab, i) => {
      const e = el.labels[i];
      if (!e) return;
      const q = pts[lab.node];
      const o = wide ? lit[i] : 0;
      e.style.opacity = o.toFixed(3);
      e.style.transform = `translate3d(${q.x.toFixed(1)}px,${q.y.toFixed(1)}px,0) translate(${
        lab.side < 0 ? "calc(-100% - 22px)" : "22px"
      },-50%) translateX(${((1 - o) * 10 * lab.side).toFixed(1)}px)`;
    });

    const flareO = at([0.44, 0.5], p) * (1 - at([0.86, 0.92], p));
    const flash = bell(T.flash[0], T.flash[1], p);
    const pulse = reduced ? 1 : 1 + 0.1 * Math.sin(t * 2.2);
    el.flare.setAttribute(
      "transform",
      `translate(${apex.x.toFixed(1)} ${apex.y.toFixed(1)}) scale(${((0.55 + 0.45 * flareO) * pulse * (1 + 1.1 * flash)).toFixed(3)}) rotate(${
        reduced ? 0 : ((t * 6) % 360).toFixed(1)
      })`,
    );
    el.flare.style.opacity = flareO.toFixed(3);
    el.flash.style.opacity = (flash * 0.8).toFixed(3);
    el.flash.style.transform = `translate3d(${apex.x.toFixed(1)}px,${apex.y.toFixed(1)}px,0) translate(-50%,-50%) scale(${(0.6 + flash * 0.6).toFixed(3)})`;
    [T.wave, T.wave2].forEach((w, i) => {
      const c = el.waves[i];
      if (!c) return;
      const k = at(w, p);
      c.setAttribute("cx", apex.x.toFixed(1));
      c.setAttribute("cy", apex.y.toFixed(1));
      c.setAttribute("r", (easeOutCubic(k) * Math.max(W, H) * 0.75).toFixed(1));
      c.style.opacity = k > 0 && k < 1 ? ((1 - k) * (i ? 0.45 : 0.75)).toFixed(3) : "0";
    });

    // ---- copy ----
    const [p1, p2, p3, p4] = el.panels;
    drivePanel(p1, state.introText, at(T.introOut, p));
    drivePanel(p2, at(T.stackIn, p), at(T.stackOut, p));
    drivePanel(p3, at(T.servicesIn, p), at(T.servicesOut, p));
    drivePanel(p4, at(T.finaleIn, p), 0);
    if (el.hint) el.hint.style.opacity = (state.introText * (1 - at([0.005, 0.04], p))).toFixed(3);
    const scene = sceneIndex(p);
    if (scene !== lastScene) {
      el.dots.forEach((d, i) => d.toggleAttribute("data-active", i === scene));
      lastScene = scene;
    }
  };

  // ---- intro, every load: warp in, the star ignites, the mark resolves, the words rise ----
  const intro = reduced
    ? null
    : gsap
        .timeline()
        .to(state, { warp: 0, duration: 2.2, ease: "power3.out" }, 0)
        .to(state, { ignite: 1, duration: 0.55, ease: "power2.out" }, 0.8)
        .to(state, { reveal: 1, duration: 1.15, ease: "expo.out" }, 1.1)
        .to(state, { introText: 1, duration: 1.2, ease: "power1.out" }, 1.35);

  const onMove = (e: PointerEvent) => {
    state.tmx = (e.clientX / window.innerWidth - 0.5) * 2;
    state.tmy = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  if (finePointer && !reduced) window.addEventListener("pointermove", onMove, { passive: true });
  const ro = new ResizeObserver(layout);
  ro.observe(el.stage);

  layout();
  frame(performance.now());
  // The first frame has written every inline style, so the CSS pre-hide can go.
  el.stage.querySelectorAll("[data-intro]").forEach((n) => n.removeAttribute("data-intro"));

  return () => {
    cancelAnimationFrame(raf);
    intro?.kill();
    gsap.killTweensOf(state);
    ro.disconnect();
    window.removeEventListener("pointermove", onMove);
  };
}

