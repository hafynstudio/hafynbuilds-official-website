export interface PackageFeature {
  label: string;
  /** Rendered in JetBrains Mono — e.g. "04", "7–8 DAYS", "∞". Omitted
   * entirely for features with no natural quantity (renders as a plain
   * spec-sheet row with no mono suffix). */
  quantity?: string;
}

export interface Package {
  id: string;
  industryId: string | null;
  name: string;
  tagline: string;
  description: string;
  features: PackageFeature[];
  highlight: string | null;
  deliveryDays: string;
  revisions: string;
  support: string;
  bestFor: string;
  displayOrder: number;
  isFeatured: boolean;
  pricing: Record<string, CountryPrice>;
}

export interface CountryPrice {
  currencyCode: string;
  currencySymbol: string;
  regularPrice: number;
  foundingPrice: number;
  formatStyle: 'symbol-prefix' | 'code-suffix' | 'symbol-prefix-space';
  decimals: number;
}

export interface FoundingConfig {
  foundingPricingActive: boolean;
  totalSlots: number;
  slotsRemaining: number;
}
