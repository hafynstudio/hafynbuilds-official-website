"use client";

import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { PackageCard } from "./PackageCard";
import { getPackagesForIndustry } from "@/data/industry-packages";
import { getIndustryPackagePrice } from "@/data/industry-package-pricing";
import { ICON_MAP, ICON_STROKE_WIDTH } from "@/lib/icons";
import { useCurrency } from "@/lib/currency/context";
import type { Industry } from "@/types/industry";

interface IndustryModalProps {
  industry: Industry | null;
  isOpen: boolean;
  onClose: () => void;
}

export function IndustryModal({
  industry,
  isOpen,
  onClose,
}: IndustryModalProps) {
  const { currentPricing } = useCurrency();

  if (!industry) return null;

  const packages = getPackagesForIndustry(industry.id);
  const IconComponent = ICON_MAP[industry.iconOrIllustration];

  const pricedPackageCount = packages.filter((pkg) =>
    getIndustryPackagePrice(pkg.id, currentPricing.countryCode)
  ).length;

  const hasLocalizedPricing = pricedPackageCount > 0;
  const isEmpty = packages.length === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${industry.name} packages`}
      className="bg-bg-deep bg-blueprint-grid"
    >
      <div className="relative min-h-screen px-4 pb-24 pt-20 sm:px-8 lg:px-12">
        <header className="mb-12 max-w-4xl">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border-hairline bg-bg-elevated text-accent">
              {IconComponent ? (
                <IconComponent size={22} strokeWidth={ICON_STROKE_WIDTH} aria-hidden="true" />
              ) : null}
            </div>

            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                {industry.category}
              </p>
              <h2 className="font-sans text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
                {industry.name} Packages.
              </h2>
            </div>
          </div>

          <p className="max-w-2xl font-sans text-base leading-relaxed text-text-secondary">
            {industry.description} These packages are structured around how this
            industry actually operates — not a generic site with surface-level edits.
          </p>

          {!hasLocalizedPricing && !isEmpty && (
            <div
              className="mt-6 rounded-card border border-warning/20 bg-warning/6 px-4 py-4"
              role="status"
              aria-live="polite"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-warning">
                Localized Pricing Note
              </p>
              <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-text-secondary">
                Pricing for your currently selected region is being configured.
                You can still review the package scope and request an exact quote.
              </p>
            </div>
          )}
        </header>

        {isEmpty ? (
          <section className="rounded-card border border-border-hairline bg-bg-elevated p-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              No Packages Available
            </p>
            <h3 className="mt-3 font-sans text-2xl font-bold text-text-primary">
              This industry has no live packages yet.
            </h3>
            <p className="mx-auto mt-3 max-w-2xl font-sans text-sm leading-relaxed text-text-secondary">
              We only show real package structures once they exist. If you need a
              build in this category, contact us for a custom solution.
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-sm border border-text-primary px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-primary transition-colors duration-base hover:bg-text-primary hover:text-bg-deep"
              >
                Request Custom Build
              </Link>
            </div>
          </section>
        ) : (
          <section
            className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            aria-label={`${industry.name} package options`}
          >
            {packages.map((pkg, index) => (
              <PackageCard key={pkg.id} pkg={pkg} index={index} />
            ))}
          </section>
        )}

        <footer className="mt-16 border-t border-border-hairline/30 pt-10 text-center">
          <p className="font-sans text-sm text-text-tertiary">
            Need something more tailored than a fixed package?
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center justify-center rounded-sm border border-accent/30 bg-accent/6 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-primary transition-[background-color,border-color,color] duration-base hover:border-accent hover:bg-accent hover:text-white"
          >
            Request a Custom Build
          </Link>
        </footer>
      </div>
    </Modal>
  );
}
