import type { StaticImageData } from "next/image";

import type { Locale } from "@/i18n/config";
import type { WorkSlug } from "@/content/work-slugs";
import financeMobile from "@/assets/work/mo-finance-os-mobile.webp";
import financeShot from "@/assets/work/mo-finance-os.webp";
import estateMobile from "@/assets/work/real-estate-installments-mobile.webp";
import estateShot from "@/assets/work/real-estate-installments.webp";
import youtubeShot from "@/assets/work/n8n-youtube-comment-assistant.webp";
import salesMobile from "@/assets/work/sales-invoicing-mobile.webp";
import salesShot from "@/assets/work/sales-invoicing.webp";

/*
 * Case studies for the Work page, in both languages.
 * Only what the founder confirmed or what the screenshots show. No invented metrics or results.
 * Figures, names and emails in the screenshots are blurred on purpose.
 */

export interface Project {
  /** URL segment of the project's own page, e.g. /work/finance. Must be listed in work-slugs.ts. */
  slug: WorkSlug;
  category: string;
  name: string;
  /** One line: what the system is. */
  oneLiner: string;
  /** Who it was built for, when we can say. */
  client?: string;
  problem: string;
  built: string;
  capabilities: string[];
  /** How data moves through the system, shown as a chip row. */
  flow?: string[];
  /** Omitted when the stack isn't confirmed. */
  tech?: string[];
  /** Interface languages, as stated in the capabilities list. */
  languages: string;
  image: StaticImageData;
  /** A readable detail crop of the same screen, shown on phones instead of the full dashboard. */
  mobileImage: StaticImageData;
  imageAlt: string;
}

export interface WorkPage {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  lead: string;
  blurNote: string;
  jumpTo: string;
  clientLabel: string;
  problemLabel: string;
  builtLabel: string;
  capabilitiesLabel: string;
  flowLabel: string;
  techLabel: string;
  zoomHint: string;
  closeLabel: string;
  automationJump: string;
  /** Link from a project on the Work page to its own page. */
  readCaseStudy: string;
  /** Link from a project page back to the Work page. */
  allWork: string;
  /** Label above the link to the following project. */
  nextProject: string;
  /** Eyebrow on a project page, before its number. */
  caseStudyLabel: string;
  /** The project's field, in the facts row of a project page. */
  fieldLabel: string;
  /** Label for the interface languages in the facts row. */
  languagesLabel: string;
  projects: Project[];
  /** A smaller automation example shown after the three projects. */
  automation: {
    eyebrow: string;
    name: string;
    category: string;
    body: string;
    flow: string[];
    tech: string[];
    image: StaticImageData;
    imageAlt: string;
  };
  cta: { title: string; titleAccent: string; lead: string; secondary: string };
}

