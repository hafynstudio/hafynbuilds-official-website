// HAFYN BUILDS — Currency & Pricing Types
// All pricing is stored as explicit per-country lookup values.
// No rate-conversion calculation on the frontend — ever.

export interface CountryPricing {
  /** ISO 3166-1 alpha-2 country code */
  countryCode: string;
  /** Display name, e.g. "Pakistan" */
  countryName: string;
  /** Flag emoji */
  flag: string;
  /** ISO 4217 currency code, e.g. "PKR" */
  currencyCode: string;
  /** Currency symbol or prefix used in display, e.g. "Rs", "$", "£" */
  currencySymbol: string;
  /** Foundation package — regular (strikethrough) price */
  foundationRegular: number;
  /** Foundation package — founding client discounted price */
  foundationFounding: number;
  /** Growth package — regular (strikethrough) price */
  growthRegular: number;
  /** Growth package — founding client discounted price */
  growthFounding: number;
  /** Business package — regular (strikethrough) price */
  businessRegular: number;
  /** Business package — founding client discounted price */
  businessFounding: number;
}

export type PackageTier = "foundation" | "growth" | "business";

export interface CurrencyPreference {
  countryCode: string;
  currencyCode: string;
  setAt: number;
}
