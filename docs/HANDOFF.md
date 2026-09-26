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

## NEXT: Work page (`src/app/[lang]/work/page.tsx`)
Nav already links to `/work`. Add `/work` to `src/app/sitemap.ts`. Run `npx next typegen` after adding the route.

Content goes in `src/content/work.ts` (EN + AR), shaped like `services.ts`. Do NOT invent features, metrics or results.

There are 3 projects (the user decided). The traffic-simulation project in his old brief is NOT included.

1. **Real Estate Installment Management**
   - Client: Dr. Mohamed Elshiwi.
   - Replaces scattered Excel with one system. Chain: Buildings → Apartments → Owners → Contracts → Installments → Payments.
   - Features: dashboard stats, collection-progress ring, charts, search/filter, Excel import/export, backup/restore, admin auth, an Arabic-first dark UI, and quick actions (add apartment/owner, new contract, generate an installment schedule, record a payment).
   - Stack: Django, Python, SQLite, HTML/CSS/JS.
2. **Sales & Invoicing Platform**
   - Multi-company SaaS. Do NOT name the client company.
   - Visible features: quotations, invoices, sales, payments, companies/customers, account statements, products, team, subscription plans, and a company switcher.
   - Dashboard: sales count, total sales and payments, amount due, sales-vs-collection chart for the last 6 months, top debts, top customers, payment methods, and a "this month" filter.
   - Also has an AR/EN toggle and dark mode.
   - Stack: UNKNOWN. Ask the user, or omit the stack block.
3. **MO Finance OS**
   - A ledger-based personal financial operating system. Flow: Data → Reconciliation → Analysis → Risk Detection → Planning → Action.
   - Parses CIB/BDC bank statements and reconciles the statement balance vs the user's real share vs other people's exposure.
   - Guards: alert engine, credit guard, cash-flow guardian, spending-leak detector.
   - Also has analytics, weekly/monthly reviews, a scenario engine, a debt strategy engine and "close the gap" planning.
   - Stack: Next.js, TypeScript, Tailwind, Prisma, SQLite, Vitest (strong test suite).

### Design
Match the Services page's premium, minimal style.

For each project:
- a large screenshot in a frame with a violet glow and a subtle tilt that straightens on reveal;
- number + category eyebrow, title, one-liner;
- short problem → what we built;
- a capabilities list;
- a flow chip row for projects 1 and 3;
- `ToolPill` stack pills.

The page also needs a closing CTA.

### Screenshots
The user must re-attach his 3 screenshots; they are not in the repo.
- Crop out the browser chrome and the Windows taskbar.
- Blur every sensitive value with sharp: amounts, names like "Mustafa", the email, the client company name, and the URL tooltip. The user chose blur. He may send demo-data shots later.
- Save as webp into `src/assets/work/`.

## Later
- Page transitions (View Transitions).
- Contact form setup: Resend keys `RESEND_API_KEY` / `CONTACT_TO_EMAIL`, lead storage, Turnstile.
- WhatsApp: the real number is needed (the old number opens "Waqar"; it's hidden in `src/lib/site.ts`).
- Domain and business email.
- Merge to `main` at launch.
