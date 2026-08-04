/**
 * FounderProfile — extended in Phase 13 (Founder page) on top of the
 * minimal shape originally created in Phase 5 for Home's FounderTeaser
 * strip. Existing fields (name, title, tagline, photoUrl,
 * isTaglinePlaceholder) are untouched -- FounderTeaser.tsx keeps working
 * unmodified. Everything below isTaglinePlaceholder is new.
 *
 * Content is real (supplied by Zain Marwat, Phase 13) -- not placeholder.
 * Only real social profile URLs (data/social-links.ts) remain pending;
 * see PRD Section 5.
 */

/**
 * A single block in the founder's narrative, rendered in array order by
 * FounderNarrative.tsx. Two variants:
 * - "prose": a standard heading + paragraph(s) section.
 * - "quote": a large pull-quote treatment, breaking up the prose rhythm.
 * Storing order in data (not hardcoded JSX structure) means reordering,
 * inserting, or removing a section/quote later never requires touching
 * the component -- this is what keeps the page admin-panel-ready.
 */
export type FounderNarrativeBlock =
  | {
      type: "prose";
      id: string;
      heading: string;
      paragraphs: string[];
    }
  | {
      type: "quote";
      id: string;
      quote: string;
      context?: string;
    };

export interface FounderProfile {
  // existing (Phase 5) -- untouched
  name: string;
  title: string;
  /** Home teaser pull-line only. */
  tagline: string;
  photoUrl: string | null;
  isTaglinePlaceholder: boolean;

  // new for Phase 13 (Founder page)
  /** Small label above the H1, e.g. "Meet the Founder". */
  eyebrow: string;
  /** Opening hero statement -- sets philosophical tone before the bio. */
  openingStatement: string;
  /** Ordered prose + pull-quote sections making up the main scroll body. */
  narrative: FounderNarrativeBlock[];
  /** "Looking Ahead" -- HAFYN ecosystem long-term vision callback. */
  ecosystemVision: {
    heading: string;
    paragraphs: string[];
  };
  /** Final signature statement, paired visually with signature.png. */
  closingQuote: {
    quote: string;
    context?: string;
  };
}
