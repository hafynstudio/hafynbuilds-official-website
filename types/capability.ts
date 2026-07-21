/**
 * Capability — one of the 5 core engineering disciplines HAFYN BUILDS
 * sells. Shaped exactly like a future database table row (TAD §9) so
 * migration to Supabase/Postgres later requires only swapping the
 * data-fetching layer, not this type or any component consuming it.
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
}
