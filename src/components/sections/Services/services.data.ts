import {
  Blocks,
  BrainCircuit,
  Bot,
  Code2,
  MessagesSquare,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/**
 * Services shown in the Services section.
 *
 * Order is meaningful: the list runs from the most concrete, most-requested
 * offering (automation) through to the most advisory (consulting), so the grid
 * reads top-left to bottom-right as a descending ladder of commitment.
 *
 * NOTE ON THE FILENAME: this is `services.data.ts`, not `services.ts`. On a
 * case-insensitive filesystem (Windows/macOS) `services.ts` and `Services.tsx`
 * collide — TypeScript resolves `./Services/Services` by trying `.ts` before
 * `.tsx`, so the barrel import in App.tsx would silently resolve to this data
 * module instead of the component and fail with "has no default export".
 */
export interface Service {
  /** Two-digit index rendered as an editorial marker on the card. */
  id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
}

export const SERVICES: Service[] = [
  {
    id: "01",
    title: "AI Automation",
    description:
      "Automate repetitive workflows with intelligent AI-powered systems.",
    Icon: Workflow,
  },
  {
    id: "02",
    title: "AI Agents",
    description:
      "Custom AI agents capable of handling complex business tasks autonomously.",
    Icon: Bot,
  },
  {
    id: "03",
    title: "Custom Chatbots",
    description:
      "High-quality conversational AI built specifically for your business.",
    Icon: MessagesSquare,
  },
  {
    id: "04",
    title: "Web Development",
    description:
      "Modern high-performance websites and SaaS applications powered by AI.",
    Icon: Code2,
  },
  {
    id: "05",
    title: "AI Integrations",
    description:
      "Integrate OpenAI, Claude, Gemini and other AI providers into existing systems.",
    Icon: Blocks,
  },
  {
    id: "06",
    title: "AI Consulting",
    description:
      "Helping businesses identify opportunities and implement AI successfully.",
    // Brain (intelligence/AI) + circuit (systematic, strategic thinking) —
    // reuses the same mark already established for "AI" in the Hero's
    // floating icon cards, rather than introducing a new visual motif.
    Icon: BrainCircuit,
  },
];