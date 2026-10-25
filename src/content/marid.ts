import type { Locale } from "@/i18n/config";

/*
 * The Marid page in both languages. Marid is our own voice assistant, still in development.
 * Every ability below exists in its code today; nothing personal about the people who use it is shown.
 * What it says and what you say to it stay in Egyptian Arabic on both pages, as Marid hears and speaks it.
 * Points about Siri and Bixby come only from Apple's and Samsung's own pages (see compare.sources).
 */

/** One exchange in the hero's demo. */
export interface Turn {
  /** What you say, in Egyptian Arabic. */
  say: string;
  /** Marid's spoken answer, as the app says it, when it answers in words. */
  reply?: string;
  /** What happens on the phone, in the page's language, when the answer is an action. */
  done?: string;
  /** English glosses, on the English page only. */
  sayGloss?: string;
  replyGloss?: string;
}

export interface MaridPage {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  badge: string;
  title: string;
  titleAccent: string;
  lead: string;
  goal: string;
  abilitiesJump: string;
  compareJump: string;
  orbAlt: string;
  demo: { you: string; marid: string; turns: Turn[] };
  examples: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    groups: { name: string; items: { say: string; gloss?: string; does: string }[] }[];
  };
  abilities: { eyebrow: string; title: string; titleAccent: string; items: { title: string; body: string }[] };
  steps: { eyebrow: string; title: string; titleAccent: string; items: { name: string; body: string }[] };
  compare: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    labels: { good: string; stops: string; takes: string; fixes: string };
    rivals: { name: string; good: string[]; stops: string[] }[];
    marid: { name: string; takes: string[]; fixes: string[] };
    table: { caption: string; head: string[]; rows: string[][] };
    honest: string;
    note: string;
    sourcesLabel: string;
    sources: { label: string; url: string }[];
  };
  safety: { eyebrow: string; title: string; titleAccent: string; items: { title: string; body: string }[] };
  status: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string[];
    techLabel: string;
    tech: string[];
    appName: string;
    logoAlt: string;
  };
  cta: { title: string; titleAccent: string; lead: string; secondary: string };
}

const SOURCES = {
  apple: "https://www.apple.com/ios/feature-availability/",
  samsung: "https://news.samsung.com/global/samsung-expands-language-support-across-ai-experiences-on-galaxy",
};

// What you say and what Marid answers are the same on both pages; only the glosses and actions differ.
const SAY = {
  wake: "يا مارد",
  greet: "أنا هنا، اؤمرني. إزاي أقدر أساعدك؟",
  call: "رن على مصطفى",
  callAsk: "أرن على مصطفى؟",
  light: "ولّع الكشاف",
  remind: "فكّرني بكرة الساعة 5 أكلّم مصطفى",
  missed: "فاتني إيه؟",
};

