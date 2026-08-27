"use client";

import dynamic from "next/dynamic";
import { useCurrency } from "@/lib/currency/context";

const CurrencyModalClient = dynamic(
  () =>
    import("@/components/investment/CurrencyModal").then((m) => ({
      default: m.CurrencyModal,
    })),
  { ssr: false, loading: () => null }
);

/**
 * The currency picker is an explicit user action, not a first-paint
 * requirement. Keep the provider state and trigger lightweight; load the
 * modal graph only after CurrencySwitcher calls openModal().
 */
export function DeferredCurrencyModal() {
  const { isModalOpen } = useCurrency();
  return isModalOpen ? <CurrencyModalClient /> : null;
}
