# Handoff: Afaq AI website rebuild (branch `next-rebuild`)

Talk to the founder (Mohamed Saber) in Egyptian Arabic. English is the main site, Arabic (RTL) at `/ar`.
Read `AGENTS.md` first (Next.js 16: read `node_modules/next/dist/docs/` before writing code).

## Done (all pushed)
- Hero engine (`src/components/home/hero/`): the warp starfield plays on EVERY load and ONLY on load, never on scroll. There are 3 nested, slightly inclined Kepler orbits with tool-logo planets, a constellation "A", and a GSAP intro. The user accepted it; don't cut any motion he liked.
- Home sections below the hero (`src/components/home/HomeSections.tsx`), the Services page and the About page. The About team is an org chart: CEO → Mostafa → Ghofran → a row of 3, using the `tier` field in `src/content/about.ts`.
- Shared components: `AccentText`, `ToolPill` (logos in `hero/toolLogos.ts`), `StarBackdrop`, `Button`, and `RevealObserver` (`data-reveal` + `--d` delay).

## Hard rules
- NEVER change the logo (`src/assets/brand/logo.png`).
- Purple accents must be vivid and strong, not silver. The footer stays restrained, with no giant wordmark.
- Copy must be human and specific, themed on "Afaq" = horizons. No hype words.
- Screenshot-verify before pushing: run `npx next start -p 4400`, then Playwright + Chrome. Check EN at 1440×900 and AR at 390×844.
- Run `npm run typecheck && npm run lint && npm run build` before every commit.

## Work page (done)
- `src/app/[lang]/work/page.tsx` + `src/content/work.ts` (EN + AR). There are 3 projects: real estate installments, sales & invoicing (client company unnamed), and MO Finance OS. The traffic project is excluded.
- Screenshots in `src/assets/work/*.webp` are cropped (no browser chrome or taskbar) and every amount, name, email and company name is blurred. `.work-tilt` in globals.css straightens each frame on reveal.
- The Sales & Invoicing stack is unknown, so it has no stack block. Add `tech` in `work.ts` once the user confirms it.
- The user may send demo-data screenshots later. To use them, replace the webp files; the filenames stay the same.

## Later
- Page transitions (View Transitions).
- Contact form setup: Resend keys `RESEND_API_KEY` / `CONTACT_TO_EMAIL`, lead storage, Turnstile.
- WhatsApp: the real number is needed (the old number opens "Waqar"; it's hidden in `src/lib/site.ts`).
- Domain and business email.
- Merge to `main` at launch.
