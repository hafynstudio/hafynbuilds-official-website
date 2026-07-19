export interface CurrencyRate {
  currencyCode: string; // "PKR", "INR", "EUR", etc.
  rateFromUSD: number;  // admin-editable
  countryCodes: string[];
}

export interface PriceOverride {
  packageId: string;
  countryCode: string;
  fixedPrice: number;
  currencyCode: string;
}
