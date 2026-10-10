"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * The closing card's planet, alive: a WebGL shader draws the planet's cap from orbit with
 * clouds drifting as it turns, a shimmering atmosphere and aurora on the limb, a sun that
 * flickers and throws rays as it breaks over the edge, and city lights on the night side.
 * The static SVG (children) shows until the first frame, and stays if WebGL isn't available.
 * Runs only while on screen; with reduced motion it draws one still frame.
 */

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `precision highp float;
uniform vec2 res;uniform float t,dpr,cap,R,rise;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float no(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fb(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<5;i++){v+=a*no(p);p=m*p;a*=.5;}return v;}
void main(){
  vec2 px=gl_FragCoord.xy/dpr;vec2 S=res/dpr;
  // the planet rises into view as the card scrolls in, and the sun comes up with it
  float capE=cap*(.45+.55*rise);
  vec2 c=vec2(S.x*.5,capE-R);
  vec2 dv=px-c;float d=length(dv);
  float x=(px.x-c.x)/S.x;
  float sunX=exp(-x*x*7.);
  vec3 col=vec3(0.);float al=0.;
  if(d<R){
    float depth=R-d;
    float v=clamp(depth/cap,0.,1.4);
    float ang=atan(dv.x,dv.y);
    float u=ang*R/S.x;
    float vv=pow(v,.65);
    // the surface turns: land drifts sideways, clouds move a little faster on the wind
    float spin=t*.028;
    float land=smoothstep(.47,.6,fb(vec2((u+spin)*1.7,vv*2.4)+vec2(3.1,7.7)));
    vec2 q=vec2((u+spin*1.6)*3.2,vv*5.5);
    vec2 w=vec2(fb(q+vec2(0.,t*.05)),fb(q+vec2(5.2,1.3)-vec2(t*.04,0.)));
    float n=fb(q*1.3+w*1.8+vec2(t*.05,0.));
    float bands=.5+.5*sin(vv*16.+n*5.+t*.05);
    float cl=smoothstep(.35,.85,n*.75+bands*.35);
    float lit=sunX*exp(-v*1.4)*(1.+.04*sin(t*.4));
    vec3 ocean=mix(vec3(.05,.03,.14),vec3(.2,.1,.48),sunX*exp(-v*2.));
    ocean=mix(ocean,vec3(.32,.2,.62)*(.5+.5*sunX),land*.55);
    vec3 day=mix(ocean,vec3(.86,.74,1.),cl);
    vec3 night=vec3(.012,.01,.03)+vec3(.05,.03,.12)*cl*.4;
    // city lights twinkle where the sun hasn't reached
    vec2 gc=vec2((u+spin)*150.,vv*36.);vec2 g=floor(gc);float hh=h(g);
    // each lit cell is a pin-point, not the whole cell, and only near the limb where cells are small
    float pin=smoothstep(.22,.0,length(fract(gc)-.5))*(1.-smoothstep(.35,.7,v));
    float city=step(.975,hh)*pin*(.4+.6*land)*(.55+.45*sin(t*2.2+hh*60.))*(1.-smoothstep(.0,.35,lit))*smoothstep(.05,.3,v);
    col=mix(night,day,clamp(lit*1.6,0.,1.))+vec3(.75,.65,1.)*city*.9;
    // the limb glows from inside, brightest under the sun
    col+=vec3(.82,.72,1.)*exp(-depth/5.)*(.25+1.3*sunX);
    col+=vec3(.45,.3,.95)*exp(-depth/26.)*(.12+.5*sunX);
    al=1.;
  }else{
    float hgt=d-R;
    // atmosphere: thin and bright near the sun, thicker and fainter toward the sides
    float th=8.+26.*sunX;
    col+=mix(vec3(.45,.3,.95),vec3(.96,.92,1.),sunX)*exp(-hgt/th)*(.22+1.15*sunX);
    // aurora curtains rippling over the limb, away from the sun
    float ang=atan(dv.x,dv.y);float u=ang*R/S.x;
    float cur=fb(vec2(u*7.+t*.12,hgt*.035-t*.25));
    float aur=smoothstep(2.,10.,hgt)*exp(-hgt/38.)*pow(cur,2.2)*(1.-sunX)*1.6;
    col+=mix(vec3(.35,.85,1.),vec3(.6,.4,1.),cur)*aur;
    al=0.;
  }
  // the sun on the limb: a bright core, a short flare and slow rays reaching up
  vec2 sp=px-vec2(c.x,capE);float r=length(sp);
  float pulse=(.88+.12*sin(t*1.3)+.05*sin(t*3.7))*(.25+.75*rise);
  float core=exp(-r/5.)*1.8+exp(-r/28.)*.5+exp(-r/(S.x*.07))*.2;
  float streak=exp(-abs(sp.y)/1.2)*exp(-abs(sp.x)/40.)*.6;
  float a2=atan(sp.y,abs(sp.x)+.0001);
  float rays=step(0.,sp.y)*exp(-r/(S.x*.085))*pow(fb(vec2(a2*7.,t*.3)),3.)*1.25;
  col+=vec3(1.,.97,1.)*(core+streak)*pulse+vec3(.78,.66,1.)*rays*pulse;
  // fade the light out well before the top of the canvas so it has no edge
  float fade=smoothstep(S.y,S.y*.45,px.y);
  col*=fade;
  al=max(al,clamp(max(col.r,max(col.g,col.b)),0.,1.));
  gl_FragColor=vec4(col,al);
}`;

export function LivePlanet({ className = "", children }: { className?: string; children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = wrap.current!;
    const canvas = cvs.current!;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = sh(gl.VERTEX_SHADER, VERT);
    const fs = sh(gl.FRAGMENT_SHADER, FRAG);
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
    const uRes = u("res"), uT = u("t"), uDpr = u("dpr"), uCap = u("cap"), uR = u("R"), uRise = u("rise");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = 1;
    const size = () => {
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const wide = r.width >= 768;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uDpr, dpr);
      // a dome, not a strip: the limb peaks well inside the box and curves away toward the sides
      gl.uniform1f(uCap, r.height * (wide ? 0.6 : 0.56));
      gl.uniform1f(uR, r.width * (wide ? 0.75 : 0.88));
    };
    const draw = (now: number) => {
      // 0 as the planet's box enters at the bottom of the window, 1 once it's fully in view
      const b = box.getBoundingClientRect();
      const rise = reduced ? 1 : Math.min(1, Math.max(0, (window.innerHeight - b.top) / (b.height * 1.05)));
      gl.uniform1f(uRise, rise);
      gl.uniform1f(uT, reduced ? 12 : now / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    let raf = 0;
    let on = false;
    const loop = (now: number) => {
      draw(now);
      if (on) raf = requestAnimationFrame(loop);
    };
    size();
    draw(performance.now());
    box.dataset.live = "";

    const ro = new ResizeObserver(() => {
      size();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      const vis = e.isIntersecting && !reduced;
      if (vis && !on) {
        on = true;
        raf = requestAnimationFrame(loop);
      } else if (!vis) {
        on = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(box);
    return () => {
      on = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden="true" className={`group/planet pointer-events-none ${className}`}>
      <div className="absolute inset-x-0 bottom-0 transition-opacity duration-700 group-data-[live]/planet:opacity-0">{children}</div>
      <canvas
        ref={cvs}
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 group-data-[live]/planet:opacity-100"
      />
    </div>
  );
}
