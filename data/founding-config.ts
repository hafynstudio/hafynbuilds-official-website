// HAFYN BUILDS — Founding Client Configuration
// Single source of truth for the founding pricing promotion.
// Flip foundingPricingActive to false when the 8 spots are filled
// or the promotion ends — every currency reverts to regularPrice
// automatically. No per-country cleanup needed.

export interface FoundingConfig {
  foundingPricingActive: boolean;
  foundingClientSlotsTotal: number;
  foundingClientSlotsRemaining: number;
}

export const foundingConfig: FoundingConfig = {
  foundingPricingActive: true,
  foundingClientSlotsTotal: 8,
  foundingClientSlotsRemaining: 8,
};
