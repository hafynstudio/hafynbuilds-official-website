"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const IndustryExplorerController = dynamic(
  () =>
    import("@/components/investment/IndustryExplorerController").then((m) => ({
      default: m.IndustryExplorerController,
    })),
  { ssr: false, loading: () => null }
);

/**
 * Keeps the static industry grid in server HTML for crawlers and direct links.
 * The controller chunk is requested only after a visitor shows interaction
 * intent inside the explorer (focus, pointer, or keyboard input).
 */
export function IndustryExplorerEnhancer({ children }: { children: React.ReactNode }) {
  const [isInteractive, setIsInteractive] = useState(false);
  const activate = (event?: React.SyntheticEvent) => {
    const target = event?.target;
    if (target instanceof HTMLElement) {
      const category = target.closest<HTMLElement>("[data-industry-category]");
      const section = target.closest<HTMLElement>("[data-industry-explorer]");
      if (category && section) {
        section.dataset.pendingIndustryCategory =
          category.dataset.industryCategory ?? "all";
      }
      const searchInput = target.closest<HTMLInputElement>("[data-industry-search]");
      const searchSection = target.closest<HTMLElement>("[data-industry-explorer]");
      if (searchInput && searchSection) {
        searchSection.dataset.pendingIndustryQuery = searchInput.value;
      }
    }
    void import("@/components/investment/IndustryExplorerController");
    setIsInteractive(true);
  };

  return (
    <div
      onFocusCapture={activate}
      onPointerEnter={() => activate()}
      onKeyDownCapture={activate}
      onInputCapture={activate}
      onClickCapture={activate}
    >
      {children}
      {isInteractive ? <IndustryExplorerController /> : null}
    </div>
  );
}
