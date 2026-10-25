# Handoff: Afaq AI website rebuild (branch `next-rebuild`)

Talk to the founder (Mohamed Saber) in Egyptian Arabic. English is the main site, Arabic (RTL) at `/ar`.
Read `AGENTS.md` first (Next.js 16: read `node_modules/next/dist/docs/` before writing code).

## Done (all pushed)
- Hero engine (`src/components/home/hero/`): the warp starfield plays on EVERY load and ONLY on load, never on scroll. There are 3 nested, slightly inclined Kepler orbits with tool-logo planets, a constellation "A", and a GSAP intro. The user accepted it; don't cut any motion he liked.
- Home sections below the hero (`src/components/home/HomeSections.tsx`), the Services page and the About page. The About team is a constellation (`src/components/about/TeamConstellation.tsx`): the logo's A as a 3D star map that assembles, sways and follows the pointer, one star per person in `tier` order from `src/content/about.ts`; beside it the portraits are a deck of cards (the next two peek out from behind) that can be swiped or dragged, tapped, stepped with the arrows or the keyboard, or changed from a star. The deck deals itself out and teases one swipe when it first comes into view, then turns by itself every 7s until the visitor touches anything. On phones the order is star map, deck, then the name and words.
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
- Below the three projects there is a smaller `#automation` section. It shows the n8n YouTube AI Comment Assistant from the old site, as a working automation example rather than a fourth project. The copy covers only what the workflow screenshot shows. The default "I'm a note" sticky and the Execute button were removed from the image.
- The Sales & Invoicing stack is unknown, so it has no stack block. Add `tech` in `work.ts` once the user confirms it.
- The user may send demo-data screenshots later. To use them, replace the webp files; the filenames stay the same.

## Marid page (October 2026, done)
- **What it is:** `/marid` (`src/app/[lang]/marid/page.tsx`, copy in `src/content/marid.ts`) presents Marid, our own Android voice assistant, as our new project. The project lives in the private repo `afaqaiteam-wq/life-agent`; never link to it.
- **Rules for its copy:**
  - Every ability must exist in that repo's code or docs (`docs/ASSISTANT.md`, `docs/DECISIONS.md`).
  - Nothing personal: no health, medication, college, job, family or private goals, and not the founder's name inside Marid's lines.
  - Don't name the voice model or the `hey_jarvis` wake-word model; their licences aren't confirmed.
  - What you say to Marid and what he answers are Egyptian Arabic (`say` and `reply` keys, which `check:arabic` skips). The English page leads with the English gloss and shows the Arabic small beneath it; his name is written “Ya Marid” there, never «يا مارد».
- **Siri and Bixby:** every point about them comes from Apple's iOS feature availability page and Samsung's newsroom post of 2026-10-14 (both linked under the table). Re-check those pages before changing a claim, and keep it to facts: languages, devices, requirements.
- **The orb:** `src/components/marid/orb-shader.ts` is the app's own AGSL (`tools/orb/orb.agsl` in life-agent), translated to WebGL the same way as the app's `tools/orb/preview.py`. To update it, paste the new AGSL over the old one. `MaridOrb.tsx` ports the preview's state machine. `MaridDemo.tsx` plays the hero's exchanges (only lines the app really understands, and only its own spoken answers).
- **Images in `src/assets/marid/`:**
  - `orb-still.webp` is a frame of the shader (idle, t = 3.2 s), shown until WebGL draws and kept without it.
  - `smoke.webp` is the shader's texture.
  - `logo.webp` is Marid's logo.
  - `og-en.jpg` and `og-ar.jpg` are the share images, rendered in Chromium from an HTML page, because the built-in image renderer leaves gaps between some Arabic words. Re-render them if the title or tagline changes.
- **Elsewhere on the site:** Marid has a navbar link with a gold «جديد / New» badge, a card on the home page after the work, a section on the Work page after the automation, and a footer link. `/marid` is in the sitemap.

## Page transitions (done)
- `src/components/motion/PageTransition.tsx` is a React `<ViewTransition>` keyed by pathname and wraps the page in the layout. The CSS lives in globals.css (`page-exit` / `page-enter`). The navbar has `view-transition-name: site-header`, so it stays fixed during the transition. Reduced motion turns it off.
- `SmoothScroll` now scrolls every new page to the top. Lenis used to keep the old scroll position. Back/forward and `#hash` links are left to the browser.

## Arabic copy (October 2026, done)
- **Full review:** every Arabic string was reviewed against its English. The fixes were wording only: literal translations ("حول عملك", "حيث يهم", "واجهة ترحيب", "قيمة أسرع"), a verb repeated in the contact title and lead, "أيها" reading as a vocative in the services closing title, "العلامة" without "التجارية", and "السوشيال ميديا" in a role.
- **`npm run check:arabic` (`scripts/check-arabic.mjs`):** run it after any Arabic edit. It checks the Arabic in `ar.ts` and the `ar` blocks of `src/content/*.ts` for:
  - missing hamzas on common words and ي written for ى;
  - colloquial words;
  - Latin punctuation and stray spaces inside Arabic;
  - unbalanced «»;
  - English left untranslated (anything not on its allowlist of product and tool names).
  It exits with 1 on findings. To check other files, pass them as arguments.
- **Case-study meta descriptions:** made of the one-liner plus whole sentences of the problem, up to about 160 characters, so they never stop mid-sentence.

