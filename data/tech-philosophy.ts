import type { TechPrinciple } from "@/types/tech-principle";

/**
 * The 6 engineering principles HAFYN BUILDS holds every build to
 * (PRD §2.2.4, verbatim list). This is locked brand copy specified
 * directly in the PRD — not user-pending content — so it ships as real
 * data now rather than a placeholder, consistent with the data-driven
 * architecture rule (Master Prompt §3: no hardcoded content in a
 * component).
 */
export const techPhilosophy: TechPrinciple[] = [
  {
    id: "performance-first",
    title: "Performance-First",
    description: "Every millisecond is a design decision.",
    icon: "Zap",
    displayOrder: 1,
  },
  {
    id: "security-by-design",
    title: "Security-by-Design",
    description: "Protection built in, never bolted on.",
    icon: "Shield",
    displayOrder: 2,
  },
  {
    id: "scalability-by-default",
    title: "Scalability-by-Default",
    description: "Built to grow, from day one.",
    icon: "TrendingUp",
    displayOrder: 3,
  },
  {
    id: "clean-architecture",
    title: "Clean Architecture",
    description: "No shortcuts. No technical debt.",
    icon: "Code2",
    displayOrder: 4,
  },
  {
    id: "ai-driven-innovation",
    title: "AI-Driven Innovation",
    description: "Intelligence woven into the core.",
    icon: "Brain",
    displayOrder: 5,
  },
  {
    id: "automation-first",
    title: "Automation-First",
    description: "If it repeats, we automate it.",
    icon: "RefreshCw",
    displayOrder: 6,
  },
];
