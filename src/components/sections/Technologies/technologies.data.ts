/**
 * Technology showcase data.
 *
 * Logos are described as typed SVG primitives rather than raw markup strings,
 * so they render through React without dangerouslySetInnerHTML and stay
 * type-checked. Every mark is authored on a 24x24 grid and painted with
 * `currentColor`, which lets the card drive colour entirely from Tailwind —
 * keeping the section on the existing violet/white palette.
 *
 * NOTE: these are hand-authored marks, not the vendors' official brand SVGs.
 * They are faithful and recognisable, but if you need exact brand assets,
 * replace the `logo` array for a given entry — nothing else has to change.
 * Check each vendor's brand guidelines before shipping their trademark.
 */

/** A single drawable primitive. `stroke` set => stroked, otherwise filled. */
export type LogoShape =
  | { kind: "path"; d: string; stroke?: number; evenOdd?: boolean }
  | { kind: "circle"; cx: number; cy: number; r: number; stroke?: number }
  | {
      kind: "ellipse";
      cx: number;
      cy: number;
      rx: number;
      ry: number;
      rotate?: number;
      stroke?: number;
    }
  | { kind: "rect"; x: number; y: number; w: number; h: number; r?: number; stroke?: number }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number; stroke: number }
  | {
      kind: "text";
      value: string;
      x: number;
      y: number;
      size: number;
      weight?: number;
      tracking?: number;
    };

export interface Technology {
  /** Display name, shown under the mark. */
  name: string;
  /** Short category label, used for the accessible description. */
  category: string;
  /** Drawable primitives, authored against a 24x24 viewBox. */
  logo: LogoShape[];
}

