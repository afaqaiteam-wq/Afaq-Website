"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";

import type { Person } from "@/content/about";

/*
 * The team as a star map. The A of the logo hangs in 3D among a cloud of faint stars: it
 * assembles out of the dark when it comes into view, sways slowly and turns toward the
 * pointer. Each person is one of its stars. Choosing a star changes the portrait with a
 * liquid WebGL dissolve (a violet edge of light runs through the image); the name rises
 * word by word and the role decodes into place.
 */

// The logo's A in logo units, given a little depth so it reads as a figure in space.
const NODES: readonly (readonly [number, number, number])[] = [
  [0, -0.36, 0],
  [-0.1, -0.18, 0.04],
  [-0.2, 0.01, -0.05],
  [-0.34, 0.26, 0.06],
  [-0.19, 0.2, -0.07],
  [0, -0.05, 0.1],
  [0.19, 0.2, -0.04],
  [0.34, 0.26, 0.05],
  [0.2, 0.01, -0.06],
  [0.1, -0.18, 0.03],
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

const GLYPHS = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي0123456789";
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
  const ring = { t0: 0 };

  function project(x: number, y: number, z: number, W: number, H: number, S: number) {
    const cy = Math.cos(view.yaw), sy = Math.sin(view.yaw);
    const cp = Math.cos(view.pitch), sp = Math.sin(view.pitch);
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
    const sway = reduced ? 0 : Math.sin(t * 0.22) * 0.2;
    const nod = reduced ? 0 : Math.sin(t * 0.17) * 0.06;
    view.yaw += (sway + view.ty - view.yaw) * 0.05;
    view.pitch += (nod + view.tp - view.pitch) * 0.05;

    const asm = shownAt < 0 ? 0 : reduced ? 1 : (now - shownAt) / 1000 / 1.9;
    const prog = NODES.map((_, i) => ease(clamp((asm - delays[i]) / 0.62)));
    const pos = NODES.map((n, i) => {
      const k = prog[i];
      const s = starts[i];
      return project(s[0] + (n[0] - s[0]) * k, s[1] + (n[1] - s[1]) * k, s[2] + (n[2] - s[2]) * k, W, H, S);
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

/* ───────────── the portrait: a liquid WebGL dissolve between photos ───────────── */

const VERT = `attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}`;
const FRAG = `precision highp float;varying vec2 v;uniform sampler2D u0,u1;uniform vec2 res,s0,s1;uniform float p,t,z;uniform vec2 m;
float h(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}
float no(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fb(vec2 q){float a=.5,r=0.;for(int i=0;i<5;i++){r+=a*no(q);q*=2.03;a*=.5;}return r;}
vec2 cov(vec2 uv,vec2 s){float rs=res.x/res.y,ri=s.x/s.y;vec2 k=rs<ri?vec2(rs/ri,1.):vec2(1.,ri/rs);vec2 o=vec2((1.-k.x)*.5,(1.-k.y)*.76);return clamp(uv*k+o,0.,1.);}
void main(){vec2 uv=v;vec2 c=(uv-.5)*(1.-.04*z)+.5+m*.01;
  float n=fb(uv*2.6+vec2(0.,t*.05));
  float d=n*.62+uv.y*.38;float th=p*1.32-.16;
  float w=1.-smoothstep(th-.05,th+.05,d);
  vec2 dp=vec2(n-.5)*.22;
  vec4 a=texture2D(u0,cov(c+dp*p,s0));
  float sh=.006*(1.-p);
  vec2 c1=c-dp*(1.-p);
  vec3 b=vec3(texture2D(u1,cov(c1-vec2(sh,0.),s1)).r,texture2D(u1,cov(c1,s1)).g,texture2D(u1,cov(c1+vec2(sh,0.),s1)).b);
  float e=clamp(1.-abs(d-th)/.06,0.,1.)*step(.001,p)*step(p,.999);
  vec3 col=mix(a.rgb,b,w)+vec3(.62,.42,1.)*pow(e,2.2)*1.35;
  gl_FragColor=vec4(col,1.);}`;

function createPortrait(canvas: HTMLCanvasElement, imgs: HTMLImageElement[], onReady: () => void) {
  const gl = canvas.getContext("webgl", { antialias: true });
  if (!gl) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const al = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(al);
  gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
  const U: Record<string, WebGLUniformLocation | null> = {};
  ["u0", "u1", "res", "s0", "s1", "p", "t", "z", "m"].forEach((k) => (U[k] = gl.getUniformLocation(prog, k)));
  gl.uniform1i(U.u0, 0);
  gl.uniform1i(U.u1, 1);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tex: (WebGLTexture | null)[] = imgs.map(() => null);
  const upload = (i: number) => {
    const im = imgs[i];
    if (!im.complete || !im.naturalWidth) return false;
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    tex[i] = t;
    return true;
  };

  let cur = 0, nxt = 0, p = 0, z = 0, t0 = 0, zt0 = 0, raf = 0, running = false;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let pending: number | null = null;

  const size = () => {
    const r = canvas.getBoundingClientRect();
    const d = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(r.width * d);
    canvas.height = Math.round(r.height * d);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  const draw = (now: number) => {
    if (!tex[cur] || !tex[nxt]) return;
    if (t0) {
      p = clamp((now - t0) / 1500);
      if (p >= 1) {
        cur = nxt;
        p = 0;
        t0 = 0;
        zt0 = now;
        if (pending != null) {
          const q = pending;
          pending = null;
          go(q);
        }
      }
    }
    z = reduced ? 0 : clamp((now - zt0) / 8000);
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    gl.uniform2f(U.res, canvas.width, canvas.height);
    gl.uniform2f(U.s0, imgs[cur].naturalWidth, imgs[cur].naturalHeight);
    gl.uniform2f(U.s1, imgs[nxt].naturalWidth, imgs[nxt].naturalHeight);
    gl.uniform1f(U.p, ease(p));
    gl.uniform1f(U.t, now / 1000);
    gl.uniform1f(U.z, ease(z));
    gl.uniform2f(U.m, mouse.x, mouse.y);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex[cur]);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, tex[nxt]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  const loop = (now: number) => {
    draw(now);
    if (running) raf = requestAnimationFrame(loop);
  };
  function go(k: number) {
    if (!tex[k] && !upload(k)) return false;
    if (t0) {
      pending = k;
      return true;
    }
    if (k === cur) return true;
    nxt = k;
    if (reduced) {
      cur = k;
      draw(performance.now());
      return true;
    }
    t0 = performance.now();
    return true;
  }

  // textures as the photos arrive; the canvas takes over once the first one is in
  let ready = false;
  const tryAll = () => {
    imgs.forEach((_, i) => {
      if (!tex[i]) upload(i);
    });
    if (!ready && tex[0]) {
      ready = true;
      size();
      draw(performance.now());
      onReady();
    }
  };
  imgs.forEach((im) => im.addEventListener("load", tryAll));
  tryAll();
  const ro = new ResizeObserver(() => {
    if (ready) {
      size();
      draw(performance.now());
    }
  });
  ro.observe(canvas);

  return {
    go,
    pointer(x: number, y: number) {
      mouse.tx = x;
      mouse.ty = y;
    },
    start() {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      imgs.forEach((im) => im.removeEventListener("load", tryAll));
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

/* ───────────── the component ───────────── */

export function TeamConstellation({ people, lang, labels }: { people: Person[]; lang: string; labels: { quoteOpen: string; quoteClose: string } }) {
  const rtl = lang === "ar";
  const seats = rtl ? SEATS_RTL : SEATS_LTR;
  const sep = rtl ? "، " : ", ";
  const [active, setActive] = useState(0);
  const [glReady, setGlReady] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const skyBox = useRef<HTMLDivElement>(null);
  const skyCanvas = useRef<HTMLCanvasElement>(null);
  const stars = useRef<(HTMLButtonElement | null)[]>([]);
  const frameEl = useRef<HTMLDivElement>(null);
  const glCanvas = useRef<HTMLCanvasElement>(null);
  const roleEl = useRef<HTMLParagraphElement>(null);
  const sky = useRef<ReturnType<typeof createSky> | null>(null);
  const portrait = useRef<ReturnType<typeof createPortrait>>(null);
  const hoverTimer = useRef(0);

  const choose = (k: number) => {
    setActive(k);
    sky.current?.setActive(k);
    portrait.current?.go(k);
  };

  useEffect(() => {
    const seatsNow = lang === "ar" ? SEATS_RTL : SEATS_LTR;
    sky.current = createSky(skyBox.current!, skyCanvas.current!, stars.current, seatsNow);
    const imgs = [...frameEl.current!.querySelectorAll<HTMLImageElement>("img[data-face]")];
    portrait.current = createPortrait(glCanvas.current!, imgs, () => setGlReady(true));

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          sky.current?.start();
          portrait.current?.start();
        } else {
          sky.current?.stop();
          portrait.current?.stop();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(stage.current!);
    return () => {
      io.disconnect();
      sky.current?.destroy();
      portrait.current?.destroy();
    };
  }, [lang]);

  // the role decodes into place, like a model writing it
  useEffect(() => {
    const el = roleEl.current;
    if (!el) return;
    const text = people[active].role;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

  const p = people[active];
  const words = p.name.split(" ");

  return (
    <div ref={stage} className="relative mt-14 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:items-center lg:gap-12">
      {/* the portrait, leaning gently toward the pointer */}
      <div className="[perspective:1400px] lg:order-2 lg:col-span-7">
        <div
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            e.currentTarget.style.transform = `rotateY(${(x * 8).toFixed(2)}deg) rotateX(${(-y * 6).toFixed(2)}deg)`;
            e.currentTarget.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
            e.currentTarget.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
            portrait.current?.pointer(x, -y);
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.transform = "";
            portrait.current?.pointer(0, 0);
          }}
          className="relative mx-auto w-full max-w-[520px] transition-transform duration-700 ease-out motion-reduce:transition-none"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-y-10 inset-x-0 -z-10 rounded-[60px] sm:-inset-x-10 bg-[radial-gradient(60%_55%_at_50%_60%,rgb(124_77_255/0.42),transparent_72%)] blur-2xl"
          />
          <div ref={frameEl} className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-lav/25 bg-surface">
            {people.map((m, i) => (
              <div key={m.name} className={`absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}>
                <Image
                  data-face=""
                  src={m.photo}
                  alt={m.name}
                  fill
                  priority={i === 0}
                  loading={i === 0 ? undefined : "eager"}
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover object-[50%_24%]"
                />
              </div>
            ))}
            <canvas
              ref={glCanvas}
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${glReady ? "opacity-100" : "opacity-0"}`}
            />
            {/* a soft glare that follows the pointer, and a dusk at the foot of the photo */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(420px_circle_at_var(--gx,50%)_var(--gy,30%),rgb(255_255_255/0.1),transparent_60%)] mix-blend-screen"
            />
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_62%,rgb(7_6_11/0.5))]" />
          </div>
        </div>
      </div>

      {/* the star map and the words */}
      <div className="min-w-0 lg:order-1 lg:col-span-5">
        <div ref={skyBox} dir="ltr" className="relative mx-auto aspect-square w-full max-w-[480px] touch-pan-y overflow-hidden">
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
                onClick={() => choose(i)}
                onFocus={() => choose(i)}
                onMouseEnter={() => {
                  if (!window.matchMedia("(hover: hover)").matches) return;
                  window.clearTimeout(hoverTimer.current);
                  hoverTimer.current = window.setTimeout(() => choose(i), 140);
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

        <div className="mt-6 min-h-[13rem] text-center lg:mt-8 lg:text-start" aria-live="polite">
          <p dir="ltr" className={`font-display text-[13px] tracking-[0.16em] text-dim ${rtl ? "lg:text-right" : ""}`}>
            <span className="text-lav">{String(active + 1).padStart(2, "0")}</span> / {String(people.length).padStart(2, "0")}
          </p>
          <h3 key={`n${active}`} className="mt-3 font-display text-[clamp(32px,3.6vw,52px)] font-semibold leading-[1.12] tracking-[-0.025em]">
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
      </div>

      {/* the whole team for screen readers and search, whichever star is chosen */}
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
