/**
 * TeamMember — TAD §9.5.
 *
 * Shape is deliberately identical to how a future database table row
 * would look, so the Phase 20 admin-panel migration is a data-source
 * swap only — components consuming this type stay untouched.
 *
 * isFounder=true drives the distinct Founder Spotlight card treatment
 * on the Team page (larger, different visual language). Only one
 * TeamMember should have isFounder=true at any time.
 */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  specialty: string;
  isFounder: boolean;
  displayOrder: number;
}
