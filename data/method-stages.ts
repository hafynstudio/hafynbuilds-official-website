import type { MethodStage } from "@/types/method-stage";

/**
 * The 5 sequential stages of HAFYN BUILDS' delivery method (PRD §2.2.5).
 * Used on the Home teaser (Phase 5) and the full Method page (Phase 9).
 * The `isFeatured` flag drives the visually distinct "active" node
 * treatment on the teaser — one stage highlighted, four supporting.
 * `shortDescription` = teaser copy. `expandedDescription` + `deliverables`
 * + `timeframe` + `clientInvolvement` are reserved for Phase 9's
 * full-screen stage detail expansion — present in the data now so
 * Phase 9 requires zero data-layer changes.
 */
export const methodStages: MethodStage[] = [
  {
    id: "discovery",
    name: "Discovery",
    shortDescription: "We map requirements, constraints, and success criteria before writing a single line.",
    expandedDescription: "A structured deep-dive into your business, users, and technical landscape. We leave with a locked requirements document and you leave knowing exactly what gets built and why.",
    deliverables: ["Requirements document", "Technical feasibility report", "Project scope", "Architecture direction"],
    timeframe: "1–2 weeks",
    clientInvolvement: "High — we need your domain knowledge",
    statusLabel: "Requirements locked.",
    isFeatured: false,
    displayOrder: 1,
  },
  {
    id: "design",
    name: "Design",
    shortDescription: "Architecture and interface design that eliminates ambiguity before build begins.",
    expandedDescription: "System architecture, data models, and interface design done in parallel. Every design decision is traceable to a requirement — nothing is decoration.",
    deliverables: ["System architecture diagram", "Data models", "UI/UX designs", "API contracts"],
    timeframe: "1–3 weeks",
    clientInvolvement: "Medium — review and sign-off checkpoints",
    statusLabel: "Architecture finalized.",
    isFeatured: false,
    displayOrder: 2,
  },
  {
    id: "build",
    name: "Build",
    shortDescription: "Engineering-first execution. Clean architecture, tested code, shipped in iterations.",
    expandedDescription: "Iterative development with weekly deliverables. TypeScript-strict, tested, documented, and reviewed — never a rushed pile of code shipped at the deadline.",
    deliverables: ["Working software, weekly", "Test coverage", "Code documentation", "Staging environment"],
    timeframe: "2–12 weeks depending on scope",
    clientInvolvement: "Low-medium — weekly demo + feedback",
    statusLabel: "Shipping to production.",
    isFeatured: true,
    displayOrder: 3,
  },
  {
    id: "launch",
    name: "Launch",
    shortDescription: "Production deployment, monitoring setup, and a handover that actually makes sense.",
    expandedDescription: "Zero-downtime deployment, monitoring and alerting configured, documentation handed over. You know exactly how your system works before we leave.",
    deliverables: ["Production deployment", "Monitoring setup", "Full documentation", "Handover session"],
    timeframe: "3–5 days",
    clientInvolvement: "Medium — handover sessions",
    statusLabel: "Deployed to production.",
    isFeatured: false,
    displayOrder: 4,
  },
  {
    id: "support",
    name: "Support",
    shortDescription: "Ongoing reliability, performance, and iteration — so what we built keeps working.",
    expandedDescription: "Bug fixes, performance monitoring, and planned iteration cycles. We stay accountable for what we shipped.",
    deliverables: ["Bug fixes", "Performance monitoring", "Planned feature iterations", "Priority response SLA"],
    timeframe: "Ongoing",
    clientInvolvement: "Low — we handle it, you stay informed",
    statusLabel: "System nominal.",
    isFeatured: false,
    displayOrder: 5,
  },
];
