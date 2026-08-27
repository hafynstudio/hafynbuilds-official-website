"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CountryPricing, CurrencyPreference } from "@/types/currency";
import {
  countryPricingTable,
  fallbackPricing,
  getPricingByCountry,
} from "@/data/currency-rates";
import { foundingConfig } from "@/data/founding-config";
import type { FoundingConfig } from "@/data/founding-config";

const STORAGE_KEY = "hafyn_currency_pref";

interface CurrencyContextValue {
  /** Full pricing record for the currently selected country */
  currentPricing: CountryPricing;
  /** All 28 supported country pricing records (for the modal grid) */
  allCountries: CountryPricing[];
  /** Founding config — foundingPricingActive, slots, etc. */
  foundingConfig: FoundingConfig;
  /** Whether the currency selection modal is open */
  isModalOpen: boolean;
  /** Open the currency modal (e.g. from the CurrencySwitcher) */
  openModal: () => void;
  /** Close the currency modal without changing selection */
  closeModal: () => void;
  /** Select a country and persist to localStorage */
  selectCountry: (countryCode: string) => void;
  /** True after the first preference-check has completed —
   *  prevents a flash where fallback pricing is shown then replaced */
  isHydrated: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Initialize with fallback pricing (US/USD) so the first render always
  // has a valid CountryPricing object. useEffect below replaces it with
  // stored preference or geo-detected country as soon as we hydrate.
  const [currentPricing, setCurrentPricing] =
    useState<CountryPricing>(fallbackPricing);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    async function initCurrency() {
      try {
        // 1. Check localStorage first — if we have a stored preference,
        //    use it and skip the modal entirely.
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const pref: CurrencyPreference = JSON.parse(stored);
          const pricing = getPricingByCountry(pref.countryCode);
          if (pricing) {
            setCurrentPricing(pricing);
            setIsHydrated(true);
            return;
          }
        }

        // 2. No stored preference — detect country via geo API.
        const res = await fetch("/api/geo");
        const data = await res.json();
        const detected =
          getPricingByCountry(data.countryCode) ?? fallbackPricing;
        setCurrentPricing(detected);
        setIsHydrated(true);

        // The modal is intentionally explicit-only. CurrencySwitcher calls
        // openModal() when the visitor asks to change region; keeping it out
        // of the initial lifecycle avoids loading modal search/focus logic
        // during hydration.
      } catch {
        // Geo detection failed — silently use USD fallback, no modal.
        setCurrentPricing(fallbackPricing);
        setIsHydrated(true);
      }
    }

    initCurrency();
  }, []);

  const selectCountry = useCallback((countryCode: string) => {
    const pricing = getPricingByCountry(countryCode) ?? fallbackPricing;
    setCurrentPricing(pricing);
    setIsModalOpen(false);

    const pref: CurrencyPreference = {
      countryCode: pricing.countryCode,
      currencyCode: pricing.currencyCode,
      setAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <CurrencyContext.Provider
      value={{
        currentPricing,
        allCountries: countryPricingTable,
        foundingConfig,
        isModalOpen,
        openModal,
        closeModal,
        selectCountry,
        isHydrated,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used inside <CurrencyProvider>");
  }
  return ctx;
}
