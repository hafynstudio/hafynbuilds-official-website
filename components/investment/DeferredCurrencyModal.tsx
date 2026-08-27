"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "@/lib/currency/context";
import type { CurrencyModal } from "@/components/investment/CurrencyModal";

type CurrencyModalComponent = typeof CurrencyModal;

/**
 * Loads the modal only after the user explicitly opens it. Keeping the
 * import inside the open-state effect prevents the modal and its dialog
 * dependencies from entering the initial Investment hydration path.
 */
export function DeferredCurrencyModal() {
  const { isModalOpen } = useCurrency();
  const [CurrencyModalClient, setCurrencyModalClient] =
    useState<CurrencyModalComponent | null>(null);

  useEffect(() => {
    if (!isModalOpen || CurrencyModalClient) return;
    let active = true;
    void import("@/components/investment/CurrencyModal").then((module) => {
      if (active) setCurrencyModalClient(() => module.CurrencyModal);
    });
    return () => {
      active = false;
    };
  }, [isModalOpen, CurrencyModalClient]);

  if (!CurrencyModalClient) return null;
  return <CurrencyModalClient />;
}
