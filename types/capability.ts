/**
 * Capability — one of the 5 core engineering disciplines HAFYN BUILDS
 * sells. Shaped exactly like a future database table row (TAD §9) so
 * migration to Supabase/Postgres later requires only swapping the
 * data-fetching layer, not this type or any component consuming it.
 *
 * Fields below `displayOrder` were added in Phase 8 to power "The Build
 * Console" (PRD §2.2.4) — the code-to-UI compile sequence. They are
 * additive only; every Phase 4 consumer (CapabilitiesTeaser.tsx) already
 * satisfies them because data/capabilities.ts was extended alongside
 * this type, not left partially filled.
 */
export interface Capability {
  id: string;
  name: string;
  shortDescription: string;
  /** Key into ICON_MAP in lib/icons.ts */
  icon: string;
  /** When true: renders as the bento grid's 2col×2row featured cell */
  isFeatured: boolean;
  displayOrder: number;
  /** Terminal header filename shown during the code/compile phase, e.g. "agent.ts" */
  fileName: string;
  /** Lines of code auto-typed in the terminal before the morph into UI.
   * Illustrative product code, not fake content — same category as a
   * Stripe/Vercel marketing-page code sample. */
  codeLines: string[];
  /** Sequential live-feel status log lines shown while "compiling"
   * (PRD §2.2.4: "Building...", "Optimizing...", "✓ Deployed"). The
   * final entry should always read as a completed state. */
  statusSteps: string[];
  /** One-line caption shown beneath the fully deployed UI state, e.g.
   * "Live dashboard — real-time metrics". */
  deployedLabel: string;
}
