/**
 * A quiet night sky for inner pages: fixed star dust and a faint violet dawn at the top.
 * Pure CSS, no animation, so it costs nothing while scrolling.
 */
export function StarBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_12%_18%,rgba(255,255,255,.55),transparent),radial-gradient(1px_1px_at_28%_72%,rgba(255,255,255,.35),transparent),radial-gradient(1.5px_1.5px_at_44%_34%,rgba(226,214,255,.5),transparent),radial-gradient(1px_1px_at_63%_12%,rgba(255,255,255,.4),transparent),radial-gradient(1px_1px_at_78%_58%,rgba(255,255,255,.35),transparent),radial-gradient(1.5px_1.5px_at_88%_26%,rgba(255,255,255,.45),transparent),radial-gradient(1px_1px_at_6%_88%,rgba(255,255,255,.3),transparent),radial-gradient(1px_1px_at_52%_90%,rgba(226,214,255,.35),transparent),radial-gradient(1px_1px_at_94%_82%,rgba(255,255,255,.3),transparent)] bg-[length:640px_640px] opacity-80" />
      <div className="absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(124,77,255,.18),transparent_65%)]" />
    </div>
  );
}
