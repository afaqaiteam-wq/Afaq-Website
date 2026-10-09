/**
 * Every project page under /work. Kept apart from work.ts so client components (the navbar's
 * language switch) can check a path without bundling the case-study content and screenshots.
 */
export const workSlugs = ["real-estate", "sales", "finance"] as const;
export type WorkSlug = (typeof workSlugs)[number];

export const isWorkSlug = (value: string): value is WorkSlug =>
  (workSlugs as readonly string[]).includes(value);
