"use client";

import { motion, type Variants } from "framer-motion";
import { Check, Clock, RefreshCw, Shield, ArrowRight, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency/context";
import { resolvePrice } from "@/lib/currency/engine";
import { foundationPackages, type FoundationPackage } from "@/data/packages";
import { PriceCallout } from "./PriceCallout";
import { CornerBrackets } from "./CornerBrackets";
import { RecommendedStamp } from "./RecommendedStamp";
import { Button } from "@/components/ui/Button";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

// Foundation packages grid — 3 universal cards.
//
// Mobile-first depth pass (Phase 10 polish):
//   - Cards enter with y+scale, not just fade. On mobile especially
//     the entrance now feels ALIVE — cards arrive, they don't appear.
//   - Real elevation via layered shadows (rest + hover state). No more
//     flat-screenshot feeling.
//   - Growth (Most Chosen) card has a permanent subtle top-border glow
//     so it always reads as the featured tier at a glance.
//   - Corner brackets bumped to size=18 (was 14) so they're visible
//     on real mobile viewports, not just desktop.
//   - Founding badge — icon +2px, text layout fixed so "8 of 8 spots
//     remaining" never wraps ugly mid-phrase.
//   - Meta row (delivery/revisions/support) — icons +1px, numbers
//     bolder, larger tap area vertical.
//   - CTA button size="lg" on mobile for a proper thumb-friendly target.
//   - Tap-scale on cards (0.98) for tactile feedback on touch.

const CONTAINER_VARIANTS = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: EASE_OUT_EXPO },
  },
};

