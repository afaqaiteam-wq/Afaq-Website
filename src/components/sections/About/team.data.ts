import mohamedSaber from "../../../assets/team/mohamed-saber.jpeg";
import mostafaAboelwafa from "../../../assets/team/mostafa-aboeiwafa.jpeg";
import ghofranGharsallah from "../../../assets/team/ghofran-gharsallah.jpeg";
import mahmoudAhmed from "../../../assets/team/mahmoud-ahmed.jpeg";
import mohamedAlaa from "../../../assets/team/mohamed-alaa.jpeg";
import mohamedRagab from "../../../assets/team/mohamed-ragab.jpeg";

/**
 * Team data for the About section.
 *
 * ─────────────────────────────────────────────────────────────
 * PHOTOS
 *
 * `photo` is intentionally optional. When it is absent the card and modal
 * fall back to a monogram tile in the same glass language, so the section is
 * complete and premium without artwork. Nothing else has to change when one
 * is added — every layout is already sized for it.
 *
 * ─────────────────────────────────────────────────────────────
 * COPY — every bio, skill and highlight below is taken from the wording on
 * the team cards supplied for this build. Nothing about anyone's history,
 * tenure or credentials has been invented. Please review before shipping.
 *
 * LINKEDIN — left empty deliberately. The LinkedIn button renders only when a
 * URL is present, so it will simply appear once these are filled in.
 * ─────────────────────────────────────────────────────────────
 */
export interface TeamMember {
  id: string;
  name: string;
  /** Full title, used in the modal. */
  role: string;
  /** Condensed title, used on the card where space is tight. */
  shortRole: string;
  /** Gives the card extra visual weight (leadership badge, "Founder" text
   * by default — see `leadershipBadge` below to override the wording). */
  featured?: boolean;
  /** Badge text shown when `featured` is true. Defaults to "Founder" if
   * omitted, so Mohamed Saber's existing entry (which doesn't set this)
   * renders exactly as it always has. */
  leadershipBadge?: string;
  /** Optional portrait — see note above. */
  photo?: string;
  /** Monogram fallback. */
  initials: string;
  tagline: string;
  bio: string;
  skills: string[];
  tech: string[];
  highlights: string[];
  quote: string;
  /** Empty string hides the LinkedIn button. */
  linkedin: string;
}