const en: WorkPage = {
  metaTitle: "Work",
  metaDescription:
    "Real systems built by Afaq AI: a real estate installment manager, a multi-company sales and invoicing platform, and a personal finance operating system.",
  eyebrow: "Selected work",
  title: "Three systems,",
  titleAccent: "three wider horizons.",
  lead: "Each one started as a process held together by spreadsheets, memory or habit. Here is what we built, shown with its real screens.",
  blurNote: "Figures, names and emails in the screenshots are blurred to protect the people who use them.",
  jumpTo: "Projects",
  clientLabel: "Client",
  problemLabel: "The problem",
  builtLabel: "What we built",
  capabilitiesLabel: "Inside the system",
  flowLabel: "How the data flows",
  techLabel: "Built with",
  zoomHint: "View full screen",
  closeLabel: "Close",
  automationJump: "Plus: an n8n automation",
  readCaseStudy: "Read the case study",
  allWork: "All work",
  nextProject: "Next project",
  caseStudyLabel: "Case study",
  fieldLabel: "Field",
  languagesLabel: "Interface",
  projects: [
    {
      slug: "real-estate",
      category: "Business software · Real estate",
      name: "Real Estate Installment Management",
      oneLiner: "Buildings, owners, contracts and every installment, in one place.",
      client: "Dr. Mohamed Elshiwi",
      problem:
        "Apartments, owners, contracts and installment payments lived across scattered Excel files. Knowing where a single unit stood meant opening several sheets and trusting they agreed.",
      built:
        "A database-backed system that links every record, from the building down to each payment. We designed it as an operational dashboard, not a bare admin panel, and made it Arabic first.",
      capabilities: [
        "Dashboard with key figures and a collection-progress ring",
        "Buildings, apartments, owners and contracts, all linked",
        "Installment schedules generated in one step",
        "Customer payments, project payments and payment parties",
        "A suggested next action, such as reviewing overdue installments",
        "Daily summary: collected today, due today, overdue, due within 7 days",
        "Quick actions: add an apartment or owner, new contract, record a payment",
        "Search by apartment, owner, phone number or building",
        "Excel import and export, backup and restore",
        "Admin sign-in and an Arabic-first dark interface",
      ],
      flow: ["Buildings", "Apartments", "Owners", "Contracts", "Installments", "Payments"],
      tech: ["Django", "Python", "SQLite", "HTML/CSS/JS"],
      image: estateShot,
      mobileImage: estateMobile,
      languages: "Arabic first",
      imageAlt:
        "The installment management dashboard in Arabic: quick actions, a collection-progress ring and today's summary, with amounts blurred.",
    },
    {
      slug: "sales",
      category: "Multi-company SaaS · Sales",
      name: "Sales & Invoicing Platform",
      oneLiner: "Quotations, invoices, sales and payments for several companies, from one account.",
      problem:
        "Quotations, invoices, sales and collections are easy to lose track of when they live in separate tools, and harder still across more than one company. The owner needs to see, at a glance, who still owes what.",
      built:
        "A multi-company SaaS platform with a company switcher, so each company keeps its own customers, products and numbers. The dashboard answers the questions that matter each month: what we sold, what we collected and what is still due.",
      capabilities: [
        "Quotations, invoices, sales and payments",
        "Companies, customers and account statements",
        "Products, team members and subscription plans",
        "Switching between companies from the top bar",
        "Dashboard: sales count, total sales, total payments, amount due",
        "Sales against collection over the last 6 months",
        "Top debts, top customers and payment methods",
        "A “this month” filter across the dashboard",
        "Arabic and English, with dark mode",
      ],
      image: salesShot,
      mobileImage: salesMobile,
      languages: "Arabic and English",
      imageAlt:
        "The sales dashboard in Arabic: sales, payments and amount due, and a six-month sales-versus-collection chart, with the company name and figures blurred.",
    },
    {
      slug: "finance",
      category: "Financial intelligence",
      name: "MO Finance OS",
      oneLiner: "A personal financial operating system built on a ledger, not a budget sheet.",
      problem:
        "Bank balances don't tell the whole story. A card statement can mix your own spending with expenses you carried for other people, and a shortfall shows up only when a due date arrives.",
      built:
        "A ledger-based system that reads bank statements, reconciles them and turns them into one financial picture: what you really owe, what's coming in, and what could hurt you in the next 30 days. It was built in phases, with an automated test suite behind the numbers.",
      capabilities: [
        "Parses CIB and BDC statements: periods, closing balances, due dates, minimum payments",
        "Reconciles the statement balance against your real share and other people's exposure",
        "Alert engine, credit guard, cash-flow guardian and spending-leak detector",
        "A 30-day summary: cash on hand, confirmed income, dues and the gap",
        "A daily spending limit, split by category",
        "Spending analytics with weekly and monthly reviews",
        "Scenario engine, debt strategy engine and close-the-gap planning",
        "Accounts, cards, people, receivables, recurring payments, savings circles and gold",
        "Arabic and English interface",
      ],
      flow: ["Data", "Reconciliation", "Analysis", "Risk detection", "Planning", "Action"],
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "SQLite", "Vitest"],
      image: financeShot,
      mobileImage: financeMobile,
      languages: "Arabic and English",
      imageAlt:
        "The MO Finance OS overview in Arabic: a salary check-in, a 30-day summary, a daily spending limit and a safe-to-spend figure, with every amount blurred.",
    },
  ],
  automation: {
    eyebrow: "We build automations, too",
    name: "YouTube AI Comment Assistant",
    category: "AI automation · n8n",
    body: "An n8n workflow that runs every five minutes. It pulls comments from the YouTube Data API, checks each one against a condition, looks up its video for context, and lets an AI agent write a reply that is posted back to YouTube.",
    flow: ["Every 5 minutes", "YouTube Data API", "Filter", "Video details", "AI agent", "Reply"],
    tech: ["n8n", "OpenRouter", "YouTube Data API"],
    image: youtubeShot,
    imageAlt: "The n8n canvas: a five-minute schedule, requests to the YouTube API, a filter, a video lookup, an AI agent on an OpenRouter chat model, and a YouTube reply step.",
  },
  cta: {
    title: "Your process could be",
    titleAccent: "the next system here.",
    lead: "Show us the spreadsheet, the inbox or the habit that holds your work together. We'll tell you honestly what a system would change.",
    secondary: "Send a message",
  },
};

