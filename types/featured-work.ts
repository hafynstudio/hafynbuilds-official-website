/**
 * FeaturedWork — a showcased build on Home's "What We Build" section
 * (PRD §2.2.1). PRD explicitly bans fake client testimonials and
 * placeholder case studies; the "Internal Build" tag was introduced as
 * the honest alternative for a newly-launched brand with no external
 * client case studies yet. "Client Project" is ready for real work the
 * moment it arrives — same component, zero rework.
 *
 * NOTE: not in original TAD §9 enumeration — introduced in Phase 5.
 */
export interface FeaturedWork {
  id: string;
  name: string;
  description: string;
  tag: "Internal Build" | "Client Project";
  /** Optional external or internal URL for a "View →" link.
   * Omit entirely if there is nothing real to link to yet — the card
   * renders without a link rather than showing a dead href. */
  href?: string;
  displayOrder: number;
}
