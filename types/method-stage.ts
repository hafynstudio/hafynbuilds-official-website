/**
 * MethodStage — one of the 5 sequential delivery stages.
 * DB-shaped per TAD §9 pattern: shortDescription drives the teaser,
 * all other fields drive Phase 9's full Method page expansion.
 * Zero data-layer changes needed when Phase 9 is built.
 */
export interface MethodStage {
  id: string;
  name: string;
  shortDescription: string;
  expandedDescription: string;
  deliverables: string[];
  timeframe: string;
  clientInvolvement: string;
  /** Terminal-style status log line shown alongside this stage node */
  statusLabel: string;
  /** Drives the featured/active node treatment on the Home teaser */
  isFeatured: boolean;
  displayOrder: number;
}
