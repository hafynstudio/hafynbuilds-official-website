import type { CompanyValue } from "@/types/value";

// The 6 locked brand values (PRD §1.2). One-liner copy per user sign-off
// in Phase 5. expandedDescription intentionally omitted here — Phase 6
// adds it to each entry when About's hover-expand cards need it. One
// data file, two presentations, zero drift risk.
export const companyValues: CompanyValue[] = [
  {
    id: "excellence",
    name: "Excellence",
    oneLiner: "Every build held to a standard, not a deadline.",
    displayOrder: 1,
  },
  {
    id: "ownership",
    name: "Ownership",
    oneLiner: "We build like it is our own company on the line.",
    displayOrder: 2,
  },
  {
    id: "innovation",
    name: "Innovation",
    oneLiner: "Solving it the right way, not the easy way.",
    displayOrder: 3,
  },
  {
    id: "speed",
    name: "Speed",
    oneLiner: "Fast without cutting what matters.",
    displayOrder: 4,
  },
  {
    id: "reliability",
    name: "Reliability",
    oneLiner: "Built to still be running years from now.",
    displayOrder: 5,
  },
  {
    id: "transparency",
    name: "Transparency",
    oneLiner: "You always know exactly where your build stands.",
    displayOrder: 6,
  },
];
