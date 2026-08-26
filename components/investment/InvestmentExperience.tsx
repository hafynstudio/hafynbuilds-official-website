"use client";

import { InvestmentHero } from "@/components/investment/InvestmentHero";
import { FoundationPackages } from "@/components/investment/FoundationPackages";
import { IndustryExplorer } from "@/components/investment/IndustryExplorer";
import { CurrencyModal } from "@/components/investment/CurrencyModal";
import { ScanLine } from "@/components/investment/ScanLine";
import { CustomPackageCTA } from "@/components/investment/CustomPackageCTA";

export function InvestmentExperience() {
  return (
    <div className="relative min-h-screen bg-bg-deep bg-blueprint-grid">
      {/* Ambient scanner line — blueprint atmosphere without JS-heavy effects. */}
      <ScanLine />

      {/* First-visit currency selection modal. Hydration + localStorage gate
          are controlled by CurrencyProvider in the root layout. */}
      <CurrencyModal />

      <InvestmentHero />
      <FoundationPackages />
      <IndustryExplorer />
      <CustomPackageCTA />
    </div>
  );
}
