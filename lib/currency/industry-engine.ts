// HAFYN BUILDS — Industry Package Pricing Engine
// Pure module. No React, no side effects, fully testable.
// Mirrors lib/currency/engine.ts pattern but for industry packages.

import type { IndustryPackagePrice, ResolvedIndustryPrice } from "@/types/industry-package-pricing";
import type { FoundingConfig } from "@/data/founding-config";

/** Currencies where symbol goes AFTER the number */
const SYMBOL_SUFFIX_CURRENCIES = new Set(["CHF", "SAR", "AED", "KES"]);

/** Currencies with no decimal places */
const NO_DECIMAL_CURRENCIES = new Set([
  "PKR", "INR", "BDT", "LKR", "NPR", "IDR", "PHP",
  "EGP", "NGN", "JPY", "KRW", "TRY", "MXN", "KES",
]);

/**
 * Format a raw number into a display string for a given currency.
 */
export function formatIndustryPrice(
  amount: number,
  currencyCode: string,
  currencySymbol: string
): string {
  const useDecimals = !NO_DECIMAL_CURRENCIES.has(currencyCode);
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: useDecimals ? 2 : 0,
    maximumFractionDigits: useDecimals ? 2 : 0,
  }).format(amount);

  if (SYMBOL_SUFFIX_CURRENCIES.has(currencyCode)) {
    return `${formatted} ${currencySymbol}`;
  }
  return `${currencySymbol} ${formatted}`;
}

/**
 * Resolve the display price for an industry package.
 * Returns null if no pricing found for this package+country combo.
 */
export function resolveIndustryPrice(
  pricing: IndustryPackagePrice | undefined,
  config: FoundingConfig
): ResolvedIndustryPrice | null {
  if (!pricing) return null;

  const { currencyCode, currencySymbol, regularPrice, foundingPrice } = pricing;
  const isFoundingActive = config.foundingPricingActive;
  const activeAmount = isFoundingActive ? foundingPrice : regularPrice;
  const strikeAmount = isFoundingActive ? regularPrice : null;

  return {
    activeAmount,
    strikeAmount,
    activeDisplay: formatIndustryPrice(activeAmount, currencyCode, currencySymbol),
    strikeDisplay: strikeAmount !== null
      ? formatIndustryPrice(strikeAmount, currencyCode, currencySymbol)
      : null,
    isFoundingActive,
    currencySymbol,
    currencyCode,
  };
}
