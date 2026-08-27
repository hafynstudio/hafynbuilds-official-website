"use client";

import { InvestmentHero } from "@/components/investment/InvestmentHero";
import { FoundationPackages } from "@/components/investment/FoundationPackages";
import { IndustryExplorer } from "@/components/investment/IndustryExplorer";
import { DeferredCurrencyModal } from "@/components/investment/DeferredCurrencyModal";
import { ScanLine } from "@/components/investment/ScanLine";
import { CustomPackageCTA } from "@/components/investment/CustomPackageCTA";

export function InvestmentExperience() {
  return (
    <div className="relative min-h-screen bg-bg-deep bg-blueprint-grid">
      {/* Ambient scanner line — blueprint atmosphere without JS-heavy effects. */}
      <ScanLine />

      {/* Explicit-only currency selection. The heavy modal graph loads after
          the visitor activates the header switcher. */}
      <DeferredCurrencyModal />

      <InvestmentHero />
      <FoundationPackages />
      <IndustryExplorer />
      <CustomPackageCTA />
    </div>
  );
}
