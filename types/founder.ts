/**
 * FounderProfile — minimal shape used by Home's FounderTeaser strip.
 * Phase 13 (full Founder page) builds directly on top of this; it is
 * extended with philosophy quotes, full bio, and social links at that
 * point — never replaced.
 *
 * TAD §9 did not enumerate a Founder interface (only Industry, Package,
 * CurrencyRate, PriceOverride, TeamMember, BlogPost were specified).
 * This is a genuine gap filled in Phase 5. If a conflicting
 * types/founder.ts was created in Phase 1, this version wins — the
 * Phase 1 version had no PRD-specified shape to follow.
 */
export interface FounderProfile {
  name: string;
  title: string;
  /** Home teaser pull-line only. Full 3–4 philosophy quotes belong to
   * the Founder page (Phase 13). */
  tagline: string;
  /** null = render the styled gradient placeholder. Swap to a real path
   * (e.g. "/images/founder.jpg") when the real photo is supplied —
   * FounderTeaser.tsx branches on null vs. string. */
  photoUrl: string | null;
  /** true while tagline is provisional copy, not a real founder quote.
   * No visual difference shown to visitors — flag exists for internal
   * content-audit grepping without diffing prose by eye. */
  isTaglinePlaceholder: boolean;
}
