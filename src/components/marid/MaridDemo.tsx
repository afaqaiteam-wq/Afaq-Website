"use client";

import { useEffect, useRef, useState } from "react";

import { MaridOrb, type OrbPhase } from "@/components/marid/MaridOrb";
import type { Turn } from "@/content/marid";

/*
 * The hero's demo: Marid listens to a line, thinks, then answers in words or with what it did on the
 * phone, and moves on to the next line. Every line is one the app really understands, and every spoken
 * answer is the app's own. On the English page each line leads in English, with the Arabic beneath it.
 * It plays only while on screen; before it starts (and with reduced motion) the first exchange shows
 * complete. The orb's alt text carries the meaning, so the captions are hidden from screen readers;
 * the same lines are listed as text in the examples section.
 */

type Stage = "listen" | "think" | "answer" | "rest";

const NEXT: Record<Stage, [Stage, number]> = {
  listen: ["think", 2000],
  think: ["answer", 1000],
  answer: ["rest", 3000],
  rest: ["listen", 700],
};

const PHASE: Record<Stage, OrbPhase> = { listen: "listening", think: "thinking", answer: "speaking", rest: "idle" };

// A line as Marid hears or says it, in Egyptian Arabic.
const arabic = (text: string, className: string) => (
  <span lang="ar" dir="rtl" className={`font-arabic ${className}`}>
    «{text}»
  </span>
);

export function MaridDemo({
  turns,
  you,
  marid,
  alt,
  showGloss,
}: {
  turns: Turn[];
  you: string;
  marid: string;
  alt: string;
  showGloss: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  const [i, setI] = useState(0);
  const [stage, setStage] = useState<Stage>("answer");

  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setRun(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!run) return;
    const [next, ms] = NEXT[stage];
    const id = window.setTimeout(() => {
      if (stage === "rest") setI((k) => (k + 1) % turns.length);
      setStage(next);
    }, ms);
    return () => window.clearTimeout(id);
  }, [run, stage, turns.length]);

  const t = turns[i];
  const phase = stage === "answer" && !t.reply ? "idle" : PHASE[stage];
  const heard = stage !== "rest";
  const answered = stage === "answer";
  const fade = "transition-[opacity,translate] duration-500 ease-out";

  return (
    <div ref={box} className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgb(245_185_66/0.16),transparent_62%)] blur-2xl"
      />
      <MaridOrb
        phase={phase}
        alt={alt}
        priority
        sizes="(min-width: 1024px) 520px, (min-width: 640px) 460px, 88vw"
        className="relative mx-auto w-full max-w-[520px]"
      />

      <div aria-hidden="true" className="relative mx-auto -mt-[6%] grid max-w-[440px] gap-3 text-[15px]">
        <p
          className={`${fade} flex min-h-[3.25rem] flex-col items-start gap-1 rounded-[18px] rounded-ss-md border border-line bg-white/[0.04] px-4 py-3 ${heard ? "opacity-100" : "translate-y-1 opacity-0"}`}
        >
          <span className="text-xs tracking-[0.14em] text-dim">{you}</span>
          {showGloss && t.sayGloss ? (
            <>
              <span className="text-ink">“{t.sayGloss}”</span>
              {arabic(t.say, "text-sm text-dim")}
            </>
          ) : (
            arabic(t.say, "text-ink")
          )}
        </p>
        <p
          className={`${fade} flex min-h-[3.25rem] flex-col items-end gap-1 rounded-[18px] rounded-se-md border border-gold/25 bg-gold/[0.06] px-4 py-3 text-end ${answered ? "opacity-100" : "translate-y-1 opacity-0"}`}
        >
          <span className="flex items-center gap-2 text-xs tracking-[0.14em] text-gold/80">
            {marid}
            {stage === "think" && <span className="marid-dots" />}
          </span>
          {t.reply && showGloss && t.replyGloss ? (
            <>
              <span className="text-gold-soft">“{t.replyGloss}”</span>
              {arabic(t.reply, "text-sm text-muted")}
            </>
          ) : t.reply ? (
            arabic(t.reply, "text-gold-soft")
          ) : (
            <span className="inline-flex items-center gap-2 text-gold-soft">
              <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t.done}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
