"use client";

import { useCallback, useState } from "react";
import { InvestmentHero } from "@/components/investment/InvestmentHero";
import { FoundationPackages } from "@/components/investment/FoundationPackages";
import { IndustryExplorer } from "@/components/investment/IndustryExplorer";
import { CurrencyModal } from "@/components/investment/CurrencyModal";
import { ScanLine } from "@/components/investment/ScanLine";
import { IndustryModal } from "@/components/investment/IndustryModal";
import { CustomPackageCTA } from "@/components/investment/CustomPackageCTA";
import type { Industry } from "@/types/industry";

export function InvestmentExperience() {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);

  const handleIndustrySelect = useCallback((industry: Industry) => {
    setSelectedIndustry(industry);
    setIsIndustryModalOpen(true);
  }, []);

  const handleIndustryModalClose = useCallback(() => {
    setIsIndustryModalOpen(false);
  }, []);

  return (
    <div className="relative min-h-screen bg-bg-deep bg-blueprint-grid">
      {/* Ambient scanner line — blueprint atmosphere without JS-heavy effects. */}
      <ScanLine />

      {/* First-visit currency selection modal. Hydration + localStorage gate
          are controlled by CurrencyProvider in the root layout. */}
      <CurrencyModal />

      <InvestmentHero />
      <FoundationPackages />
      <IndustryExplorer onIndustrySelect={handleIndustrySelect} />
      <CustomPackageCTA />

      <IndustryModal
        industry={selectedIndustry}
        isOpen={isIndustryModalOpen}
        onClose={handleIndustryModalClose}
      />
    </div>
  );
}
