"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useCurrency } from "@/lib/currency/context";
import { resolveIndustryPrice } from "@/lib/currency/industry-engine";
import { getIndustryPackagePrice } from "@/data/industry-package-pricing";
import { PriceCallout } from "./PriceCallout";
import { CornerBrackets } from "./CornerBrackets";
import { MOTION_DURATION_S } from "@/lib/motion";
import { RecommendedStamp } from "./RecommendedStamp";
import type { ResolvedPrice } from "@/lib/currency/engine";
import type { IndustryPackage } from "@/types/industry-package";

interface PackageCardProps {
  pkg: IndustryPackage;
  index: number;
}

export function PackageCard({ pkg, index }: PackageCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { currentPricing, foundingConfig, isHydrated } = useCurrency();

  const rawPriceData = getIndustryPackagePrice(pkg.id, currentPricing.countryCode);
  const resolved = resolveIndustryPrice(rawPriceData, foundingConfig);

  // PriceCallout requires a ResolvedPrice object even when isHydrated is false.
  // This placeholder is never meaningfully rendered once hydration completes.
  const skeletonResolved: ResolvedPrice = {
    activeAmount: 0,
    strikeAmount: null,
    activeDisplay: "",
    strikeDisplay: null,
    isFoundingActive: false,
    currencySymbol: currentPricing.currencySymbol,
    currencyCode: currentPricing.currencyCode,
  };

  const isPricingAvailable = resolved !== null;

  return (
    <article
      style={
        prefersReducedMotion
          ? undefined
          : ({ "--package-card-delay": `${index * MOTION_DURATION_S.staggerStep}s` } as React.CSSProperties)
      }
      className={cn(
        !prefersReducedMotion && "package-card-entrance",
        "group relative flex h-full flex-col rounded-card border p-6",
        "bg-bg-elevated shadow-card-rest",
        "transition-[border-color,background-color,box-shadow,transform] duration-base ease-out-quart",
        "hover:-translate-y-1 active:-translate-y-0.5 motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0 hover:bg-bg-elevated-hover active:bg-bg-elevated-hover hover:shadow-card-hover active:shadow-card-hover motion-reduce:transform-none",
        pkg.isMostChosen
          ? "border-accent/30 ring-1 ring-accent/10"
          : "border-border-hairline hover:border-border-hover"
      )}
    >
      {pkg.isMostChosen && (
        <>
          <CornerBrackets />
          <RecommendedStamp />
        </>
      )}

      <header className="mb-6">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
          {pkg.name}
        </p>
        <h3 className="mb-2 font-sans text-xl font-bold leading-tight text-text-primary">
          {pkg.tagline}
        </h3>
        <p className="font-sans text-sm leading-relaxed text-text-tertiary">
          {pkg.description}
        </p>
      </header>

      <div className="mb-8">
        {!isHydrated ? (
          <PriceCallout resolved={skeletonResolved} isHydrated={false} />
        ) : isPricingAvailable ? (
          <PriceCallout resolved={resolved} isHydrated={true} />
        ) : (
          <div
            className="rounded-sm border border-border-hairline bg-bg-primary/40 px-4 py-4"
            role="status"
            aria-live="polite"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-warning">
              Pricing On Request
            </p>
            <p className="mt-2 font-sans text-sm leading-relaxed text-text-secondary">
              Localized pricing for this package is being configured for your region.
              You can still request this build now.
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-wider text-text-disabled">
          <span>{pkg.deliveryDays} Delivery</span>
          <span>{pkg.revisionRounds} Revisions</span>
          <span>{pkg.supportPeriod} Support</span>
        </div>
      </div>

      <div className="mb-8 flex-grow">
        <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-widest text-text-secondary">
          What&apos;s Included
        </p>

        <ul className="space-y-3" role="list">
          {pkg.features.map((feature) => {
            const isSignature = pkg.signatureFeatures.includes(feature);

            return (
              <li key={feature} className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                    isSignature
                      ? "border-accent/40 bg-accent/6 text-accent"
                      : "border-border-hairline text-text-disabled"
                  )}
                >
                  <Check size={10} strokeWidth={3} />
                </div>

                <span
                  className={cn(
                    "font-sans text-sm leading-snug",
                    isSignature ? "font-medium text-text-primary" : "text-text-secondary"
                  )}
                >
                  {feature}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <footer className="mt-auto border-t border-border-hairline/50 pt-6">
        <p className="mb-4 font-sans text-xs italic leading-relaxed text-text-tertiary">
          Best for: {pkg.bestFor}
        </p>

        <Link
          href="/contact"
          className={cn(
            "inline-flex w-full items-center justify-center rounded-sm border px-4 py-3",
            "font-mono text-[11px] uppercase tracking-[0.18em]",
            "transition-[background-color,border-color,color,transform] duration-base ease-out-quart active:translate-y-px",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep",
            pkg.isMostChosen
              ? "border-accent/30 bg-accent/6 text-text-primary hover:border-accent hover:bg-accent hover:text-white"
              : "border-border-hairline text-text-primary hover:border-text-primary hover:bg-text-primary hover:text-bg-deep"
          )}
        >
          {isPricingAvailable ? "Discuss This Build" : "Request Exact Quote"}
        </Link>
      </footer>
    </article>
  );
}
