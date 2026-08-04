import type { CompanyValue } from "@/types/value";

// The 6 locked brand values (PRD §1.2). One-liner copy per user sign-off
// in Phase 5. expandedDescription added in Phase 6 for About's hover-expand
// cards — one data file, two presentations, zero drift risk.
export const companyValues: CompanyValue[] = [
  {
    id: "excellence",
    name: "Excellence",
    oneLiner: "Every build held to a standard, not a deadline.",
    expandedDescription:
      "Excellence is not a finishing touch we add at the end — it is the bar every decision is measured against from the first line of code. We do not ship 'good enough.' We ship what we would put our own name on.",
    displayOrder: 1,
  },
  {
    id: "ownership",
    name: "Ownership",
    oneLiner: "We build like it is our own company on the line.",
    expandedDescription:
      "Every engineer on a build treats it like their own product, not a ticket to close. That means catching the problem before the client sees it, and caring about the outcome long after the invoice is paid.",
    displayOrder: 2,
  },
  {
    id: "innovation",
    name: "Innovation",
    oneLiner: "Solving it the right way, not the easy way.",
    expandedDescription:
      "The fastest solution and the right solution are not always the same thing. We choose architecture that solves the actual problem — even when the shortcut would have shipped a week earlier.",
    displayOrder: 3,
  },
  {
    id: "speed",
    name: "Speed",
    oneLiner: "Fast without cutting what matters.",
    expandedDescription:
      "Speed without discipline is just technical debt with a head start. We move fast by removing friction — clear scope, decisive architecture, no unnecessary approval loops — not by skipping the parts that matter.",
    displayOrder: 4,
  },
  {
    id: "reliability",
    name: "Reliability",
    oneLiner: "Built to still be running years from now.",
    expandedDescription:
      "A system that breaks under real-world load was never actually finished. We build for the traffic spike, the edge case, and the client's growth two years out — not just the demo day.",
    displayOrder: 5,
  },
  {
    id: "transparency",
    name: "Transparency",
    oneLiner: "You always know exactly where your build stands.",
    expandedDescription:
      "No black-box status updates, no surprise scope changes buried in an email thread. You get a clear, honest picture of progress, tradeoffs, and timeline — even when the news is not what you wanted to hear.",
    displayOrder: 6,
  },
];
