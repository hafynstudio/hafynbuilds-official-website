/**
 * CompanyValue — one of HAFYN BUILDS' 6 locked brand values
 * (PRD §1.2: Excellence, Ownership, Innovation, Speed, Reliability,
 * Transparency). Both Home (condensed one-liner cards) and About
 * (hover-expand treatment, Phase 6) read from the same data source.
 * `expandedDescription` is omitted from data/values.ts now and added
 * in Phase 6 — one source of truth prevents the two pages ever drifting
 * out of sync on value names or ordering.
 *
 * NOTE: not in original TAD §9 enumeration — introduced in Phase 5 as a
 * genuine gap, consistent with §9's "shaped like a future DB table" rule.
 */
export interface CompanyValue {
  id: string;
  name: string;
  /** Condensed one-liner for Home's values grid. */
  oneLiner: string;
  /** Fuller copy for About's hover-expand cards — populated in Phase 6. */
  expandedDescription?: string;
  displayOrder: number;
}