export const TECHNOLOGIES: Technology[] = [
  {
    name: "OpenAI",
    category: "AI model provider",
    logo: [
      {
        kind: "path",
        d: "M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a5.98 5.98 0 0 0-3.997 2.9 6.05 6.05 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A5.98 5.98 0 0 0 13.26 24a6.06 6.06 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.06 6.06 0 0 0-.747-7.073zM13.26 22.43a4.48 4.48 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973v5.677a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387 2.015-1.164a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.679zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z",
      },
    ],
  },
  {
    name: "Claude",
    category: "AI model provider",
    /**
     * Traced directly from the reference image: 12 rays, 30° apart,
     * alternating long/short, each a single round-capped stroke rather than
     * a tapered fill — that's what gives the reference its distinctive
     * *rounded* ray tips instead of sharp points. All 12 share one radius
     * from centre (1.2) so they read as radiating from one point without
     * actually overlapping into a solid disc. currentColor stroke, same as
     * every other entry, so the card still drives its own colour.
     */
    logo: [
      { kind: "line", x1: 12, y1: 10.8, x2: 12, y2: 1.5, stroke: 1.9 },
      { kind: "line", x1: 12.6, y1: 10.96, x2: 16.15, y2: 4.81, stroke: 1.9 },
      { kind: "line", x1: 13.04, y1: 11.4, x2: 21.09, y2: 6.75, stroke: 1.9 },
      { kind: "line", x1: 13.2, y1: 12, x2: 20.3, y2: 12, stroke: 1.9 },
      { kind: "line", x1: 13.04, y1: 12.6, x2: 21.09, y2: 17.25, stroke: 1.9 },
      { kind: "line", x1: 12.6, y1: 13.04, x2: 16.15, y2: 19.19, stroke: 1.9 },
      { kind: "line", x1: 12, y1: 13.2, x2: 12, y2: 22.5, stroke: 1.9 },
      { kind: "line", x1: 11.4, y1: 13.04, x2: 7.85, y2: 19.19, stroke: 1.9 },
      { kind: "line", x1: 10.96, y1: 12.6, x2: 2.91, y2: 17.25, stroke: 1.9 },
      { kind: "line", x1: 10.8, y1: 12, x2: 3.7, y2: 12, stroke: 1.9 },
      { kind: "line", x1: 10.96, y1: 11.4, x2: 2.91, y2: 6.75, stroke: 1.9 },
      { kind: "line", x1: 11.4, y1: 10.96, x2: 7.85, y2: 4.81, stroke: 1.9 },
    ],
  },
  {
    name: "Gemini",
    category: "AI model provider",
    logo: [
      {
        kind: "path",
        d: "M12 1.5c0 5.8 4.7 10.5 10.5 10.5C16.7 12 12 16.7 12 22.5 12 16.7 7.3 12 1.5 12 7.3 12 12 7.3 12 1.5Z",
      },
    ],
  },
  {
    name: "React",
    category: "Frontend library",
    logo: [
      { kind: "circle", cx: 12, cy: 12, r: 2.05 },
      { kind: "ellipse", cx: 12, cy: 12, rx: 10.5, ry: 4, stroke: 1.3 },
      { kind: "ellipse", cx: 12, cy: 12, rx: 10.5, ry: 4, rotate: 60, stroke: 1.3 },
      { kind: "ellipse", cx: 12, cy: 12, rx: 10.5, ry: 4, rotate: 120, stroke: 1.3 },
    ],
  },
  {
    name: "Next.js",
    category: "React framework",
    logo: [
      { kind: "circle", cx: 12, cy: 12, r: 10.4, stroke: 1.3 },
      { kind: "path", d: "M8.6 16.6V7.7h1.6l6 8.3", stroke: 1.5 },
      { kind: "line", x1: 15.3, y1: 7.7, x2: 15.3, y2: 15.1, stroke: 1.5 },
    ],
  },
  {
    name: "TypeScript",
    category: "Typed JavaScript",
    logo: [
      { kind: "rect", x: 1.8, y: 1.8, w: 20.4, h: 20.4, r: 3.2, stroke: 1.3 },
      { kind: "text", value: "TS", x: 12, y: 15.9, size: 9.4, weight: 700, tracking: -0.4 },
    ],
  },
  {
    name: "Node.js",
    category: "Runtime",
    // Hexagon outline with "JS" lettering, matching the real mark — the
    // previous version used a single "N", which isn't what the actual logo
    // shows.
    logo: [
      { kind: "path", d: "M12 1.9 20.75 6.95V17.05L12 22.1 3.25 17.05V6.95Z", stroke: 1.3 },
      { kind: "text", value: "JS", x: 12, y: 15.2, size: 7, weight: 700, tracking: -0.3 },
    ],
  },
  {
    name: "Python",
    category: "Backend & ML",
    logo: [
      {
        kind: "path",
        d: "M11.9 2c-1.7 0-3.2.2-4.3.6C6.2 3 5.6 3.9 5.6 5.1v2.4h6.4v.8H4.2c-1.3 0-2.4.8-2.8 2.3-.4 1.7-.4 2.8 0 4.6.3 1.4 1.1 2.3 2.4 2.3h1.9v-2.7c0-1.5 1.3-2.8 2.8-2.8h4.9c1.2 0 2.2-1 2.2-2.2V5.1c0-1.2-1-2.1-2.2-2.3C13.1 2.6 12.5 2 11.9 2zM9 3.7c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z",
      },
      {
        kind: "path",
        d: "M18.4 8.3v2.6c0 1.6-1.4 2.9-2.9 2.9h-4.9c-1.2 0-2.2 1-2.2 2.2v4.1c0 1.2 1 1.9 2.2 2.2 1.4.4 2.8.5 4.5 0 1.1-.3 2.2-1 2.2-2.2v-2.4h-6.3v-.8h9.4c1.3 0 1.8-.9 2.2-2.3.5-1.4.5-2.8 0-4.6-.3-1.4-.9-2.3-2.2-2.3h-2zM15 19.4c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z",
      },
    ],
  },
  {
    name: "Supabase",
    category: "Database & auth",
    logo: [
      {
        kind: "path",
        d: "M13.1 1.6c.6-.8 1.9-.3 1.9.7v7.9h5.6c1 0 1.6 1.2.9 2L10.9 22.4c-.6.8-1.9.3-1.9-.7v-7.9H3.4c-1 0-1.6-1.2-.9-2L13.1 1.6z",
      },
    ],
  },
  {
    name: "n8n",
    category: "Automation platform",
    /**
     * Four hollow rings on a branching connector, traced from the official
     * mark: two on a horizontal trunk at left, then a Y-split into an upper
     * ring (further right) and a lower ring. Rings are stroked, not filled —
     * the open centre is the defining feature of the logo.
     *
     * Connectors stop at each ring's outer edge (centre ± (r + stroke/2))
     * rather than running to the centre, so nothing crosses the open holes.
     */
    logo: [
      { kind: "circle", cx: 3.2, cy: 12, r: 1.6, stroke: 1.25 },
      { kind: "circle", cx: 9.0, cy: 12, r: 1.6, stroke: 1.25 },
      { kind: "circle", cx: 20.7, cy: 8.55, r: 1.6, stroke: 1.25 },
      { kind: "circle", cx: 18.2, cy: 15.45, r: 1.6, stroke: 1.25 },

      // trunk between the two left-hand rings
      { kind: "line", x1: 5.43, y1: 12, x2: 6.78, y2: 12, stroke: 1.25 },

      // branch up to the far ring
      {
        kind: "path",
        d: "M11.23 12h1.45a1.45 1.45 0 0 0 1.45-1.45v-.55a1.45 1.45 0 0 1 1.45-1.45h2.9",
        stroke: 1.25,
      },

      // branch down to the near ring
      {
        kind: "path",
        d: "M11.23 12h1.45a1.45 1.45 0 0 1 1.45 1.45v.55a1.45 1.45 0 0 0 1.45 1.45h.4",
        stroke: 1.25,
      },
    ],
  },
  {
    name: "Docker",
    category: "Containerisation",
    logo: [
      { kind: "rect", x: 4.3, y: 8.1, w: 2.5, h: 2.3, r: 0.3 },
      { kind: "rect", x: 7.2, y: 8.1, w: 2.5, h: 2.3, r: 0.3 },
      { kind: "rect", x: 10.1, y: 8.1, w: 2.5, h: 2.3, r: 0.3 },
      { kind: "rect", x: 13.0, y: 8.1, w: 2.5, h: 2.3, r: 0.3 },
      { kind: "rect", x: 7.2, y: 5.4, w: 2.5, h: 2.3, r: 0.3 },
      { kind: "rect", x: 10.1, y: 5.4, w: 2.5, h: 2.3, r: 0.3 },
      { kind: "rect", x: 13.0, y: 5.4, w: 2.5, h: 2.3, r: 0.3 },
      { kind: "rect", x: 10.1, y: 2.7, w: 2.5, h: 2.3, r: 0.3 },
      {
        kind: "path",
        d: "M22.9 11.4c-.6-.4-1.9-.6-2.9-.4-.1-1-.7-1.9-1.6-2.6l-.5-.4-.4.5c-.5.7-.7 1.8-.4 2.7H1.7c-.3 0-.6.3-.6.6 0 1.9.3 3.8 1.3 5.3 1.1 1.6 2.9 2.4 5.4 2.4 5.3 0 9.4-2.4 11.3-6.8 1.1 0 2.3-.3 3-1.1l.2-.3-.4-.3z",
      },
    ],
  },
  {
    name: "AWS",
    category: "Cloud infrastructure",
    logo: [
      { kind: "text", value: "aws", x: 12, y: 12.4, size: 8.2, weight: 700, tracking: -0.3 },
      {
        kind: "path",
        d: "M3.2 16.6c2.6 1.9 6.2 2.9 9.3 2.9 2.1 0 4.5-.4 6.7-1.3.3-.1.6.1.3.5-1.9 1.4-5 2.1-7.6 2.1-3.7 0-7-1.4-9.5-3.6-.2-.2 0-.5.3-.3z",
      },
      {
        kind: "path",
        d: "M20.4 15.6c-.3-.4-2.1-.2-2.9-.1-.2 0-.3-.2-.1-.3 1.4-1 3.8-.7 4.1-.4.3.4-.1 2.7-1.4 3.8-.2.2-.4.1-.3-.1.3-.7.9-2.5.6-2.9z",
      },
    ],
  },
];
