"use client";

import { useEffect } from "react";
const SEARCH_SELECTOR = "[data-industry-search]";
const CATEGORY_SELECTOR = "button[data-industry-category]";
const CARD_SELECTOR = "[data-industry-card]";
const EMPTY_SELECTOR = "[data-industry-empty]";
const COUNT_SELECTOR = "[data-industry-count]";

/**
 * Progressive enhancement for the server-rendered industry explorer.
 * Filtering remains instant after intent, but the large Framer Motion/client
 * controller is no longer part of the initial Investment hydration graph.
 */
export function IndustryExplorerController() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>(
      "[data-industry-explorer]"
    );
    if (!section) return;

    const search = section.querySelector<HTMLInputElement>(SEARCH_SELECTOR);
    const pendingQuery = section.dataset.pendingIndustryQuery ?? "";
    if (search && pendingQuery) search.value = pendingQuery;
    delete section.dataset.pendingIndustryQuery;
    const categories = Array.from(
      section.querySelectorAll<HTMLButtonElement>(CATEGORY_SELECTOR)
    );
    const cards = Array.from(
      section.querySelectorAll<HTMLElement>(CARD_SELECTOR)
    );
    const empty = section.querySelector<HTMLElement>(EMPTY_SELECTOR);
    const grid = section.querySelector<HTMLElement>("#industry-results-grid");
    const counts = Array.from(section.querySelectorAll<HTMLElement>(COUNT_SELECTOR));
    const clearSearch = section.querySelector<HTMLButtonElement>("[data-industry-clear]");
    const clearFilters = section.querySelector<HTMLButtonElement>("[data-industry-clear-filters]");
    let activeCategory: string | null =
      section.dataset.pendingIndustryCategory &&
      section.dataset.pendingIndustryCategory !== "all"
        ? section.dataset.pendingIndustryCategory
        : null;
    delete section.dataset.pendingIndustryCategory;

    const update = () => {
      const query = (search?.value ?? "").trim().toLowerCase();
      const visibleCards = cards.filter((card) => {
        const matchesCategory =
          !activeCategory || card.dataset.industryCategory === activeCategory;
        const matchesQuery =
          query.length === 0 ||
          (card.dataset.industrySearchText ?? "").includes(query);
        return matchesCategory && matchesQuery;
      });
      const visibleIds = new Set(visibleCards.map((card) => card.dataset.industryCard ?? ""));

      cards.forEach((card) => {
        const visibleCard = visibleIds.has(card.dataset.industryCard ?? "");
        card.hidden = !visibleCard;
        card.parentElement?.toggleAttribute("hidden", !visibleCard);
      });

      categories.forEach((button) => {
        const isActive = (button.dataset.industryCategory ?? "") ===
          (activeCategory ?? "all");
        button.setAttribute("aria-checked", String(isActive));
        button.classList.toggle("border-accent\/40", isActive);
        button.classList.toggle("bg-accent\/10", isActive);
        button.classList.toggle("text-accent", isActive);
        button.classList.toggle("border-border-hairline", !isActive);
        button.classList.toggle("bg-bg-elevated", !isActive);
        button.classList.toggle("text-text-secondary", !isActive);
        const dot = button.querySelector<HTMLElement>("[data-category-dot]");
        if (dot) dot.hidden = !isActive;
      });

      const visibleCount = visibleCards.length;
      const hasResults = visibleCount > 0;
      if (grid) grid.hidden = !hasResults;
      if (empty) empty.hidden = hasResults;
      counts.forEach((resultCount, index) => {
        resultCount.textContent = index === 0 && query.trim().length === 0
          ? ""
          : `${visibleCount} ${visibleCount === 1 ? "industry" : "industries"} shown`;
      });
      if (clearSearch) clearSearch.hidden = query.trim().length === 0;
    };

    const onSearch = () => update();
    const reset = () => {
      if (search) search.value = "";
      activeCategory = null;
      update();
    };
    const onCategory = (event: Event) => {
      const button = event.currentTarget as HTMLButtonElement;
      activeCategory = button.dataset.industryCategory === "all"
        ? null
        : button.dataset.industryCategory ?? null;
      if (search) search.value = "";
      update();
    };

    search?.addEventListener("input", onSearch);
    clearSearch?.addEventListener("click", reset);
    clearFilters?.addEventListener("click", reset);
    categories.forEach((button) => button.addEventListener("click", onCategory));
    update();

    return () => {
      search?.removeEventListener("input", onSearch);
      clearSearch?.removeEventListener("click", reset);
      clearFilters?.removeEventListener("click", reset);
      categories.forEach((button) => button.removeEventListener("click", onCategory));
    };
  }, []);

  return null;
}
