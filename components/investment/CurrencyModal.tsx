"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency/context";
import {
  useFocusTrap,
  useIsClient,
  usePrefersReducedMotion,
} from "@/lib/hooks";
import { EASE_OUT_EXPO } from "@/lib/motion";

// First-visit currency selection experience.
//
// Behavior:
//   - Auto-opens 400ms after first mount when no localStorage preference
//     exists (see CurrencyProvider). Page renders with detected pricing
//     underneath, then modal fades in on top — user sees prices immediately.
//   - Users can reopen via the CurrencySwitcher in the header at any time.
//   - Search filters by country name, currency code, or symbol.
//   - Desktop: centered modal card. Mobile: bottom sheet with drag handle.
//   - Focus trapped inside while open; Escape closes; body scroll locked.
//
// Uses createPortal to escape the Investment page's stacking context —
// otherwise the blueprint-grid background and scan-line would interfere
// with the modal's z-index and blur.
export function CurrencyModal() {
  const {
    isModalOpen,
    closeModal,
    selectCountry,
    allCountries,
    currentPricing,
  } = useCurrency();
  const prefersReduced = usePrefersReducedMotion();
  const isClient = useIsClient();
  const [query, setQuery] = useState("");
  const [selectedOverride, setSelectedOverride] = useState<string | null>(null);
  const selected = selectedOverride ?? currentPricing.countryCode;
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useFocusTrap(panelRef, isModalOpen);

  // createPortal requires document — client availability is provided by the
  // shared SSR-safe external-store hook below.

  // Reset search + focus the input when the modal opens. The state reset is
  // scheduled with the opening frame instead of written synchronously in the
  // effect body.
  useEffect(() => {
    if (!isModalOpen) return;
    const frame = requestAnimationFrame(() => {
      setQuery("");
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [isModalOpen]);

  const dismiss = useCallback(() => {
    setSelectedOverride(null);
    closeModal();
  }, [closeModal]);

  // Escape-to-close. Focus-trap (Tab cycling) lives in useFocusTrap.
  useEffect(() => {
    if (!isModalOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isModalOpen, dismiss]);

  // Body-scroll lock. Save/restore prior overflow value in case something
  // else is already stacking overlays.
  useEffect(() => {
    if (!isModalOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [isModalOpen]);

  const filtered = allCountries.filter((c) =>
    `${c.countryName} ${c.currencyCode} ${c.currencySymbol}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  function handleConfirm() {
    selectCountry(selected);
    setSelectedOverride(null);
  }

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-modal flex items-end justify-center sm:items-center sm:p-4">
          {/* Backdrop — click to close */}
          <motion.div
            className="absolute inset-0 bg-bg-deep/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0.01 : 0.25 }}
            onClick={dismiss}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="currency-modal-title"
            tabIndex={-1}
            className={cn(
              "relative z-10 flex w-full flex-col bg-bg-secondary outline-none",
              "border border-border-hairline-strong",
              "max-h-[92vh] rounded-t-2xl",
              "sm:max-h-[80vh] sm:max-w-2xl sm:rounded-xl"
            )}
            initial={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, y: 40, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, y: 20, scale: 0.97 }
            }
            transition={
              prefersReduced
                ? { duration: 0.01 }
                : { duration: 0.4, ease: EASE_OUT_EXPO }
            }
          >
            {/* Mobile drag-handle affordance (visual only — actual drag
                lives in the base Modal primitive for consistency; here
                we skip drag since the picker task benefits from stability) */}
            <div
              aria-hidden="true"
              className="flex justify-center pt-3 pb-1 sm:hidden"
            >
              <span className="h-1 w-10 rounded-full bg-border-hover" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between border-b border-border-hairline px-6 py-5">
              <div>
                <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                  — Select Region —
                </p>
                <h2
                  id="currency-modal-title"
                  className="text-xl font-semibold text-text-primary"
                >
                  Show me prices in…
                </h2>
                <p className="mt-1.5 text-sm text-text-secondary">
                  Every price is hand-calibrated for your local market.
                </p>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Close currency selector"
                className="ml-4 shrink-0 rounded-md p-1.5 text-text-secondary transition-colors duration-fast hover:bg-surface hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="border-b border-border-hairline px-4 py-3">
              <div className="flex items-center gap-3 rounded-md border border-border bg-bg-tertiary px-3 py-2.5 transition-colors duration-fast focus-within:border-accent/60">
                <Search
                  size={15}
                  className="shrink-0 text-text-tertiary"
                  aria-hidden="true"
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search country or currency…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
                  aria-label="Search countries"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="text-text-tertiary transition-colors duration-fast hover:text-text-secondary"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Country grid */}
            <div
              role="listbox"
              aria-label="Available countries"
              className="flex-1 overflow-y-auto p-4"
            >
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-text-tertiary">
                  No matching country found.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {filtered.map((country) => {
                    const isSelected = selected === country.countryCode;
                    return (
                      <button
                        key={country.countryCode}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => setSelectedOverride(country.countryCode)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all duration-fast",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg-secondary",
                          isSelected
                            ? "border-accent/50 bg-accent/10 text-text-primary"
                            : "border-transparent bg-bg-tertiary text-text-secondary hover:border-border hover:bg-surface hover:text-text-primary"
                        )}
                      >
                        <span
                          className="text-xl leading-none"
                          aria-hidden="true"
                        >
                          {country.flag}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium leading-tight">
                            {country.countryName}
                          </span>
                          <span className="block font-mono text-xs text-text-tertiary">
                            {country.currencyCode} · {country.currencySymbol}
                          </span>
                        </span>
                        {isSelected && (
                          <span
                            className="h-2 w-2 shrink-0 rounded-full bg-accent"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border-hairline px-6 py-4">
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                  <MapPin size={12} aria-hidden="true" />
                  <span>Change anytime from the header.</span>
                </div>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className={cn(
                    "w-full rounded-button bg-accent px-5 py-2.5 text-sm font-semibold text-white sm:w-auto",
                    "transition-colors duration-fast hover:bg-accent-hover",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
                  )}
                >
                  Confirm & Continue
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
