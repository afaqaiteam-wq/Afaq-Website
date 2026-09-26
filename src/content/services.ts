import type { Locale } from "@/i18n/config";

/*
 * Long-form content for the Services page, in both languages.
 * Tool names match the keys in components/home/hero/toolLogos.ts where a logo exists.
 */

export interface Service {
  /** URL anchor, e.g. /services#agents */
  slug: string;
  name: string;
  /** One line: what the service promises. */
  promise: string;
  overview: string;
  build: string[];
  outcomes: string[];
  tech: string[];
}

export interface ProcessStep {
  title: string;
  body: string;
}

export interface ServicesPage {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  lead: string;
  jumpTo: string;
  buildLabel: string;
  outcomesLabel: string;
  techLabel: string;
  services: Service[];
  process: { eyebrow: string; title: string; titleAccent: string; steps: ProcessStep[] };
  cta: { title: string; titleAccent: string; lead: string; secondary: string };
}

const en: ServicesPage = {
  metaTitle: "Services",
  metaDescription:
    "AI automation, AI agents, custom chatbots, web platforms, AI integrations and AI consulting from Afaq AI.",
  eyebrow: "Services",
  title: "Six ways we",
  titleAccent: "move your horizon.",
  lead: "Each service stands on its own. Together they form one system around your business.",
  jumpTo: "Jump to",
  buildLabel: "What we build",
  outcomesLabel: "What changes for you",
  techLabel: "Built with",
  services: [
    {
      slug: "automation",
      name: "AI Automation",
      promise: "Repetitive work, running on its own.",
      overview:
        "We find the repetitive, high-volume work inside your business and hand it to systems that don't tire. Not a script that breaks next month, but a pipeline you can watch, trust and change.",
      build: [
        "Workflow pipelines with retries and a full audit trail",
        "Document intake, extraction and routing without manual review",
        "CRM, billing and support automations that stay in sync",
        "A dashboard that shows every run and every failure",
      ],
      outcomes: ["Fewer manual errors", "Hours back every week", "The same result every time", "A clear record of what ran"],
      tech: ["n8n", "Python", "OpenAI", "Docker"],
    },
    {
      slug: "agents",
      name: "AI Agents",
      promise: "Agents that act, within the limits you set.",
      overview:
        "An agent is only useful when it is bounded, observable and safe. We build task-specific agents with scoped access to your tools, human checkpoints on anything that matters, and tests that catch mistakes before your customers do.",
      build: [
        "Goal-driven agents with scoped, permissioned tool access",
        "Multi-step reasoning with a trace of every action",
        "Human approval before consequential steps",
        "Evaluation suites that flag regressions early",
      ],
      outcomes: ["Tasks done end to end", "People in control where it counts", "Every step traceable", "Better with every evaluation"],
      tech: ["OpenAI", "Claude", "Python", "n8n"],
    },
    {
      slug: "chatbots",
      name: "Custom Chatbots",
      promise: "A front door that knows your business.",
      overview:
        "A chatbot is often the first conversation a customer has with you, so it should sound like you and know what you know. We ground every answer in your own content and design the handoff to a person as carefully as the chat itself.",
      build: [
        "Assistants grounded in your documents and policies",
        "Your tone of voice, with clear guardrails",
        "Handoff to your team with the full conversation attached",
        "Reports on what customers actually ask",
      ],
      outcomes: ["Answers at any hour", "Consistent, accurate replies", "Less load on your team", "Insight into your customers"],
      tech: ["OpenAI", "Claude", "Gemini", "Supabase"],
    },
    {
      slug: "web",
      name: "Web Platforms",
      promise: "Fast products, with AI built in, not bolted on.",
      overview:
        "We design and build websites and SaaS products that load fast, work for everyone and stay pleasant to change a year later, with AI woven into the experience where it helps.",
      build: [
        "Marketing sites and SaaS products on one design system",
        "Server-rendered, type-safe front ends",
        "AI features: search, assistants and generated content",
        "Analytics and performance checks from day one",
      ],
      outcomes: ["Fast on every device", "Accessible by default", "Easy to extend", "Measured from launch"],
      tech: ["Next.js", "Python", "Supabase", "Docker", "AWS"],
    },
    {
      slug: "integrations",
      name: "AI Integrations",
      promise: "Intelligence inside the systems you already run.",
      overview:
        "Most companies don't need a new platform. They need AI inside the tools they already use. We connect model providers to your stack with the routing, caching and fallbacks that keep cost and response times under control.",
      build: [
        "Model routing across providers, with automatic fallback",
        "Search over your existing databases and files",
        "Caching and budgets that keep spend predictable",
        "Monitoring of cost, speed and quality",
      ],
      outcomes: ["No platform switch", "No lock-in to one provider", "Costs you can predict", "Quality you can see"],
      tech: ["OpenAI", "Claude", "Gemini", "AWS"],
    },
    {
      slug: "consulting",
      name: "AI Consulting",
      promise: "Know what's worth building before you build it.",
      overview:
        "We look at where AI creates real leverage in your business, what it will cost and what it won't solve, then hand you a roadmap your team can carry out with or without us.",
      build: [
        "An opportunity map ranked by impact and effort",
        "Feasibility checks and provider comparisons",
        "A review of your data and how ready it is",
        "A phased roadmap with budget and team needs",
      ],
      outcomes: ["Clear priorities", "Lower-risk investment", "A plan your team owns", "Faster time to value"],
      tech: ["OpenAI", "Claude", "Python"],
    },
  ],
  process: {
    eyebrow: "How we work",
    title: "Every engagement,",
    titleAccent: "the same four steps.",
    steps: [
      { title: "Discovery", body: "We learn the business, sit with the process and measure where the time really goes." },
      { title: "Architecture", body: "We map the data, choose the tools and agree how success will be measured before building." },
      { title: "Build & iterate", body: "We ship in small pieces you can try, and adjust with you every week." },
      { title: "Launch & support", body: "We roll out with monitoring and a handover your team can own, and we stay close after." },
    ],
  },
  cta: {
    title: "Which one is",
    titleAccent: "your next horizon?",
    lead: "Tell us where you're stuck. We'll tell you honestly which service fits, or if none does.",
    secondary: "Send a message",
  },
};

