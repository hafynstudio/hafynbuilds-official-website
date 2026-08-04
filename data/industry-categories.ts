/**
 * Industry categories — single source of truth for category names
 * across the Capabilities marquee, Industry Explorer filter pills,
 * and any future admin panel category selectors.
 *
 * PRD §2.2.6 named 13 original categories. Logistics added in Phase 12
 * to support the logistics-courier industry seeded in that phase.
 * All additions go here first — never hardcode category strings elsewhere.
 */
export const INDUSTRY_CATEGORIES = [
  "Food & Beverage",
  "Healthcare",
  "Professional Services",
  "Retail",
  "Education",
  "Beauty & Wellness",
  "Construction",
  "Technology",
  "Finance",
  "Automotive",
  "Hospitality",
  "Creative",
  "Manufacturing",
  "Logistics",
] as const;

export type IndustryCategory = (typeof INDUSTRY_CATEGORIES)[number];
