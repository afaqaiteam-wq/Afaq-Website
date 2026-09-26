import { Fragment } from "react";

/**
 * Words in the violet accent. Each word carries the gradient itself, and the delays let the
 * light sweep travel along the line instead of flashing every word at once.
 */
export function AccentText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="text-accent inline-block" style={{ animationDelay: `${i * 0.09}s` }}>
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