const en: MaridPage = {
  metaTitle: "Marid",
  metaDescription:
    "Marid is the voice assistant we're building at Afaq AI. It understands Egyptian Arabic, answers in an Egyptian voice and gets things done on your Android phone.",
  eyebrow: "Our new project",
  badge: "In development",
  title: "Marid.",
  titleAccent: "An assistant that speaks your language.",
  lead: "A voice assistant for Android that understands Egyptian Arabic, answers in an Egyptian voice and gets things done on your phone: calls, messages, settings, reminders, even taps and typing inside other apps.",
  goal: "We're building it to go further than Siri and Bixby: keep what they do well, and fix where they stop for people who speak Egyptian Arabic.",
  abilitiesJump: "See what it does",
  compareJump: "How it compares",
  orbAlt:
    "Marid as he looks in the app: a dark glass orb full of stars with two glowing crescent eyes, golden smoke and rings of gold and blue.",
  demo: {
    you: "You",
    marid: "Marid",
    turns: [
      { say: SAY.wake, sayGloss: "Hey Marid", reply: SAY.greet, replyGloss: "I'm here. What can I do for you?" },
      { say: SAY.call, sayGloss: "Call Mostafa", reply: SAY.callAsk, replyGloss: "Call Mostafa?" },
      { say: SAY.light, sayGloss: "Turn on the flashlight", done: "Flashlight on" },
      { say: SAY.remind, sayGloss: "Remind me tomorrow at 5 to call Mostafa", done: "Reminder set: tomorrow, 5:00 PM" },
      { say: SAY.missed, sayGloss: "What did I miss?", done: "A short digest of your notifications" },
    ],
  },
  examples: {
    eyebrow: "Just say it",
    title: "Talk the way you talk.",
    titleAccent: "It understands.",
    lead: "No commands to memorize. These are real lines Marid understands today, in Egyptian Arabic as people say them.",
    groups: [
      {
        name: "Your phone",
        items: [
          { say: "افتح واتساب", gloss: "Open WhatsApp", does: "Opens the app" },
          { say: SAY.light, gloss: "Turn on the flashlight", does: "Turns it on" },
          { say: "تايمر 10 دقايق", gloss: "A 10-minute timer", does: "Sets the timer" },
        ],
      },
      {
        name: "Calls and messages",
        items: [
          { say: SAY.call, gloss: "Call Mostafa", does: "Asks first, then calls" },
          { say: "رد على مصطفى وقوله جاي", gloss: "Reply to Mostafa: I'm coming", does: "Answers his latest notification, after your yes" },
          { say: SAY.missed, gloss: "What did I miss?", does: "Reads a digest of the notifications you missed" },
        ],
      },
      {
        name: "Your day",
        items: [
          { say: "المطلوب مني إيه؟", gloss: "What do I need to do?", does: "Tells you what's due now, and logs it once it's done" },
          { say: "صباح الخير", gloss: "Good morning", does: "The morning brief: what matters today, the weather and three headlines" },
          { say: SAY.remind, gloss: "Remind me tomorrow at 5 to call Mostafa", does: "Sets the reminder" },
        ],
      },
      {
        name: "Around you",
        items: [
          { say: "شوف دي", gloss: "Look at this", does: "Opens the camera and answers about the photo" },
          { say: "إيه اللي على الشاشة؟", gloss: "What's on the screen?", does: "Reads the app you have open" },
          { say: "يلا نتكلم ألماني", gloss: "Let's speak German", does: "A conversation to practice German, corrected in Arabic" },
        ],
      },
    ],
  },
  abilities: {
    eyebrow: "What it does",
    title: "More than answers.",
    titleAccent: "It gets things done.",
    items: [
      {
        title: "Wakes to its name",
        body: "Say «يا مارد» even with the screen locked, or use the side key, the widget or the quick-settings tile. Then keep talking: when it asks you something, it listens for your answer without being called again.",
      },
      {
        title: "Understands Egyptian, answers in it",
        body: "It weighs the phone's best guesses of what you said and picks the likely meaning, so you rarely repeat yourself. It starts speaking while the rest of the reply is still being written, in an Egyptian voice generated on our own GPU.",
      },
      {
        title: "Runs your phone",
        body: "Opens apps, sets timers and alarms, turns on the flashlight or silent mode, controls the music, searches the web and opens directions.",
      },
      {
        title: "Calls and messages, after a yes",
        body: "Calls a contact or prepares a WhatsApp message by name. Calls wait for your yes, and messages open ready for you to press send yourself.",
      },
      {
        title: "“What did I miss?”",
        body: "Reads you a short digest of the notifications you missed, leaving out codes and amounts, and can answer one of them for you once you confirm.",
      },
      {
        title: "Marid's hands",
        body: "When no shortcut covers a task, it taps, types and scrolls in other apps one step at a time, and stops to ask before any step that sends, posts, buys or deletes.",
      },
      {
        title: "Knows your day",
        body: "What's due now, a morning brief, prayer times, reminders set by voice and your phone's calendar. When your work hours start, it offers to silence the phone.",
      },
      {
        title: "Alarms that don't slip",
        body: "Important reminders are kept on the phone itself, so they ring without a connection, and even after a restart, before you unlock it.",
      },
      {
        title: "Remembers, sees, practices",
        body: "Tell it something about yourself and it remembers; ask it to forget and it does. Show it a photo or ask what's on your screen, or practice German or English in conversation.",
      },
    ],
  },
  steps: {
    eyebrow: "How a reply works",
    title: "Five steps,",
    titleAccent: "in a few seconds.",
    items: [
      { name: "Wake", body: "«يا مارد», the side key or the widget. The wake word runs on the phone itself." },
      { name: "Listen", body: "The phone hears you and sends its best guesses of what you said." },
      { name: "Understand", body: "Clear commands are handled at once, without AI. Everything else goes to Claude, with your day and what it remembers about you." },
      { name: "Act", body: "The server decides and the phone does it: a call, a setting, a reminder." },
      { name: "Speak", body: "It starts answering in an Egyptian voice while the rest is still being written." },
    ],
  },
  compare: {
    eyebrow: "Siri, Bixby and Marid",
    title: "The best of both,",
    titleAccent: "and a fix for where they stop.",
    lead: "Siri and Bixby are mature assistants from two of the biggest phone makers. Here is what each does well, where it stops for someone who speaks Egyptian Arabic, and what Marid does about it. Every point about them comes from Apple's and Samsung's own pages.",
    labels: { good: "Does well", stops: "Where it stops", takes: "What Marid takes", fixes: "What Marid adds" },
    rivals: [
      {
        name: "Siri",
        good: [
          "Handles many requests on the device itself, in Arabic too, even offline.",
          "Built into Apple's devices, from the iPhone to the Mac.",
        ],
        stops: [
          "Apple lists Siri in Arabic for Saudi Arabia and the UAE; Egypt isn't on its list.",
          "Apple Intelligence isn't available in Arabic.",
          "Works only on Apple devices.",
        ],
      },
      {
        name: "Bixby",
        good: [
          "A device agent: change settings in your own words, without knowing the setting's name.",
          "Built into Samsung Galaxy phones.",
        ],
        stops: [
          "No Arabic among its 12 languages.",
          "Needs a Samsung Account and a data connection.",
          "Works only on Galaxy devices.",
        ],
      },
    ],
    marid: {
      name: "Marid",
      takes: [
        "From Siri: keep what's private on the phone. Your contacts never leave it.",
        "From Bixby: run the phone in your own words, from settings and apps to timers and alarms.",
      ],
      fixes: [
        "Egyptian Arabic first, answered in an Egyptian voice.",
        "Works inside other apps when there's no shortcut, and asks before any step that matters.",
        "Remembers what you tell it, and speaks first when it can help.",
        "Built for Android, not for one brand.",
      ],
    },
    table: {
      caption: "At a glance",
      head: ["", "Siri", "Bixby", "Marid"],
      rows: [
        ["Egyptian Arabic", "Arabic for Saudi Arabia and the UAE", "No Arabic", "Built for it"],
        ["Runs on", "Apple devices", "Samsung Galaxy devices", "Android phones"],
        ["Without a connection", "Many requests on the device", "Needs a data connection", "Reminders and alarms only"],
      ],
    },
    honest: "Honestly: Siri and Bixby are finished products in many languages. Marid is new, runs only on Android, and is still in development.",
    note: "Checked in October 2026 against Apple's iOS feature availability page and Samsung's announcement of October 14, 2026. Siri is a trademark of Apple Inc. and Bixby a trademark of Samsung Electronics. Marid isn't affiliated with either.",
    sourcesLabel: "Sources",
    sources: [
      { label: "Apple: iOS feature availability", url: SOURCES.apple },
      { label: "Samsung: language support, October 14, 2026", url: SOURCES.samsung },
    ],
  },
  safety: {
    eyebrow: "Safe by design",
    title: "Powerful,",
    titleAccent: "within clear limits.",
    items: [
      { title: "Your contacts stay on your phone", body: "Marid only hears the name. The phone itself matches it against your contacts." },
      { title: "A yes before calls and replies", body: "It tells you who it will call or what it will send, and waits for your answer." },
      { title: "No money, no deleting, no posting", body: "Payments, money transfers, deleting and public posts have no action at all." },
      { title: "Banking apps are off limits", body: "Its hands stop at banking and wallet apps, and never read password fields." },
      { title: "It forgets on purpose", body: "It never keeps money amounts in its memory, stores no notification digests, and deletes voice recordings after 30 days." },
    ],
  },
  status: {
    eyebrow: "Where it stands",
    title: "In development,",
    titleAccent: "in daily use.",
    body: [
      "Marid runs every day on an Android phone. Its brain is Claude, its wake word and alarms live on the phone, and its Egyptian voice runs on our own GPU.",
      "For now it needs a connection to its server to think; reminders and alarms work without one. It isn't available to download yet.",
    ],
    techLabel: "Built with",
    tech: ["Kotlin", "Python", "FastAPI", "SQLite", "Claude", "Whisper"],
    appName: "Marid for Android",
    logoAlt: "Marid's logo: a glass orb with crescent eyes rising from a golden lamp, inside rings of gold and blue.",
  },
  cta: {
    title: "Want an assistant like this",
    titleAccent: "for your business?",
    lead: "We build AI agents and assistants, by voice or by text, that speak your customers' language, with the same care for privacy and control. Tell us what you need, and we'll tell you honestly what's possible.",
    secondary: "Send a message",
  },
};

