// HAFYN BUILDS — Currency Engine
// Pure module. No React, no side effects, fully unit-testable in isolation.
// Single responsibility: given a CountryPricing record + a PackageTier +
// the founding config, return the correct display strings.
// Never derives prices — only reads from the explicit lookup table.

import type { CountryPricing, PackageTier } from "@/types/currency";
import type { FoundingConfig } from "@/data/founding-config";

export interface ResolvedPrice {
  /** The active price to display prominently (founding or regular) */
  activeAmount: number;
  /** The original price to show struck-through (only when founding is active) */
  strikeAmount: number | null;
  /** Formatted display string for the active price, e.g. "Rs 32,999" */
  activeDisplay: string;
  /** Formatted display string for the strike price, e.g. "Rs 44,999" */
  strikeDisplay: string | null;
  /** Whether the founding discount is currently active */
  isFoundingActive: boolean;
  /** Currency symbol used, e.g. "Rs", "$" */
  currencySymbol: string;
  /** Currency code used, e.g. "PKR", "USD" */
  currencyCode: string;
}

/** Currencies where the symbol conventionally goes AFTER the number */
const SYMBOL_SUFFIX_CURRENCIES = new Set(["CHF", "SAR", "AED", "KES"]);

/** Currencies with no decimal places in standard display */
const NO_DECIMAL_CURRENCIES = new Set([
  "PKR", "INR", "BDT", "LKR", "NPR", "IDR", "PHP",
  "EGP", "NGN", "JPY", "KRW", "TRY", "MXN", "KES",
]);

/**
 * Format a raw number into a display string for a given currency.
 * Uses Intl.NumberFormat for locale-aware thousand separators.
 * Symbol placement respects per-currency conventions (prefix vs suffix).
 */
export function formatCurrencyAmount(
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
 * Core price resolver. Given a country's pricing data, the target
 * package tier, and the founding config, returns all display-ready
 * strings the UI needs. No calculation — pure lookup + formatting.
 */
export function resolvePrice(
  pricing: CountryPricing,
  tier: PackageTier,
  config: FoundingConfig
): ResolvedPrice {
  const { currencyCode, currencySymbol } = pricing;

  const regularKey = `${tier}Regular` as keyof CountryPricing;
  const foundingKey = `${tier}Founding` as keyof CountryPricing;

  const regularAmount = pricing[regularKey] as number;
  const foundingAmount = pricing[foundingKey] as number;

  const isFoundingActive = config.foundingPricingActive;
  const activeAmount = isFoundingActive ? foundingAmount : regularAmount;
  const strikeAmount = isFoundingActive ? regularAmount : null;

  return {
    activeAmount,
    strikeAmount,
    activeDisplay: formatCurrencyAmount(activeAmount, currencyCode, currencySymbol),
    strikeDisplay: strikeAmount !== null
      ? formatCurrencyAmount(strikeAmount, currencyCode, currencySymbol)
      : null,
    isFoundingActive,
    currencySymbol,
    currencyCode,
  };
}
