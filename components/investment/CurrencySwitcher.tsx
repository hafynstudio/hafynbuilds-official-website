"use client";

import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency/context";

interface CurrencySwitcherProps {
  className?: string;
}

// Persistent currency selector pill shown in the site header on the
// Investment page (and its sub-routes). Compact by design — flag +
// globe icon + currency code, nothing more. Clicking it reopens the
// full CurrencyModal so users can change their selection.
//
// Skeleton state matches the pill's exact width to prevent CLS
// (Cumulative Layout Shift) during the ~200ms window between mount
// and CurrencyProvider hydration. Header layout stays stable.
export function CurrencySwitcher({ className }: CurrencySwitcherProps) {
  const { currentPricing, openModal, isHydrated } = useCurrency();

  if (!isHydrated) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "relative h-8 w-[92px] overflow-hidden rounded-full bg-surface",
          className
        )}
      >
        <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-surface-raised/60 to-transparent" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={openModal}
      aria-label={`Change currency. Currently showing prices in ${currentPricing.currencyCode} for ${currentPricing.countryName}. Click to change.`}
      className={cn(
        "group flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5",
        "text-sm font-medium text-text-secondary",
        "transition-all duration-fast hover:border-accent/50 hover:bg-surface-raised hover:text-text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        className
      )}
    >
      <span className="text-base leading-none" aria-hidden="true">
        {currentPricing.flag}
      </span>
      <Globe
        size={12}
        className="text-text-tertiary transition-colors duration-fast group-hover:text-accent"
        aria-hidden="true"
      />
      <span className="font-mono text-xs tracking-wide">
        {currentPricing.currencyCode}
      </span>
    </button>
  );
}
