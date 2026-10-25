"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import still from "@/assets/marid/orb-still.webp";
import smoke from "@/assets/marid/smoke.webp";
import { ORB_FRAGMENT, ORB_VERTEX } from "@/components/marid/orb-shader";

/*
 * Marid as he looks in the app: the app's own orb shader (see orb-shader.ts) drawn in WebGL, with the
 * same state machine as the app's preview (tools/orb/preview.py): phases cross-fade, a voice level
 * while he listens or speaks, blinks, and a gaze that wanders (up and aside while he thinks).
 * A still frame of the same shader shows until the first live frame, and stays without WebGL.
 * Runs only while on screen; with reduced motion it draws one settled frame.
 */

export type OrbPhase = "idle" | "listening" | "thinking" | "speaking";

// Where the orb sits in the canvas (centre x, y and radius as shares of the width) and where it sits in
// the smoke image, as in the app's preview.
const LAYOUT = [0.5, 0.4, 0.25] as const;
const SMOKE = [339, 283, 272, 0.12] as const;

export function MaridOrb({
  phase = "idle",
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  phase?: OrbPhase;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const box = wrap.current;
    const canvas = cvs.current;
    if (!box || !canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = sh(gl.VERTEX_SHADER, ORB_VERTEX);
    const fs = sh(gl.FRAGMENT_SHADER, ORB_FRAGMENT);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const U = {
      res: u("iResolution"),
      time: u("iTime"),
      phase: u("uPhase"),
      face: u("uFace"),
      layout: u("uLayout"),
      smoke: u("uSmoke"),
      size: u("uSmokeSize"),
      tex: u("smokeTex"),
    };
    gl.uniform4f(U.smoke, ...SMOKE);
    gl.uniform1i(U.tex, 0);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    // The same state machine as the app: everything eases toward the current phase.
    const st = { listen: 0, think: 0, speak: 0, level: 0, blink: 0, gx: 0, gy: 0, tx: 0, ty: 0, nextBlink: 2, blinkT: -1, nextGaze: 0.5 };
    const voice = (t: number) => {
      const p = phaseRef.current;
      if (p !== "listening" && p !== "speaking") return 0;
      const syl = Math.abs(Math.sin(t * 7.3) * Math.sin(t * 2.9 + 1));
      const gap = Math.sin(t * 0.9) > 0.75 ? 0.15 : 1;
      return (0.25 + 0.75 * syl) * gap;
    };
    const step = (dt: number, t: number) => {
      const p = phaseRef.current;
      const f = 1 - Math.exp(-dt * 4);
      st.listen += (+(p === "listening") - st.listen) * f;
      st.think += (+(p === "thinking") - st.think) * f;
      st.speak += (+(p === "speaking") - st.speak) * f;
      const raw = voice(t);
      st.level += (raw - st.level) * (1 - Math.exp(-dt * (raw > st.level ? 18 : 5)));
      if (st.blinkT < 0 && t > st.nextBlink) st.blinkT = 0;
      if (st.blinkT >= 0) {
        st.blinkT += dt;
        const x = st.blinkT / 0.18;
        st.blink = x < 0.5 ? x * 2 : Math.max(0, 2 - 2 * x);
        if (x >= 1) {
          st.blinkT = -1;
          st.blink = 0;
          st.nextBlink = t + 2.5 + Math.random() * 4;
        }
      }
      if (t > st.nextGaze) {
        const r = (a: number) => (Math.random() * 2 - 1) * a;
        if (p === "thinking") [st.tx, st.ty] = [0.07 + r(0.02), -0.07 + r(0.015)];
        else if (p === "listening") [st.tx, st.ty] = [r(0.012), r(0.01)];
        else [st.tx, st.ty] = [r(0.04), r(0.025)];
        st.nextGaze = t + 1.2 + Math.random() * 2.6;
      }
      const g = 1 - Math.exp(-dt * 10);
      st.gx += (st.tx - st.gx) * g;
      st.gy += (st.ty - st.gy) * g;
    };

    const size = () => {
      const dpr = Math.min(coarse ? 1.5 : 2, window.devicePixelRatio || 1);
      const w = canvas.getBoundingClientRect().width;
      canvas.width = canvas.height = Math.max(1, Math.round(w * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.res, canvas.width, canvas.height);
      // the smoke and the rings need room; tiny orbs draw only the glass
      gl.uniform4f(U.layout, ...LAYOUT, w < 160 ? 0 : 1);
    };
    let ready = false;
    const draw = (t: number) => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U.time, t);
      gl.uniform4f(U.phase, st.listen, st.think, st.speak, 0);
      gl.uniform4f(U.face, st.level, st.blink, st.gx, st.gy);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (ready) box.dataset.live = "";
    };
    const settled = () => {
      for (let i = 0; i < 60; i++) step(1 / 30, 3.2);
      draw(3.2);
    };

    let raf = 0;
    let on = false;
    let seen = false;
    let last = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0);
      last = now;
      step(dt, t);
      draw(t);
      if (on) raf = requestAnimationFrame(loop);
    };
    const run = () => {
      const go = seen && ready && !reduced;
      if (go && !on) {
        on = true;
        last = 0;
        raf = requestAnimationFrame(loop);
      } else if (!go && on) {
        on = false;
        cancelAnimationFrame(raf);
      }
    };

    // The smoke is a texture: black until it loads, then the first frame replaces the still.
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    let alive = true;
    const img = new window.Image();
    img.src = smoke.src;
    img
      .decode()
      .then(() => {
        if (!alive) return;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform2f(U.size, img.naturalWidth, img.naturalHeight);
        ready = true;
        if (reduced) settled();
        run();
      })
      .catch(() => {});

    size();
    const ro = new ResizeObserver(() => {
      size();
      if (ready && !on) settled();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      run();
    });
    io.observe(box);
    const lost = (e: Event) => {
      e.preventDefault();
      on = false;
      cancelAnimationFrame(raf);
      delete box.dataset.live;
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => {
      alive = false;
      on = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("webglcontextlost", lost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div ref={wrap} className={`group/orb relative aspect-square ${className}`}>
      <div className="marid-bob absolute inset-0">
        <Image
          src={still}
          alt={alt}
          sizes={sizes}
          priority={priority}
          className="absolute inset-0 h-full w-full transition-opacity duration-700 group-data-[live]/orb:opacity-0"
        />
        <canvas
          ref={cvs}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700 group-data-[live]/orb:opacity-100"
        />
      </div>
    </div>
  );
}
