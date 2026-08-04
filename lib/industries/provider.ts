// HAFYN BUILDS — Industry Data Provider
// The ONLY interface Explorer-facing components query for industry data.
// Mirrors the isolation pattern proven by lib/currency/engine.ts:
// UI never touches raw data directly, only this provider layer.
//
// Phase 12: visibility now requires BOTH Industry.isActive and at least
// one real package in data/industry-packages.ts. Explorer components do
// not change when industries are enabled/disabled — only data changes.

import { industries } from "@/data/industries";
import { industryHasPackages } from "@/data/industry-packages";
import type { Industry } from "@/types/industry";

/**
 * Returns every industry currently eligible to render on the frontend.
 * Gated on BOTH isActive AND having at least one real package defined.
 */
export function getVisibleIndustries(): Industry[] {
  return industries.filter(
    (industry) => industry.isActive && industryHasPackages(industry.id)
  );
}

/**
 * Narrows a list to a single category. null returns the list unchanged
 * and represents the "All Industries" filter state.
 */
export function filterIndustriesByCategory(
  list: Industry[],
  category: string | null
): Industry[] {
  if (!category) return list;
  return list.filter((industry) => industry.category === category);
}

/**
 * Case-insensitive substring match across name, description, and
 * category. Empty/whitespace-only query returns the list unchanged.
 */
export function searchIndustries(list: Industry[], query: string): Industry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return list;

  return list.filter(
    (industry) =>
      industry.name.toLowerCase().includes(normalized) ||
      industry.description.toLowerCase().includes(normalized) ||
      industry.category.toLowerCase().includes(normalized)
  );
}