function PackageCard({ pkg, reducedMotion, cardVariants }: { pkg: FoundationPackage; reducedMotion: boolean; cardVariants: Variants }) {
  const { currentPricing, foundingConfig, isHydrated } = useCurrency();
  const resolved = resolvePrice(currentPricing, pkg.id, foundingConfig);
  const isMostChosen = pkg.isMostChosen;

  return (
    <motion.div
      variants={cardVariants}
      whileTap={reducedMotion ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      aria-label={`${pkg.name} package${isMostChosen ? " — most chosen" : ""}`}
      className={cn(
        "group relative flex flex-col rounded-card border bg-bg-elevated",
        "transition-[transform,box-shadow,border-color] duration-base ease-out-quart",
        "shadow-card-rest hover:-translate-y-1 hover:shadow-card-hover",
        pkg.borderClass,
        pkg.glowClass,
        isMostChosen
          ? "border-warning/40 bg-gradient-to-b from-warning/[0.06] via-bg-elevated to-bg-elevated"
          : "border-border-hairline-strong"
      )}
    >
      {/* Corner bracket marks — only on the featured card, thicker on mobile */}
      {isMostChosen && (
        <CornerBrackets colorClass="border-warning/50" size={18} />
      )}

      {/* Top accent line — animated shimmer on the Most Chosen card */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-px rounded-t-card overflow-hidden",
          isMostChosen
            ? "bg-gradient-to-r from-transparent via-warning/70 to-transparent"
            : "bg-gradient-to-r from-transparent via-white/12 to-transparent"
        )}
      />
      {isMostChosen && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] overflow-hidden rounded-t-card"
        >
          <div className="animate-shimmer h-full w-1/2 bg-gradient-to-r from-transparent via-warning to-transparent bg-[length:200%_100%]" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {/* Package header */}
        <div className="mb-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "font-mono text-xs font-semibold uppercase tracking-[0.22em]",
                  pkg.colorClass
                )}
              >
                {pkg.name}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                {pkg.tagline}
              </p>
            </div>
            {isMostChosen && <RecommendedStamp className="shrink-0" />}
          </div>
        </div>

        {/* Price — extra spacing so it breathes */}
        <PriceCallout resolved={resolved} isHydrated={isHydrated} className="mb-5" />

        {/* Founding badge — fixed layout so text never wraps ugly */}
        {resolved.isFoundingActive && isHydrated && (
          <div className="mb-6 flex items-center gap-2.5 rounded-md border border-badge-founding/30 bg-badge-founding/[0.08] px-3 py-2.5">
            <Flame
              size={14}
              className="shrink-0 text-badge-founding"
              aria-hidden="true"
            />
            <p className="flex-1 text-[11px] font-medium leading-tight text-badge-founding sm:text-xs">
              Founding Price ·{" "}
              <span className="font-semibold">
                {foundingConfig.foundingClientSlotsRemaining} of{" "}
                {foundingConfig.foundingClientSlotsTotal} left
              </span>
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="mb-6 h-px bg-border-hairline" aria-hidden="true" />

        {/* Features */}
        <ul className="mb-6 flex-1 space-y-3" aria-label={`${pkg.name} features`}>
          {pkg.features.map((feature) => {
            const isSignature = pkg.signatureFeatures.includes(feature);
            const isInherited = feature.startsWith("Everything in");
            return (
              <li
                key={feature}
                className={cn(
                  "flex items-start gap-2.5 text-sm leading-snug",
                  isInherited
                    ? "text-text-tertiary"
                    : isSignature
                    ? "text-text-primary"
                    : "text-text-secondary"
                )}
              >
                <Check
                  size={15}
                  className={cn(
                    "mt-0.5 shrink-0",
                    isInherited
                      ? "text-text-disabled"
                      : isSignature
                      ? pkg.colorClass
                      : "text-success"
                  )}
                  aria-hidden="true"
                />
                <span>{feature}</span>
              </li>
            );
          })}
        </ul>

        {/* Meta row — bigger, more tactile */}
        <div className="mb-6 grid grid-cols-3 gap-2 rounded-md border border-border-hairline bg-bg-deep p-3.5">
          <div className="text-center">
            <Clock size={13} className="mx-auto mb-1 text-text-tertiary" aria-hidden="true" />
            <p className="font-mono text-xs font-bold text-text-primary">
              {pkg.deliveryDays}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wide text-text-tertiary">
              delivery
            </p>
          </div>
          <div className="border-x border-border-hairline text-center">
            <RefreshCw size={13} className="mx-auto mb-1 text-text-tertiary" aria-hidden="true" />
            <p className="font-mono text-xs font-bold text-text-primary">
              {pkg.revisionRounds} rounds
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wide text-text-tertiary">
              revisions
            </p>
          </div>
          <div className="text-center">
            <Shield size={13} className="mx-auto mb-1 text-text-tertiary" aria-hidden="true" />
            <p className="font-mono text-xs font-bold text-text-primary">
              {pkg.supportPeriod}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wide text-text-tertiary">
              support
            </p>
          </div>
        </div>

        {/* Best for */}
        <p className="mb-6 text-xs leading-relaxed text-text-tertiary">
          <span className="font-semibold text-text-secondary">Best for:</span>{" "}
          {pkg.bestFor}
        </p>

        {/* CTA — large on mobile for thumb-friendly target */}
        <Button
          href="/contact"
          variant={isMostChosen ? "primary" : "secondary"}
          fullWidth
          size="lg"
        >
          {pkg.ctaLabel}
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </div>
    </motion.div>
  );
}

export function FoundationPackages() {
  const reducedMotion = usePrefersReducedMotion();

  // Reduced-motion overrides — opacity-only entrance, no stagger delay.
  const containerVariants = reducedMotion
    ? { hidden: {}, visible: { transition: { staggerChildren: 0 } } }
    : CONTAINER_VARIANTS;
  const cardVariants = reducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0 } } }
    : CARD_VARIANTS;

  return (
    <section
      aria-labelledby="foundation-packages-heading"
      className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:py-24"
    >
      {/* Section heading */}
      <div className="mb-14 text-center sm:mb-16">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          — Universal Packages —
        </p>
        <h2
          id="foundation-packages-heading"
          className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
        >
          Choose your foundation.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-secondary">
          Every website is custom-designed and hand-coded — never a
          template. Select your starting point below.
        </p>
      </div>

      {/* Cards grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3"
      >
        {foundationPackages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} reducedMotion={reducedMotion} cardVariants={cardVariants} />
        ))}
      </motion.div>

      {/* Tease to Industry Explorer (Phase 11) */}
      <p className="mx-auto mt-12 max-w-lg text-center text-sm leading-relaxed text-text-tertiary">
        Need something tailored to your industry?{" "}
        <span className="text-text-secondary">
          Industry-specific packages are coming — browse by sector soon.
        </span>
      </p>
    </section>
  );
}
