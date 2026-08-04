// HAFYN BUILDS — Industry Package Types
// Separate from Foundation package types by design (Decision D2/Phase 12).
// Shapes the data layer for per-industry packages — scalable to 100+
// industries × 9 packages each without touching Foundation pricing types.

export type IndustryPackageTier = "starter" | "standard" | "premium";

export interface IndustryPackage {
  /** Stable unique ID — used as the pricing lookup key.
   *  Convention: "{industryId}-{tier}" e.g. "restaurant-starter"
   *  Never change an ID after launch — it is the pricing table key. */
  id: string;
  /** Parent industry this package belongs to */
  industryId: string;
  /** Display name — shown as the card heading */
  name: string;
  /** One-line positioning statement — shown below the name */
  tagline: string;
  /** 2–3 sentence description of what this package delivers */
  description: string;
  /** Ordered feature list — rendered as checkmark items */
  features: string[];
  /** Features to highlight visually (subset of features[]) */
  signatureFeatures: string[];
  /** Delivery estimate string e.g. "7–9 days" */
  deliveryDays: string;
  /** Number of included revision rounds */
  revisionRounds: number;
  /** Post-launch support period e.g. "30 days" */
  supportPeriod: string;
  /** One-line description of the ideal buyer */
  bestFor: string;
  /** Controls card visual emphasis — "standard" gets the recommended badge */
  isMostChosen: boolean;
  /** Render order within the industry modal (1 = leftmost/top) */
  displayOrder: number;
}