const ar: WorkPage = {
  metaTitle: "أعمالنا",
  metaDescription:
    "أنظمة حقيقية من بناء آفاق AI: نظام لإدارة العقارات والأقساط، ومنصة مبيعات وفواتير متعددة الشركات، ونظام تشغيل مالي شخصي.",
  eyebrow: "من أعمالنا",
  title: "ثلاثة أنظمة،",
  titleAccent: "وثلاثة آفاق أوسع.",
  lead: "بدأ كل منها بعملية تقوم على جداول متفرقة أو على الذاكرة والعادة. هذا ما بنيناه، بشاشاته الحقيقية.",
  blurNote: "الأرقام والأسماء والبريد الإلكتروني في الصور مموّهة حفاظًا على خصوصية مستخدميها.",
  jumpTo: "المشاريع",
  clientLabel: "العميل",
  problemLabel: "المشكلة",
  builtLabel: "ما بنيناه",
  capabilitiesLabel: "داخل النظام",
  flowLabel: "مسار البيانات",
  techLabel: "التقنيات",
  zoomHint: "عرض بالحجم الكامل",
  closeLabel: "إغلاق",
  automationJump: "وأيضًا: أتمتة على n8n",
  readCaseStudy: "اقرأ دراسة الحالة",
  allWork: "كل الأعمال",
  nextProject: "المشروع التالي",
  caseStudyLabel: "دراسة حالة",
  fieldLabel: "المجال",
  languagesLabel: "الواجهة",
  projects: [
    {
      slug: "real-estate",
      category: "برمجيات أعمال · عقارات",
      name: "نظام إدارة العقارات والأقساط",
      oneLiner: "المباني والملّاك والعقود وكل قسط، في مكان واحد.",
      client: "د. محمد الشيوي",
      problem:
        "كانت الشقق والملّاك والعقود ودفعات الأقساط موزعة على ملفات Excel متفرقة. ولمعرفة وضع شقة واحدة كان عليك أن تفتح أكثر من ملف، وأن تثق بأنها متطابقة.",
      built:
        "نظام مبني على قاعدة بيانات يربط كل سجل، من المبنى حتى آخر دفعة. صمّمناه لوحةَ تشغيل حقيقية لا لوحة إدارة شكلية، وبالعربية أولًا.",
      capabilities: [
        "لوحة تحكم بالأرقام الأساسية ومؤشر دائري لنسبة التحصيل",
        "المباني والشقق والملّاك والعقود، مرتبطة بعضها ببعض",
        "توليد جدول الأقساط بخطوة واحدة",
        "دفعات العملاء، ومدفوعات المشاريع، وجهات الدفع",
        "إجراء تالٍ مقترح، مثل مراجعة الأقساط المتأخرة",
        "ملخص يومي: المحصّل اليوم، والمستحق اليوم، والمتأخرات، وما يستحق خلال 7 أيام",
        "إجراءات سريعة: إضافة شقة أو مالك، وعقد جديد، وتسجيل دفعة",
        "بحث بالشقة أو المالك أو رقم الهاتف أو المبنى",
        "استيراد وتصدير Excel، ونسخ احتياطي واستعادة",
        "تسجيل دخول للمسؤول وواجهة داكنة بالعربية أولًا",
      ],
      flow: ["المباني", "الشقق", "الملّاك", "العقود", "الأقساط", "الدفعات"],
      tech: ["Django", "Python", "SQLite", "HTML/CSS/JS"],
      image: estateShot,
      mobileImage: estateMobile,
      languages: "العربية أولًا",
      imageAlt: "لوحة تحكم نظام الأقساط بالعربية: إجراءات سريعة ومؤشر التحصيل وملخص اليوم، مع تمويه المبالغ.",
    },
    {
      slug: "sales",
      category: "منصة SaaS متعددة الشركات · مبيعات",
      name: "منصة المبيعات والفواتير",
      oneLiner: "عروض الأسعار والفواتير والمبيعات والمدفوعات لأكثر من شركة، من حساب واحد.",
      problem:
        "يسهل أن تضيع عروض الأسعار والفواتير والمبيعات والتحصيل حين تتوزع على أدوات منفصلة، ويصعب الأمر أكثر مع أكثر من شركة. وصاحب العمل يحتاج إلى أن يرى بنظرة واحدة من لا تزال عليه مستحقات.",
      built:
        "منصة SaaS متعددة الشركات تتيح التنقل بينها، وتحتفظ كل شركة بعملائها ومنتجاتها وأرقامها. وتجيب لوحة التحكم عن أسئلة كل شهر: كم بعنا، وكم حصّلنا، وكم بقي مستحقًا.",
      capabilities: [
        "عروض الأسعار والفواتير والمبيعات والمدفوعات",
        "الشركات والعملاء وكشوف الحساب",
        "المنتجات والفريق وخطط الاشتراك",
        "التنقل بين الشركات من الشريط العلوي",
        "لوحة تحكم: عدد عمليات البيع، وإجمالي المبيعات، وإجمالي المدفوعات، والمبلغ المستحق",
        "المبيعات مقابل التحصيل لآخر 6 أشهر",
        "أعلى المديونيات، وأفضل العملاء، وطرق الدفع",
        "تصفية «هذا الشهر» في لوحة التحكم",
        "بالعربية والإنجليزية، مع الوضع الداكن",
      ],
      image: salesShot,
      mobileImage: salesMobile,
      languages: "العربية والإنجليزية",
      imageAlt:
        "لوحة تحكم المبيعات بالعربية: المبيعات والمدفوعات والمبلغ المستحق ورسم المبيعات مقابل التحصيل لستة أشهر، مع تمويه اسم الشركة والأرقام.",
    },
    {
      slug: "finance",
      category: "ذكاء مالي",
      name: "MO Finance OS",
      oneLiner: "نظام تشغيل مالي شخصي مبني على دفتر أستاذ، لا على جدول ميزانية.",
      problem:
        "رصيد البنك لا يحكي القصة كاملة. قد يخلط كشف البطاقة بين مصروفاتك ومصروفات دفعتها عن آخرين، ولا يظهر العجز إلا عندما يحلّ موعد السداد.",
      built:
        "نظام قائم على دفتر أستاذ يقرأ كشوف الحساب البنكية ويطابقها ويحوّلها إلى صورة مالية واحدة: ما عليك فعلًا، وما سيصلك، وما قد يضرّك خلال الثلاثين يومًا القادمة. وبُني على مراحل، مع اختبارات آلية تتحقق من الأرقام.",
      capabilities: [
        "قراءة كشوف CIB وBDC: الفترات، والرصيد الختامي، ومواعيد الاستحقاق، والحد الأدنى للسداد",
        "مطابقة رصيد الكشف مع نصيبك الفعلي وما يخص الآخرين",
        "محرك تنبيهات، وحارس للائتمان، وحارس للتدفق النقدي، وكاشف لتسرّب الإنفاق",
        "خلاصة 30 يومًا: النقد المتاح، والدخل المؤكد، والمستحقات، والعجز",
        "حد يومي للصرف مقسّم حسب الفئة",
        "تحليلات للإنفاق مع مراجعات أسبوعية وشهرية",
        "محرك سيناريوهات، ومحرك لاستراتيجية الديون، وخطة لسدّ العجز",
        "الحسابات والبطاقات والأشخاص والمستحقات والمدفوعات المتكررة والجمعيات والذهب",
        "واجهة بالعربية والإنجليزية",
      ],
      flow: ["البيانات", "المطابقة", "التحليل", "رصد المخاطر", "التخطيط", "التنفيذ"],
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "SQLite", "Vitest"],
      image: financeShot,
      mobileImage: financeMobile,
      languages: "العربية والإنجليزية",
      imageAlt:
        "نظرة عامة في MO Finance OS بالعربية: تسجيل المرتب وخلاصة 30 يومًا وحد الصرف اليومي والمبلغ الآمن للإنفاق، مع تمويه كل المبالغ.",
    },
  ],
  automation: {
    eyebrow: "ونبني الأتمتة أيضًا",
    name: "مساعد الرد على تعليقات يوتيوب",
    category: "أتمتة بالذكاء الاصطناعي · n8n",
    body: "مسار عمل على n8n يعمل كل خمس دقائق. يجلب التعليقات من YouTube Data API، ويفحص كل تعليق بشرط محدد، ويجلب بيانات الفيديو للسياق، ثم يكتب وكيل ذكاء اصطناعي ردًّا يُنشر على يوتيوب.",
    flow: ["كل 5 دقائق", "YouTube Data API", "تصفية", "بيانات الفيديو", "وكيل ذكاء اصطناعي", "الرد"],
    tech: ["n8n", "OpenRouter", "YouTube Data API"],
    image: youtubeShot,
    imageAlt: "مسار العمل في n8n: جدولة كل خمس دقائق، وطلبات إلى YouTube API، وتصفية، وجلب بيانات الفيديو، ووكيل ذكاء اصطناعي على نموذج OpenRouter، وخطوة الرد على يوتيوب.",
  },
  cta: {
    title: "قد تكون عمليتك",
    titleAccent: "النظام التالي هنا.",
    lead: "أرِنا الجدول أو صندوق البريد أو العادة التي يقوم عليها عملك، وسنخبرك بصدق ما الذي سيغيّره نظام حقيقي.",
    secondary: "أرسل رسالة",
  },
};

export const workContent: Record<Locale, WorkPage> = { en, ar };