## Security and quality audit (October 2026, done)
- **Next.js:** pinned at 16.3.8, the patched release for the 16.3 line's advisories (image optimizer SSRF, SSG/ISR cache poisoning, metadata image disclosure). `npm audit` now lists only `braces`, which has no patched version. It comes in through `eslint-config-next`, so it's dev tooling and never ships.
- **Headers (`next.config.ts`):**
  - A Content-Security-Policy in production. Everything is same-origin, and `vercel.live` is allowed for the preview toolbar. Inline scripts stay allowed because Next streams page data inline.
  - `Cross-Origin-Opener-Policy`.
  - The existing HSTS, frame, nosniff, referrer and permissions headers.
  - If you add a third-party script, font or image host, add it to the CSP.
- **`/api/contact`:**
  - Refuses a cross-site `Origin` (403), anything that isn't JSON (415) and bodies over 32 KB (413).
  - Accepts only the services listed in the dictionaries.
  - Keeps the name, company and service on one line in the email subject.
  - Prunes its rate-limit map.
- **Reveals:** the layout's inline script starts them as soon as the page is parsed (production only); `RevealObserver` takes over after hydration. Before, a slow phone showed the first screen only after the app loaded.
- **Language switch:** no longer prefetched, which removes a 404 from the console on Arabic pages.
- **Crawl result:** 18 pages × 3 widths with no console errors, broken links or images, horizontal overflow, duplicate ids or unnamed controls, and one `h1` per page.
- **Lighthouse (mobile, local):** accessibility, best practices and SEO are 100 on every page; performance is 78–93.

## Site audit (done)
- The home page has a "Selected work" section (3 cards → `/work#slug`), placed after the services and before "How we work".
- The home page has Organization JSON-LD with confirmed details only. The 404 has its own tab title.
- Every EN/AR page was checked at 1440 and 390: all return 200, no broken links, no horizontal overflow, and axe finds no violations.
- Known and harmless: from the Arabic pages, a few prefetches of English URLs (e.g. `/services?_rsc=…`) return 404. The client router guesses `/services` = `/[lang]` because the English routes are rewritten in `proxy.ts`, then fetches the correct one. Navigation works normally.

## Premium + mobile pass (after the QA report)
- **Primary button:** a vivid violet gradient with white text (4.8:1) and a light sweep on hover.
- **Motion system in globals.css**, all on `data-reveal`:
  - `rise` (headings out of a mask; it must start partly open, because IntersectionObserver counts clip-path);
  - `image`;
  - `line` / `line-y` (drawn lines, the org chart connectors);
  - eyebrow lines that draw in.
- **`MotionFX`:** a reading-progress hairline, a slow star parallax, and a pointer spotlight on `[data-spotlight]` cards. Blur reveals are off on phones.
- **Phones:**
  - The header shows only the logo and the menu. The old `hidden sm:inline-flex` lost to the Button's own `inline-flex`; now `max-sm:hidden`.
  - The menu is solid and has the email, the language switch and the CTA. Safe areas are handled (`viewportFit: cover`).
  - The home hero is `265vh` on phones and `340vh` from `sm` up. It ends on the constellation scene, held (`STORY_END` in `timeline.ts`); the old finale (logo return and its call to action) is gone.
  - The work screenshots use `*-mobile.webp` detail crops, with a `ZoomImage` lightbox.
  - Services has sticky `ServiceChips`.
  - About shows the team in two columns (the fifth card centred).
  - The footer is two columns with 44px links.
- **Home order:** hero (ends on the six-stars constellation; the only call to action is the closing card) → selected work (one lead project with a readable detail crop, then the other two) → services as a grid of cards (the first two large, with their tools) → a team band (founder quote, the other five as avatars, link to About) → closing card (book a call, copy email) over a live WebGL planet (`src/components/ui/LivePlanet.tsx`, with `PlanetHorizon.tsx` as the static fallback). "How we work" now lives only on /services.
- **Contact:** an accent title line, equal cards, one primary (Book a call), and Copy email.
- **Team titles:** Mohamed Alaa is now "Creative & Video Lead", and Mohamed Ragab is "Social Media & Growth Lead". The founder photo is intentionally different.
- **Every page** now has the share image and the brand in og:title. The 404 language switch goes to the other home.

## Domain and email (done)
- **Domain:** `afaqai.dev` was registered on Cloudflare (account afaq.ai.team@gmail.com, owned by Mohamed Saber). Auto-renew is on and it renews at $12.20/yr. `.dev` is HTTPS-only.
- **Email:** Cloudflare Email Routing forwards incoming mail to Gmail, receive only:
  - `info@` goes to the team Gmail. It is the public address on the site.
  - `mohamed@`, `mostafa@` and `ghofran@` each go to the person's own Gmail.
  - Catch-all is disabled.
- **Sending as @afaqai.dev** needs a real mailbox, e.g. Google Workspace. Moving to a mailbox provider means turning Email Routing off, because only one provider can receive.
- **Code:** `site.url` defaults to https://afaqai.dev and `site.email` is info@afaqai.dev. If `NEXT_PUBLIC_SITE_URL` is set in Vercel, it overrides the default.

## Later
- Contact form setup: Resend keys `RESEND_API_KEY` / `CONTACT_TO_EMAIL`, lead storage, Turnstile. Until both keys are set, `/contact` shows an "Email us directly" panel instead of the form. The check happens at build time, so after adding the keys in Vercel, redeploy and the form comes back.
- WhatsApp: the real number is needed (the old number opens "Waqar"; it's hidden in `src/lib/site.ts`).
- Merge to `main` at launch (PR opened from `next-rebuild`).
