import { EVENODD, TOOL_LOGOS } from "@/components/home/hero/toolLogos";

/** A tool we build with: its logo (when we have one) and its name. */
export function ToolPill({ name }: { name: string }) {
  const paths = TOOL_LOGOS[name];
  return (
    <span dir="ltr" className="inline-flex h-9 items-center gap-2 rounded-pill border border-line bg-white/[0.03] px-3.5 text-[13px] text-soft">
      {paths && (
        <svg viewBox="0 0 24 24" className="size-4 text-ink" fill="currentColor" aria-hidden="true">
          {paths.map((d, i) => (
            <path key={i} d={d} fillRule={EVENODD.has(name) ? "evenodd" : "nonzero"} />
          ))}
        </svg>
      )}
      {name}
    </span>
  );
}