export const TEAM: TeamMember[] = [
  {
    id: "saber",
    name: "Mohamed Saber",
    role: "Founder & CEO",
    shortRole: "Founder & CEO",
    featured: true,
    photo: mohamedSaber,
    initials: "MS",
    tagline: "Intelligent solutions. Automated growth.",
    bio: "Founder and CEO of AFAQ AI, building AI-powered solutions and intelligent workflows that help businesses automate, scale and grow. He sets the company's direction and keeps every engagement anchored to a measurable business outcome rather than a demo.",
    skills: [
      "AI Strategy",
      "Business Automation",
      "Product Direction",
      "Client Partnership",
    ],
    tech: ["OpenAI", "Claude", "n8n", "Automation Platforms"],
    highlights: [
      "Leads AFAQ AI's vision and long-term product strategy",
      "Designs automation programmes around real operational load",
      "Partners directly with clients from discovery through delivery",
    ],
    quote:
      "Empower businesses with AI that works, so they can focus on what matters most.",
    linkedin: "",
  },
  {
    id: "mostafa",
    name: "Mostafa Aboelwafa",
    role: "Co-CEO & Co-Founder",
    shortRole: "Co-CEO & Co-Founder",
    featured: true,
    leadershipBadge: "Co-Founder",
    photo: mostafaAboelwafa,
    initials: "MA",
    // Skills are a direct restatement of the given positioning line
    // ("Engineering × Business × AI") and role ("Co-CEO & Co-Founder") —
    // not new facts. No technologies or highlights were provided, so those
    // stay empty rather than inventing content; TeamModal.tsx hides those
    // sections gracefully when empty instead of rendering a blank heading
    // (see the empty-field notes on Ragab, below, for the same
    // "don't fabricate" convention).
    tagline: "Engineering × Business × AI",
    bio: "Co-CEO and Co-Founder of AFAQ AI, working across engineering, business and AI — shaping technology direction and strategic partnerships alongside product and business growth, connecting technical execution with commercial strategy.",
    skills: [
      "Engineering",
      "Business Strategy",
      "Technology Strategy",
      "Business Growth",
      "Strategic Partnerships",
    ],
    tech: [],
    highlights: [],
    quote:
      "Engineering, business and AI work best together when they are built around real impact.",
    linkedin: "",
  },
  {
    id: "ghofran",
    name: "Ghofran Gharsallah",
    role: "Lead Full Stack Developer | CTO",
    shortRole: "Lead Full Stack Dev | CTO",
    photo: ghofranGharsallah,
    initials: "GG",
    tagline: "Scalable web and mobile, end to end.",
    bio: "Lead Full Stack Developer and CTO with a passion for building scalable web and mobile solutions. Drives technology strategy and leads the development team to deliver high-impact digital products.",
    skills: [
      "Frontend",
      "Backend",
      "Dashboards & Analytics",
      "Web & Mobile Applications",
      "Technical Leadership",
    ],
    tech: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    highlights: [
      "Owns technology strategy and architecture decisions",
      "Leads frontend, backend and mobile development",
      "Builds dashboards and analytics for client operations",
    ],
    quote:
      "Good architecture is what lets a product keep moving fast a year later.",
    linkedin: "",
  },
  {
    id: "mahmoud",
    name: "Mahmoud Ahmed",
    role: "AI Automation Engineer",
    shortRole: "AI Automation Engineer",
    photo: mahmoudAhmed,
    initials: "MA",
    tagline: "From design to deployment.",
    bio: "AI Automation Engineer specialising in building intelligent systems and scalable automation solutions that drive real business impact. Delivers end-to-end automation using AI, n8n, APIs and integrations — from design through to deployment.",
    skills: [
      "AI Automation",
      "n8n Workflows",
      "API Integrations",
      "AI Workflows",
      "Deployment",
    ],
    tech: ["n8n", "Python", "OpenAI", "REST APIs", "Docker"],
    highlights: [
      "Builds end-to-end automation pipelines with AI in the loop",
      "Integrates third-party APIs into existing client systems",
      "Takes workflows from first design through production deployment",
    ],
    quote:
      "An automation is only finished when it survives real production load.",
    linkedin: "",
  },
  {
    id: "alaa",
    name: "Mohamed Alaa",
    role: "Growth & Content Lead",
    shortRole: "Growth & Content Lead",
    photo: mohamedAlaa,
    initials: "MA",
    tagline: "Content that connects. Strategies that grow.",
    bio: "Growth & Content Lead passionate about creating content that connects, designs that inspire and strategies that grow brands. Brings creative content, powerful visuals and growth strategies that build brand presence, engagement and real results.",
    skills: [
      "Video Editing",
      "Social Media",
      "Design",
      "Branding",
      "Marketing",
    ],
    tech: ["Adobe Suite", "Figma", "Social Platforms", "Analytics"],
    highlights: [
      "Shapes brand presence across content and social channels",
      "Produces video and visual assets end to end",
      "Runs growth strategies measured on engagement and results",
    ],
    quote:
      "Brand is what people repeat about you when you are not in the room.",
    linkedin: "",
  },
  {
    id: "ragab",
    name: "Mohamed Ragab",
    role: "Growth & Content Lead",
    shortRole: "Growth & Content Lead",
    photo: mohamedRagab,
    initials: "MR",
    tagline: "Growth and content strategy that builds brand presence.",
    bio: "Growth & Content Lead focused on content strategy, video, design and marketing campaigns that build brand presence.",
    skills: [
      "Content Strategy",
      "Video Editing",
      "Social Media Management",
      "Graphic Design",
      "Branding",
      "Marketing Campaigns",
    ],
    tech: [],
    highlights: [],
    quote:
      "Great content isn't just seen, it's remembered and it drives growth.",
    linkedin: "",
  },
];

/** The CEO, surfaced separately because the composition gives it more weight. */
export const FEATURED = TEAM.find((m) => m.featured) ?? TEAM[0];
export const SUPPORTING = TEAM.filter((m) => !m.featured);