import type { StaticImageData } from "next/image";

import ghofran from "@/assets/team/ghofran-gharsallah.jpeg";
import mahmoud from "@/assets/team/mahmoud-ahmed.jpeg";
import alaa from "@/assets/team/mohamed-alaa.jpeg";
import ragab from "@/assets/team/mohamed-ragab.jpeg";
import saber from "@/assets/team/mohamed-saber.jpeg";
import mostafa from "@/assets/team/mostafa-aboeiwafa.jpeg";
import type { Locale } from "@/i18n/config";

/*
 * About page content in both languages. Bios are short and taken from what each person
 * supplied for the previous site; nothing about tenure or clients is added.
 */

export interface Person {
  name: string;
  role: string;
  line: string;
  photo: StaticImageData;
  founder?: boolean;
}

export interface AboutPage {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  story: string[];
  principles: { eyebrow: string; title: string; titleAccent: string; items: { title: string; body: string }[] };
  team: { eyebrow: string; title: string; titleAccent: string; people: Person[] };
  cta: { title: string; titleAccent: string; lead: string; secondary: string };
}

const en: AboutPage = {
  metaTitle: "About",
  metaDescription: "Afaq is Arabic for horizons. Meet the team building AI agents, automation and software at Afaq AI.",
  eyebrow: "About",
  title: "We're named after",
  titleAccent: "the horizon.",
  story: [
    "Afaq (آفاق) is Arabic for horizons: the line where what you can see meets what comes next.",
    "We build AI agents, automation and software that move that line for businesses. When the repetitive work runs on its own, a team has room to look further.",
  ],
  principles: {
    eyebrow: "What we believe",
    title: "Four lines",
    titleAccent: "we don't cross.",
    items: [
      { title: "Real work, not demos.", body: "We build for the load your business carries every day, not for a slide." },
      { title: "People stay in control.", body: "AI takes the repetitive steps. The decisions that matter stay with your team." },
      { title: "Yours to own.", body: "Clear documentation and a full handover, so you're never tied to us." },
      { title: "Honest about the limits.", body: "If AI isn't the right answer, we'll tell you before you spend anything." },
    ],
  },
  team: {
    eyebrow: "The team",
    title: "The people",
    titleAccent: "behind the orbit.",
    people: [
      { name: "Mohamed Saber", role: "Founder & CEO", line: "Sets the direction and ties every project to a real business result.", photo: saber, founder: true },
      { name: "Mostafa Aboelwafa", role: "Co-CEO & Co-Founder", line: "Connects engineering, business and AI, and leads our partnerships.", photo: mostafa, founder: true },
      { name: "Ghofran Gharsallah", role: "CTO & Lead Full-Stack Developer", line: "Leads the engineering team and the architecture behind what we ship.", photo: ghofran },
      { name: "Mahmoud Ahmed", role: "AI Automation Engineer", line: "Builds automations with AI, n8n and APIs, from design to deployment.", photo: mahmoud },
      { name: "Mohamed Alaa", role: "Growth & Content Lead", line: "Shapes the brand through content, video and design.", photo: alaa },
      { name: "Mohamed Ragab", role: "Growth & Content Lead", line: "Runs the content strategy and campaigns that grow the brand.", photo: ragab },
    ],
  },
  cta: {
    title: "Let's look further,",
    titleAccent: "together.",
    lead: "Book a call and tell us about the process you'd like to change.",
    secondary: "Send a message",
  },
};

const ar: AboutPage = {
  metaTitle: "من نحن",
  metaDescription: "آفاق جمعُ أفق. تعرّف على الفريق الذي يبني وكلاء الذكاء الاصطناعي والأتمتة والبرمجيات في آفاق AI.",
  eyebrow: "من نحن",
  title: "اسمنا مستوحى",
  titleAccent: "من الأفق.",
  story: [
    "آفاق جمعُ أُفُق: الخط الذي يلتقي عنده ما تراه بما هو قادم.",
    "نبني وكلاء ذكاء اصطناعي وأنظمة أتمتة وبرمجيات تدفع هذا الخط أبعد للشركات. حين تعمل المهام المتكررة وحدها، يجد الفريق مساحة ليرى أبعد.",
  ],
  principles: {
    eyebrow: "ما نؤمن به",
    title: "أربعة خطوط",
    titleAccent: "لا نتجاوزها.",
    items: [
      { title: "عمل حقيقي، لا عروض تجريبية.", body: "نبني لحجم العمل الذي تحمله شركتك كل يوم، لا لشريحة في عرض تقديمي." },
      { title: "القرار يبقى لفريقك.", body: "يتولّى الذكاء الاصطناعي الخطوات المتكررة، وتبقى القرارات المهمة بيد فريقك." },
      { title: "ملكك بالكامل.", body: "توثيق واضح وتسليم كامل، فلا تبقى مرتبطًا بنا رغمًا عنك." },
      { title: "صراحة بشأن الحدود.", body: "إن لم يكن الذكاء الاصطناعي هو الحل المناسب، سنخبرك قبل أن تنفق شيئًا." },
    ],
  },
  team: {
    eyebrow: "الفريق",
    title: "الأشخاص",
    titleAccent: "خلف المدار.",
    people: [
      { name: "محمد صابر", role: "المؤسس والرئيس التنفيذي", line: "يحدّد الاتجاه، ويربط كل مشروع بنتيجة حقيقية للعمل.", photo: saber, founder: true },
      { name: "مصطفى أبو الوفا", role: "الرئيس التنفيذي المشارك والشريك المؤسس", line: "يربط الهندسة بالأعمال والذكاء الاصطناعي، ويقود الشراكات.", photo: mostafa, founder: true },
      { name: "غفران غرس الله", role: "المديرة التقنية ورئيسة فريق التطوير", line: "تقود فريق الهندسة والبنية التقنية لكل ما نسلّمه.", photo: ghofran },
      { name: "محمود أحمد", role: "مهندس أتمتة بالذكاء الاصطناعي", line: "يبني أنظمة الأتمتة بالذكاء الاصطناعي وn8n والواجهات البرمجية، من التصميم حتى التشغيل.", photo: mahmoud },
      { name: "محمد علاء", role: "قائد النمو والمحتوى", line: "يصنع حضور العلامة عبر المحتوى والفيديو والتصميم.", photo: alaa },
      { name: "محمد رجب", role: "قائد النمو والمحتوى", line: "يقود استراتيجية المحتوى والحملات التي تنمّي العلامة.", photo: ragab },
    ],
  },
  cta: {
    title: "لنرَ أبعد،",
    titleAccent: "معًا.",
    lead: "احجز مكالمة وحدّثنا عن العملية التي تريد تغييرها.",
    secondary: "أرسل رسالة",
  },
};

export const aboutContent: Record<Locale, AboutPage> = { en, ar };
