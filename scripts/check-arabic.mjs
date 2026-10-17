#!/usr/bin/env node
/*
 * Checks the site's Arabic copy for mechanical mistakes: missing hamzas on common words,
 * ي written for ى, colloquial words, Latin punctuation inside Arabic, stray spaces,
 * unbalanced «», and English left untranslated in the Arabic version.
 * Wording and meaning still need a person: this only catches what a rule can.
 *
 * Usage: npm run check:arabic   (exits with 1 when it finds something)
 *        node scripts/check-arabic.mjs some/file.ts   (checks whole files instead)
 */
import { readFileSync } from "node:fs";

// Where the Arabic lives: a whole file, or the part of a file from `const ar` to its export.
const DEFAULT_SOURCES = [
  { file: "src/i18n/dictionaries/ar.ts" },
  { file: "src/content/about.ts", from: /^const ar\b/m, to: /^export const/m },
  { file: "src/content/services.ts", from: /^const ar\b/m, to: /^export const/m },
  { file: "src/content/work.ts", from: /^const ar\b/m, to: /^export const/m },
];
const args = process.argv.slice(2);
const SOURCES = args.length ? args.map((file) => ({ file })) : DEFAULT_SOURCES;

// Latin words that are fine on an Arabic page: names of products, tools, banks and formats.
const ALLOWED_LATIN = new Set(
  [
    "AI", "Afaq", "English", "OpenAI", "Claude", "Gemini", "n8n", "Python", "Docker", "Next.js",
    "Supabase", "AWS", "SaaS", "Excel", "Django", "SQLite", "HTML", "CSS", "JS", "TypeScript",
    "Tailwind", "Prisma", "Vitest", "YouTube", "Data", "API", "OpenRouter", "CIB", "BDC", "MO",
    "Finance", "OS",
  ].map((w) => w.toLowerCase()),
);
// Keys whose values are identifiers, not copy.
const SKIP_KEYS = new Set(["slug"]);

const L = "\\u0600-\\u06FF"; // Arabic letters
const word = (list) => new RegExp(`(?<![${L}])(${list.join("|")})(?![${L}])`, "g");
const RULES = [
  ["missing hamza", word(["الى", "اذا", "انت", "ان", "اي", "اول", "اكثر", "اقل", "افضل", "اسرع", "انشاء", "امكان", "ايضا", "الان", "لان", "احد", "اخرى"])],
  ["ي written for ى", word(["علي", "إلي", "الي", "حتي", "متي"])],
  ["colloquial word", word(["دلوقتي", "عشان", "بتاع", "ازاي", "كده", "مش", "اللي", "السوشيال", "الميديا"])],
  ["Latin comma, semicolon or question mark", new RegExp(`[${L}]\\s*[,;?]`, "g")],
  ["space before punctuation", new RegExp(`[${L}]\\s+[،؛؟.:!]`, "g")],
  ["double space", / {2,}/g],
  ["tatweel", /ـ/g],
];

// String literals ("…" or `…` without ${}), with the key in front of them if there is one.
const LITERAL = /(?:(\w+)\s*:\s*)?(?:"((?:[^"\\\n]|\\.)*)"|`([^`$]*)`)/g;

const findings = [];
let checked = 0;

for (const { file, from, to } of SOURCES) {
  const text = readFileSync(file, "utf8");
  const start = from ? text.search(from) : 0;
  const end = to ? text.slice(start).search(to) + start : text.length;
  if (start < 0 || end < start) {
    findings.push(`${file}: couldn't find the Arabic section`);
    continue;
  }
  const lineAt = (i) => text.slice(0, i).split("\n").length;
  const section = text.slice(start, end);
  for (const m of section.matchAll(LITERAL)) {
    const [, key, dq, tq] = m;
    const value = dq ?? tq ?? "";
    const line = lineAt(start + m.index);
    if (/^\s*import\b/.test(text.split("\n")[line - 1]) || (key && SKIP_KEYS.has(key)) || !value.trim()) continue;
    checked++;
    const where = `${file}:${line}`;
    const quote = value.length > 90 ? `${value.slice(0, 90)}…` : value;

    // every Latin word on an Arabic page should be a name we expect
    const latin = (value.replace(/\S+@\S+/g, "").match(/[A-Za-z][A-Za-z0-9.]*/g) ?? []).map((w) => w.replace(/\.$/, ""));
    const stray = latin.filter((w) => !ALLOWED_LATIN.has(w.toLowerCase()));
    if (stray.length) findings.push(`${where} [English left in] ${stray.join(", ")}: "${quote}"`);

    if (!new RegExp(`[${L}]`).test(value)) continue;
    for (const [name, rx] of RULES) {
      for (const hit of value.matchAll(rx)) {
        const around = value.slice(Math.max(0, hit.index - 20), hit.index + hit[0].length + 20);
        findings.push(`${where} [${name}] …${around}…`);
      }
    }
    if ((value.match(/«/g) ?? []).length !== (value.match(/»/g) ?? []).length) {
      findings.push(`${where} [unbalanced «»] "${quote}"`);
    }
  }
}

if (findings.length) {
  console.error(findings.join("\n"));
  console.error(`\n✗ Arabic copy: ${findings.length} problem(s) in ${checked} strings.`);
  process.exit(1);
}
console.log(`✓ Arabic copy: ${checked} strings checked, no problems found.`);
