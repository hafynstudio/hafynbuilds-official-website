import type { Package } from "@/types/package";

// The 3 universal Foundation packages (industryId: null) are populated in
// Phase 10. Per-industry packages are populated in Phase 12. An industry
// with zero matching packages here simply renders nothing on the frontend
// — this is the explicit empty-state rule from PRD §2.2.6, not a gap.
export const packages: Package[] = [];
