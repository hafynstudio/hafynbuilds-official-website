import type { Capability } from "@/types/capability";

/**
 * The 5 core capability disciplines of HAFYN BUILDS (PRD §2.2.4).
 * AI Systems carries isFeatured:true — this is the data signal that
 * drives the bento grid's 2×2 featured cell on the Home teaser and the
 * first "compile sequence" on the Capabilities page (Phase 8).
 * displayOrder controls render sequence; isFeatured controls layout size.
 * Changing which capability leads the grid is a data edit only —
 * zero component changes required.
 */
export const capabilities: Capability[] = [
  {
    id: "ai-systems",
    name: "AI Systems",
    shortDescription:
      "Intelligent agents, LLM integrations, and AI-native products built for production — not demos.",
    icon: "Brain",
    isFeatured: true,
    displayOrder: 1,
  },
  {
    id: "web-apps",
    name: "Web Apps",
    shortDescription:
      "Full-stack applications engineered for speed, scale, and zero technical debt.",
    icon: "Globe",
    isFeatured: false,
    displayOrder: 2,
  },
  {
    id: "software-saas",
    name: "Software & SaaS",
    shortDescription:
      "Multi-tenant platforms and SaaS products built to grow with your business.",
    icon: "Layers",
    isFeatured: false,
    displayOrder: 3,
  },
  {
    id: "automation",
    name: "Automation",
    shortDescription:
      "Business process automation that eliminates manual work and compounds over time.",
    icon: "Workflow",
    isFeatured: false,
    displayOrder: 4,
  },
  {
    id: "enterprise-solutions",
    name: "Enterprise Solutions",
    shortDescription:
      "Large-scale, security-first systems built for regulated industries and complex organisations.",
    icon: "Building2",
    isFeatured: false,
    displayOrder: 5,
  },
];