const ar: MaridPage = {
  metaTitle: "مارد",
  metaDescription:
    "مارد هو المساعد الصوتي الذي نبنيه في آفاق AI. يفهم العامية المصرية، ويرد بصوت مصري، وينجز المهام على هاتفك الأندرويد.",
  eyebrow: "مشروعنا الجديد",
  badge: "قيد التطوير",
  title: "مارد.",
  titleAccent: "مساعد يتكلم لغتك.",
  lead: "مساعد صوتي لهواتف أندرويد يفهم العامية المصرية، ويرد بصوت مصري، وينجز المهام على هاتفك: المكالمات والرسائل والإعدادات والتذكيرات، وحتى الضغط والكتابة داخل التطبيقات الأخرى.",
  goal: "نبنيه ليتجاوز Siri وBixby: يحتفظ بأفضل ما فيهما، ويعالج ما يتوقفان عنده مع من يتحدث العامية المصرية.",
  abilitiesJump: "ماذا يفعل",
  compareJump: "المقارنة",
  orbAlt: "مارد كما يظهر في التطبيق: كرة زجاجية داكنة مليئة بالنجوم، بعينين هلاليتين مضيئتين، ودخان ذهبي، وحلقات ذهبية وزرقاء.",
  demo: {
    you: "أنت",
    marid: "مارد",
    turns: [
      { say: SAY.wake, reply: SAY.greet },
      { say: SAY.call, reply: SAY.callAsk },
      { say: SAY.light, done: "تم تشغيل الكشاف" },
      { say: SAY.remind, done: "تذكير غدًا الساعة 5:00 م" },
      { say: SAY.missed, done: "ملخص قصير لإشعاراتك" },
    ],
  },
  examples: {
    eyebrow: "قلها كما تقولها",
    title: "تكلّم كعادتك،",
    titleAccent: "وهو يفهم.",
    lead: "لا أوامر تحفظها. هذه جمل حقيقية يفهمها مارد اليوم، بالعامية المصرية كما يقولها الناس.",
    groups: [
      {
        name: "هاتفك",
        items: [
          { say: "افتح واتساب", does: "يفتح التطبيق" },
          { say: SAY.light, does: "يشغّل الكشاف" },
          { say: "تايمر 10 دقايق", does: "يضبط المؤقت" },
        ],
      },
      {
        name: "المكالمات والرسائل",
        items: [
          { say: SAY.call, does: "يسألك أولًا، ثم يتصل" },
          { say: "رد على مصطفى وقوله جاي", does: "يرد على آخر إشعار منه بعد موافقتك" },
          { say: SAY.missed, does: "يقرأ لك ملخص الإشعارات التي فاتتك" },
        ],
      },
      {
        name: "يومك",
        items: [
          { say: "المطلوب مني إيه؟", does: "يذكر ما عليك الآن، ويسجّله حين تنجزه" },
          { say: "صباح الخير", does: "ملخص الصباح: أهم ما في يومك، والطقس، وثلاثة أخبار" },
          { say: SAY.remind, does: "يضبط التذكير" },
        ],
      },
      {
        name: "ما حولك",
        items: [
          { say: "شوف دي", does: "يفتح الكاميرا ويجيبك عمّا في الصورة" },
          { say: "إيه اللي على الشاشة؟", does: "يقرأ التطبيق المفتوح أمامك" },
          { say: "يلا نتكلم ألماني", does: "محادثة لتدريب الألمانية، مع التصحيح بالعربية" },
        ],
      },
    ],
  },
  abilities: {
    eyebrow: "ماذا يفعل",
    title: "أكثر من إجابات.",
    titleAccent: "إنه ينجز.",
    items: [
      {
        title: "يصحو على اسمه",
        body: "قل «يا مارد» حتى والشاشة مقفلة، أو استخدم الزر الجانبي أو الأداة على الشاشة الرئيسية أو زر الإعدادات السريعة. ثم تابع الكلام: حين يسألك، يسمع ردك دون أن تناديه من جديد.",
      },
      {
        title: "يفهم المصري ويرد به",
        body: "يوازن بين أكثر من احتمال لما قلته ويختار المعنى الأقرب، فنادرًا ما تحتاج إلى التكرار. ويبدأ الكلام بينما يُكتب باقي الرد، بصوت مصري يُولَّد على معالج الرسوميات الخاص بنا.",
      },
      {
        title: "يدير هاتفك",
        body: "يفتح التطبيقات، ويضبط المؤقتات والمنبهات، ويشغّل الكشاف أو الوضع الصامت، ويتحكم في الموسيقى، ويبحث في الويب، ويفتح الاتجاهات.",
      },
      {
        title: "مكالمات ورسائل بموافقتك",
        body: "يتصل بأي جهة اتصال أو يجهّز رسالة واتساب بالاسم. المكالمة تنتظر موافقتك، والرسالة تُفتح جاهزة لتضغط أنت «إرسال».",
      },
      {
        title: "«فاتني إيه؟»",
        body: "يقرأ لك ملخصًا قصيرًا للإشعارات التي فاتتك، دون الأكواد أو المبالغ، ويمكنه الرد على أحدها بعد موافقتك.",
      },
      {
        title: "«إيدين مارد»",
        body: "حين لا يوجد اختصار للمهمة، يضغط ويكتب ويمرّر داخل التطبيقات الأخرى خطوة بخطوة، ويتوقف ليسألك قبل أي خطوة ترسل أو تنشر أو تشتري أو تحذف.",
      },
      {
        title: "يعرف يومك",
        body: "ما عليك الآن، وملخص للصباح، ومواقيت الصلاة، وتذكيرات تضبطها بصوتك، وتقويم هاتفك. وحين يبدأ وقت عملك، يعرض أن يجعل الهاتف صامتًا.",
      },
      {
        title: "منبهات لا تفوتك",
        body: "التذكيرات المهمة محفوظة على الهاتف نفسه، فترن دون اتصال، وحتى بعد إعادة التشغيل وقبل أن تفتح القفل.",
      },
      {
        title: "يتذكر ويرى ويدرّبك",
        body: "أخبره بشيء عن نفسك فيتذكره، واطلب منه أن ينساه فينساه. أرِه صورة أو اسأله عمّا على شاشتك، أو تدرّب معه على محادثة بالألمانية أو الإنجليزية.",
      },
    ],
  },
  steps: {
    eyebrow: "كيف يرد",
    title: "خمس خطوات،",
    titleAccent: "في ثوانٍ قليلة.",
    items: [
      { name: "يصحو", body: "«يا مارد» أو الزر الجانبي أو الأداة. كلمة التنبيه تعمل على الهاتف نفسه." },
      { name: "يسمع", body: "يلتقط الهاتف كلامك ويرسل أقرب الاحتمالات لما قلته." },
      { name: "يفهم", body: "الأوامر الواضحة تُنفَّذ فورًا دون ذكاء اصطناعي، وما عداها يذهب إلى Claude مع يومك وما يتذكره عنك." },
      { name: "ينفّذ", body: "الخادم يقرر، والهاتف ينفّذ: مكالمة أو إعداد أو تذكير." },
      { name: "يتكلم", body: "يبدأ الرد بصوت مصري بينما يُكتب باقيه." },
    ],
  },
  compare: {
    eyebrow: "Siri وBixby ومارد",
    title: "أفضل ما فيهما،",
    titleAccent: "وحلٌّ لما يتوقفان عنده.",
    lead: "Siri وBixby مساعدان ناضجان من اثنتين من كبرى شركات الهواتف. هذا ما يجيده كلٌّ منهما، وأين يتوقف مع من يتحدث العامية المصرية، وماذا يفعل مارد حيال ذلك. كل معلومة عنهما مأخوذة من صفحات Apple وSamsung الرسمية.",
    labels: { good: "ما يجيده", stops: "أين يتوقف", takes: "ما يأخذه مارد", fixes: "ما يضيفه مارد" },
    rivals: [
      {
        name: "Siri",
        good: [
          "ينفّذ كثيرًا من الطلبات على الجهاز نفسه، بالعربية أيضًا، حتى دون اتصال.",
          "مدمج في أجهزة Apple، من iPhone إلى Mac.",
        ],
        stops: [
          "تتيح Apple عربية Siri للسعودية والإمارات، ومصر ليست في قائمتها.",
          "ميزات Apple Intelligence غير متاحة بالعربية.",
          "يعمل على أجهزة Apple فقط.",
        ],
      },
      {
        name: "Bixby",
        good: [
          "وكيل للجهاز: تغيّر الإعدادات بكلماتك، دون أن تعرف اسم الإعداد.",
          "مدمج في هواتف Samsung Galaxy.",
        ],
        stops: [
          "لا عربية بين لغاته الاثنتي عشرة.",
          "يحتاج إلى حساب Samsung واتصال بالإنترنت.",
          "يعمل على أجهزة Galaxy فقط.",
        ],
      },
    ],
    marid: {
      name: "مارد",
      takes: [
        "من Siri: إبقاء ما هو خاص على الهاتف. جهات اتصالك لا تغادره.",
        "من Bixby: إدارة الهاتف بكلماتك، من الإعدادات والتطبيقات إلى المؤقتات والمنبهات.",
      ],
      fixes: [
        "العامية المصرية أولًا، والرد بصوت مصري.",
        "يعمل داخل التطبيقات الأخرى حين لا يوجد اختصار، ويسأل قبل أي خطوة مهمة.",
        "يتذكر ما تخبره به، ويبادر حين يستطيع المساعدة.",
        "مبني لأندرويد، لا لعلامة تجارية واحدة.",
      ],
    },
    table: {
      caption: "مقارنة سريعة",
      head: ["", "Siri", "Bixby", "مارد"],
      rows: [
        ["العامية المصرية", "العربية للسعودية والإمارات", "لا يدعم العربية", "مبني لها"],
        ["يعمل على", "أجهزة Apple", "أجهزة Samsung Galaxy", "هواتف أندرويد"],
        ["دون اتصال", "كثير من الطلبات على الجهاز", "يحتاج إلى اتصال بالإنترنت", "التذكيرات والمنبهات فقط"],
      ],
    },
    honest: "بصراحة: Siri وBixby منتجان مكتملان بلغات كثيرة، ومارد جديد، ويعمل على أندرويد فقط، وما زال قيد التطوير.",
    note: "راجعنا هذه المعلومات في أكتوبر 2026 من صفحة توفّر ميزات iOS لدى Apple، ومن إعلان Samsung بتاريخ 14 أكتوبر 2026. Siri علامة تجارية لشركة Apple، وBixby علامة تجارية لشركة Samsung، ولا علاقة لمارد بأيٍّ منهما.",
    sourcesLabel: "المصادر",
    sources: [
      { label: "صفحة توفّر ميزات iOS من Apple", url: SOURCES.apple },
      { label: "إعلان Samsung عن دعم اللغات، 14 أكتوبر 2026", url: SOURCES.samsung },
    ],
  },
  safety: {
    eyebrow: "آمن من الأساس",
    title: "قوي،",
    titleAccent: "ضمن حدود واضحة.",
    items: [
      { title: "جهات اتصالك تبقى على هاتفك", body: "يسمع مارد الاسم فقط، والهاتف نفسه يطابقه مع جهات الاتصال." },
      { title: "موافقتك قبل المكالمة والرد", body: "يخبرك بمن سيتصل به أو بما سيرسله، وينتظر ردك." },
      { title: "لا مال ولا حذف ولا نشر", body: "لا يوجد أي إجراء للدفع أو تحويل الأموال أو الحذف أو النشر العام." },
      { title: "تطبيقات البنوك خارج حدوده", body: "يتوقف عند تطبيقات البنوك والمحافظ الإلكترونية، ولا يقرأ خانات كلمات المرور أبدًا." },
      { title: "ينسى عن قصد", body: "لا يحفظ أي مبالغ مالية في ذاكرته، ولا يخزّن ملخصات الإشعارات، ويحذف تسجيلات الصوت بعد 30 يومًا." },
    ],
  },
  status: {
    eyebrow: "أين وصلنا",
    title: "قيد التطوير،",
    titleAccent: "وفي الاستخدام اليومي.",
    body: [
      "يعمل مارد كل يوم على هاتف أندرويد: عقله Claude، وكلمة التنبيه والمنبهات على الهاتف، وصوته المصري على معالج الرسوميات الخاص بنا.",
      "حاليًا يحتاج إلى الاتصال بخادمه ليفكر، أما التذكيرات والمنبهات فتعمل دونه. وهو غير متاح للتحميل بعد.",
    ],
    techLabel: "التقنيات",
    tech: ["Kotlin", "Python", "FastAPI", "SQLite", "Claude", "Whisper"],
    appName: "مارد لأندرويد",
    logoAlt: "شعار مارد: كرة زجاجية بعينين هلاليتين تخرج من مصباح ذهبي، وسط حلقات ذهبية وزرقاء.",
  },
  cta: {
    title: "تريد مساعدًا كهذا",
    titleAccent: "لعملك؟",
    lead: "نبني وكلاء ومساعدين بالذكاء الاصطناعي، بالصوت أو بالكتابة، يتحدثون لغة عملائك، بالحرص نفسه على الخصوصية والتحكم. أخبرنا بما تحتاج إليه، وسنخبرك بصدق بما يمكن تحقيقه.",
    secondary: "أرسل رسالة",
  },
};

export const maridContent: Record<Locale, MaridPage> = { en, ar };
