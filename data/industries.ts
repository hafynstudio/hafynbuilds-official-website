import type { Industry } from "@/types/industry";

// Populated in Phase 11 (Investment — Industry Explorer). Deliberately
// empty until then: per PRD §2.2.6, an industry with no data must not
// render at all — there is no fallback/fake-content path, so an empty
// array here is a fully correct state, not a bug.
export const industries: Industry[] = [];
