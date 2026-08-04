/**
 * TechPrinciple — one entry in the Capabilities page's Tech Philosophy
 * strip (PRD §2.2.4: performance-first, security-by-design,
 * scalability-by-default, clean architecture, AI-driven innovation,
 * automation-first). Shaped like a future database row per TAD §9
 * convention, consistent with every other content type in /types.
 */
export interface TechPrinciple {
  id: string;
  title: string;
  description: string;
  /** Key into ICON_MAP in lib/icons.ts */
  icon: string;
  displayOrder: number;
}
