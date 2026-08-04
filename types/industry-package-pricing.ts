// HAFYN BUILDS — Industry Package Pricing Types
// Deliberately separate from CountryPricing (Foundation) per Decision D2.
// Scales to 100+ industries x 3 packages x 28 countries.

export interface IndustryPackagePrice {
  /** References IndustryPackage.id */
  packageId: string;
  /** ISO 3166-1 alpha-2 country code */
  countryCode: string;
  /** Regular (non-founding) price */
  regularPrice: number;
  /** Founding-client discounted price */
  foundingPrice: number;
  /** ISO 4217 currency code e.g. "PKR" */
  currencyCode: string;
  /** Display symbol e.g. "Rs" */
  currencySymbol: string;
}

export interface ResolvedIndustryPrice {
  activeAmount: number;
  strikeAmount: number | null;
  activeDisplay: string;
  strikeDisplay: string | null;
  isFoundingActive: boolean;
  currencySymbol: string;
  currencyCode: string;
}