const ar: ServicesPage = {
  metaTitle: "الخدمات",
  metaDescription:
    "أتمتة بالذكاء الاصطناعي، ووكلاء ذكاء اصطناعي، ومساعدات محادثة، ومنصات ويب، وتكاملات، واستشارات من آفاق AI.",
  eyebrow: "الخدمات",
  title: "ست طرق",
  titleAccent: "نمدّ بها أفقك.",
  lead: "كل خدمة قائمة بذاتها، ومعًا تصنع نظامًا واحدًا حول عملك.",
  jumpTo: "انتقل إلى",
  buildLabel: "ما نبنيه",
  outcomesLabel: "ما الذي يتغيّر لك",
  techLabel: "نبنيها بـ",
  services: [
    {
      slug: "automation",
      name: "الأتمتة بالذكاء الاصطناعي",
      promise: "المهام المتكررة تعمل وحدها.",
      overview:
        "نحدّد الأعمال المتكررة وكثيفة الحجم داخل شركتك، ونسلّمها لأنظمة لا تتعب. ليست نصًّا برمجيًّا يتعطّل الشهر القادم، بل مسار عمل تراقبه وتثق به وتعدّله بسهولة.",
      build: [
        "مسارات عمل بإعادة محاولة تلقائية وسجلّ كامل",
        "استقبال المستندات واستخراج بياناتها وتوجيهها دون مراجعة يدوية",
        "أتمتة لأنظمة العملاء والفواتير والدعم تبقى متزامنة",
        "لوحة متابعة تعرض كل تشغيل وكل خطأ",
      ],
      outcomes: ["أخطاء يدوية أقل", "ساعات تعود لفريقك كل أسبوع", "النتيجة نفسها في كل مرة", "سجلّ واضح لكل ما جرى"],
      tech: ["n8n", "Python", "OpenAI", "Docker"],
    },
    {
      slug: "agents",
      name: "وكلاء الذكاء الاصطناعي",
      promise: "وكلاء ينفّذون، ضمن الحدود التي تضعها.",
      overview:
        "لا يكون الوكيل مفيدًا إلا إذا كان محدود الصلاحيات، واضح الخطوات، وآمنًا. نبني وكلاء لمهام محددة، بصلاحيات مضبوطة على أدواتك، ونقاط موافقة بشرية على كل ما هو مهم، واختبارات تكتشف الأخطاء قبل أن يراها عملاؤك.",
      build: [
        "وكلاء موجّهون بأهداف، بصلاحيات محددة على الأدوات",
        "تفكير متعدد الخطوات مع أثر مسجّل لكل إجراء",
        "موافقة بشرية قبل الخطوات المؤثرة",
        "اختبارات تقييم تنبّه لأي تراجع مبكرًا",
      ],
      outcomes: ["مهام تُنجز من البداية للنهاية", "القرار لفريقك حيث يهم", "كل خطوة قابلة للتتبع", "يتحسّن مع كل تقييم"],
      tech: ["OpenAI", "Claude", "Python", "n8n"],
    },
    {
      slug: "chatbots",
      name: "مساعدات المحادثة",
      promise: "واجهة ترحيب تعرف عملك جيدًا.",
      overview:
        "غالبًا ما يكون مساعد المحادثة أول حديث بين عميلك وشركتك، لذا يجب أن يتحدث بأسلوبك ويعرف ما تعرفه. نبني كل إجابة على محتواك أنت، ونصمّم التحويل إلى موظف بنفس عناية المحادثة نفسها.",
      build: [
        "مساعدات مبنية على مستنداتك وسياساتك",
        "أسلوبك في الحديث، مع حدود واضحة",
        "تحويل إلى فريقك مع المحادثة كاملة",
        "تقارير عمّا يسأل عنه العملاء فعلًا",
      ],
      outcomes: ["إجابات في أي وقت", "ردود متسقة ودقيقة", "ضغط أقل على فريقك", "فهم أعمق لعملائك"],
      tech: ["OpenAI", "Claude", "Gemini", "Supabase"],
    },
    {
      slug: "web",
      name: "منصات الويب",
      promise: "منتجات سريعة، والذكاء الاصطناعي جزء منها لا إضافة عليها.",
      overview:
        "نصمّم ونبني مواقع ومنتجات SaaS سريعة التحميل، تناسب الجميع، ويسهل تطويرها حتى بعد عام، مع ذكاء اصطناعي مدمج في التجربة حيث يضيف قيمة.",
      build: [
        "مواقع تعريفية ومنتجات SaaS على نظام تصميم واحد",
        "واجهات سريعة وآمنة تُعرض من الخادم",
        "مزايا ذكية: بحث ومساعدات ومحتوى مولَّد",
        "تحليلات وقياس للأداء من اليوم الأول",
      ],
      outcomes: ["سرعة على كل جهاز", "سهولة وصول للجميع", "تطوير سهل مستقبلًا", "قياس منذ الإطلاق"],
      tech: ["Next.js", "Python", "Supabase", "Docker", "AWS"],
    },
    {
      slug: "integrations",
      name: "تكاملات الذكاء الاصطناعي",
      promise: "ذكاء داخل الأنظمة التي تعمل بها بالفعل.",
      overview:
        "معظم الشركات لا تحتاج إلى منصة جديدة، بل إلى ذكاء اصطناعي داخل أدواتها الحالية. نربط مزوّدي النماذج بأنظمتك، مع توجيه وتخزين مؤقت وبدائل احتياطية تُبقي التكلفة وسرعة الاستجابة تحت السيطرة.",
      build: [
        "توجيه بين مزوّدي النماذج مع بديل تلقائي",
        "بحث ذكي في قواعد بياناتك وملفاتك الحالية",
        "تخزين مؤقت وميزانيات تجعل الإنفاق متوقعًا",
        "مراقبة للتكلفة والسرعة والجودة",
      ],
      outcomes: ["دون تغيير منصتك", "دون الارتباط بمزوّد واحد", "تكلفة يمكن توقعها", "جودة يمكن قياسها"],
      tech: ["OpenAI", "Claude", "Gemini", "AWS"],
    },
    {
      slug: "consulting",
      name: "استشارات الذكاء الاصطناعي",
      promise: "اعرف ما يستحق البناء قبل أن تبنيه.",
      overview:
        "ندرس أين يصنع الذكاء الاصطناعي فرقًا حقيقيًّا في عملك، وكم سيكلّف، وما الذي لن يحلّه، ثم نسلّمك خارطة طريق ينفّذها فريقك معنا أو من دوننا.",
      build: [
        "خريطة فرص مرتبة حسب الأثر والجهد",
        "دراسات جدوى ومقارنة بين المزوّدين",
        "مراجعة لبياناتك ومدى جاهزيتها",
        "خارطة طريق على مراحل بالميزانية والفريق المطلوب",
      ],
      outcomes: ["أولويات واضحة", "استثمار بمخاطر أقل", "خطة يمتلكها فريقك", "قيمة أسرع"],
      tech: ["OpenAI", "Claude", "Python"],
    },
  ],
  process: {
    eyebrow: "كيف نعمل",
    title: "كل مشروع،",
    titleAccent: "بنفس الخطوات الأربع.",
    steps: [
      { title: "الاستكشاف", body: "نتعرّف على عملك، ونتابع العملية عن قرب، ونقيس أين يذهب الوقت فعلًا." },
      { title: "التصميم", body: "نرسم مسار البيانات، ونختار الأدوات، ونتفق على طريقة قياس النجاح قبل البناء." },
      { title: "البناء والتحسين", body: "نسلّم على دفعات صغيرة تجرّبها بنفسك، ونعدّل معك كل أسبوع." },
      { title: "الإطلاق والدعم", body: "نطلق مع أدوات مراقبة وتسليم يمتلكه فريقك، ونبقى قريبين بعدها." },
    ],
  },
  cta: {
    title: "أيها",
    titleAccent: "أفقك القادم؟",
    lead: "أخبرنا أين تتعثر، وسنخبرك بصدق أي خدمة تناسبك، أو إن لم تكن أيّها مناسبة.",
    secondary: "أرسل رسالة",
  },
};

export const servicesContent: Record<Locale, ServicesPage> = { en, ar };
