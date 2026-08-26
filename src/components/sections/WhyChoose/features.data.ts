import {
  BrainCircuit,
  Gauge,
  HeartHandshake,
  Layers,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * The six advantages, plus the stat band.
 *
 * `tier` drives the editorial rhythm: one feature block, two medium blocks and
 * three compact rows. Presentation is data-driven rather than hard-coded per
 * card, so re-ordering or re-weighting the section is a data change.
 *
 * Named features.data.ts to match technologies/services/team, and because a
 * bare features.ts would shadow a future Features.tsx on a case-insensitive
 * filesystem (TypeScript resolves .ts before .tsx).
 */
export type Tier = "feature" | "medium" | "compact";

export interface Feature {
  id: string;
  tier: Tier;
  title: string;
  description: string;
  /** Longer line, shown only on the feature block. */
  detail?: string;
  Icon: LucideIcon;
}

export const FEATURES: Feature[] = [
  {
    id: "01",
    tier: "feature",
    title: "AI-First Thinking",
    description:
      "Every solution is designed around artificial intelligence from day one.",
    detail:
      "Not a conventional build with a model bolted on afterwards. We start from where intelligence actually changes the outcome, then design the system around it — which is why our automations hold up under real operational load instead of only in a demo.",
    Icon: BrainCircuit,
  },
  {
    id: "02",
    tier: "medium",
    title: "Enterprise Quality",
    description:
      "Scalable architecture built for real businesses, not proofs of concept.",
    Icon: ShieldCheck,
  },
  {
    id: "03",
    tier: "medium",
    title: "Human + AI Collaboration",
    description:
      "Combining senior engineering judgement with the efficiency of AI.",
    Icon: Users,
  },
  {
    id: "04",
    tier: "compact",
    title: "Fast Delivery",
    description: "Rapid iterations without sacrificing quality.",
    Icon: Gauge,
  },
  {
    id: "05",
    tier: "compact",
    title: "Future-Proof Technology",
    description: "Modern foundations that evolve with your business.",
    Icon: Layers,
  },
  {
    id: "06",
    tier: "compact",
    title: "Long-Term Partnership",
    description: "We stay with our clients well beyond launch.",
    Icon: HeartHandshake,
  },
];

export interface Stat {
  /** Counted up when numeric; `display` is used verbatim when it is null. */
  value: number | null;
  display?: string;
  suffix?: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: null, display: "24/24", label: "AI Automation" },
  { value: 4, suffix: "+", label: "Projects Delivered" },
  { value: 1, suffix: "+", label: "Years Experience" },
];