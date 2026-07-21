import type { FeaturedWork } from "@/types/featured-work";

// Real, verifiable internal builds only — per PRD's explicit ban on fake
// client work and placeholder case studies. Add real client case studies
// (tag: "Client Project") the moment they exist; FeaturedWork.tsx
// requires zero changes, only a new entry here.
export const featuredWork: FeaturedWork[] = [
  {
    id: "hafyn-builds-website",
    name: "This Website",
    description:
      "A full multi-currency pricing engine, custom motion system, admin-ready data architecture, and 9-page content build — engineered exactly the way we build for clients.",
    tag: "Internal Build",
    displayOrder: 1,
  },
  {
    id: "lead-intelligence-system",
    name: "Lead Intelligence System",
    description:
      "Internal automation that qualifies and routes inbound leads without manual triage — built on the same AI-agent patterns we ship for clients.",
    tag: "Internal Build",
    displayOrder: 2,
  },
];
