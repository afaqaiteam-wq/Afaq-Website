# Afaq AI website

Marketing site for Afaq AI, built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4.
English is the default language at `/`; Arabic (right-to-left) lives under `/ar`.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values you need
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (run before every pull request) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |

## Environment variables

See `.env.example`. The contact form needs `RESEND_API_KEY` and `CONTACT_TO_EMAIL`; without them the API
returns 503 and the form shows visitors a fallback (email and booking link). Set the same keys in
Vercel → Project → Settings → Environment Variables, then send one real test message after every deploy.

## Project structure

```
src/
  app/
    [lang]/            every page, once per language (layout, home, contact, 404)
    api/contact/       server-side contact endpoint (validation, rate limit, email via Resend)
    sitemap.ts, robots.ts, icon.png, apple-icon.png
  components/
    ui/                shared primitives (Button) — use these, don't restyle per page
    layout/            Navbar, Footer
    home/              HeroStory (the scroll-driven opening)
    contact/           ContactForm
  i18n/                locales, routing helpers and the en/ar dictionaries (all copy lives here)
  lib/                 site config (links, email), metadata helper, shared schemas
  proxy.ts             serves English without a prefix and redirects /en/* to /*
```

Design tokens (colors, fonts, radii) are defined once in `src/app/globals.css` under `@theme`.

## Working rules

- One branch and one pull request per change; `main` is what's live.
- Commit messages say what changed: `feat: add services page`, `fix: center navbar logo`.
- Before merging: `npm run lint`, `npm run typecheck` and `npm run build` pass, and the Vercel preview has been
  clicked through (every link, the form, both languages, a phone-width check).
- New copy goes into both dictionaries (`src/i18n/dictionaries/en.ts` and `ar.ts`).
- Contact details and external links live only in `src/lib/site.ts`; a `null` link is hidden everywhere.
