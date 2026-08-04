/**
 * FeaturedWork — one showcased project on the Home page.
 * DB-shaped per TAD §9 pattern so admin-panel addition later
 * requires only a data-source swap, never a component rewrite.
 */
export interface FeaturedWork {
  id: string;
  name: string;
  description: string;
  /** Short tag rendered as a monospace status pill on the card */
  tag: string;
  /** Controls the status indicator color/label */
  status: "live" | "in-progress" | "completed";
  /** Tech stack rendered as monospace pills — real technologies only */
  techStack: string[];
  /** One real, verifiable metric per project */
  metric: {
    label: string;
    value: string;
  };
  /** null = no external link yet. Set to a real URL when available. */
  href: string | null;
  /** Key into ICON_MAP from lib/icons.ts */
  icon: string;
  displayOrder: number;
}
