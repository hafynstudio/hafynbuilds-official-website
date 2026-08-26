"use client";

import { useState, useMemo, useCallback, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT_QUART } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { IndustryCard } from "./IndustryCard";
import {
  getVisibleIndustries,
  filterIndustriesByCategory,
  searchIndustries,
} from "@/lib/industries/provider";
import { INDUSTRY_CATEGORIES } from "@/data/industry-categories";

// Stagger timing for the card grid entrance (PRD §3.2: 80–100ms steps).
const CARD_STAGGER_S = 0.05;
// Max cards before stagger delay is capped — avoids > 3s total wait on
// large result sets. Cards beyond this index share the cap delay.
const STAGGER_CAP_INDEX = 12;

// "All Industries" sentinel — stored as `null` in state but displayed
// as a string in the filter pill. Kept as a constant to avoid
// "All Industries" string literals scattered through the component.
const ALL_CATEGORY_VALUE = null;
const ALL_CATEGORY_LABEL = "All";

export function IndustryExplorer() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(
    ALL_CATEGORY_VALUE
  );
  const prefersReducedMotion = usePrefersReducedMotion();
  // useTransition: category/query changes that trigger large grid re-renders
  // are marked as non-urgent. Keeps the UI responsive while filtering.
  const [, startTransition] = useTransition();

  // Base list — all visible industries from the provider.
  // Memoized: getVisibleIndustries() reads a static array in Phase 11
  // (no external fetch), but this pattern is correct for Phase 12 where
  // the provider may do heavier work. Cost here is negligible.
  const allIndustries = useMemo(() => getVisibleIndustries(), []);

  // Derived filtered + searched list.
  // Two-stage pipeline matches the provider's exported functions:
  // 1. category filter (null = no filter = all)
  // 2. search (empty string = no filter = all)
  const visibleIndustries = useMemo(() => {
    const categoryFiltered = filterIndustriesByCategory(
      allIndustries,
      activeCategory
    );
    return searchIndustries(categoryFiltered, query);
  }, [allIndustries, activeCategory, query]);

  const handleQueryChange = useCallback((value: string) => {
    startTransition(() => {
      setQuery(value);
    });
  }, []);

  const handleCategoryChange = useCallback((category: string | null) => {
    startTransition(() => {
      setActiveCategory(category);
      // Clear search when switching category — avoids "0 results" when
      // the user had a term that doesn't exist in the new category.
      setQuery("");
    });
  }, []);

  const isEmpty = visibleIndustries.length === 0;
  const hasActiveFilter = query.trim().length > 0 || activeCategory !== null;

  return (
    <section
      aria-labelledby="industry-explorer-heading"
      className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* ── Section header ─────────────────────────────────────────── */}
      <div className="mb-12 flex flex-col gap-3">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.6, ease: EASE_OUT_QUART }
          }
        >
          {/* Eyebrow */}
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
            Industry Solutions
          </p>
          <h2
            id="industry-explorer-heading"
            className="font-sans text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
          >
            Find your industry.
          </h2>
          <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-text-secondary">
            Every package is built for how your specific industry operates —
            not a generic template with your logo swapped in.
          </p>
        </motion.div>
      </div>

      {/* ── Controls: search + category filters ────────────────────── */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.5, delay: 0.1, ease: EASE_OUT_QUART }
        }
        className="mb-8 flex flex-col gap-4"
      >
        {/* Search bar */}
        <CommandPalette
          placeholder="Search your industry..."
          value={query}
          onChange={handleQueryChange}
          resultCount={query.trim().length > 0 ? visibleIndustries.length : undefined}
          ariaLabel="Search industries"
          resultsId="industry-results-grid"
        />

        {/* Category filter pills */}
        <div
          role="group"
          aria-label="Filter by category"
          className="flex flex-wrap gap-2"
        >
          {/* "All" pill */}
          <CategoryPill
            label={ALL_CATEGORY_LABEL}
            isActive={activeCategory === ALL_CATEGORY_VALUE}
            onClick={() => handleCategoryChange(ALL_CATEGORY_VALUE)}
            prefersReducedMotion={prefersReducedMotion}
          />
          {/* One pill per category */}
          {INDUSTRY_CATEGORIES.map((category) => (
            <CategoryPill
              key={category}
              label={category}
              isActive={activeCategory === category}
              onClick={() => handleCategoryChange(category)}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Industry card grid ──────────────────────────────────────── */}
      <AnimatePresence mode="popLayout">
        {isEmpty ? (
          // Empty state — honest, never fake cards.
          // Two sub-cases: no industries at all (shouldn't happen in Phase 11
          // since all 61 are active) vs. search/filter produced 0 results.
          <motion.div
            key="empty-state"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.3, ease: EASE_OUT_QUART }
            }
            className="flex min-h-48 flex-col items-center justify-center gap-3 text-center"
            role="status"
            aria-live="polite"
          >
            {hasActiveFilter ? (
              <>
                <p className="font-sans text-sm font-medium text-text-secondary">
                  No industries match &ldquo;{query || activeCategory}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleQueryChange("");
                    handleCategoryChange(null);
                  }}
                  className={cn(
                    "font-mono text-xs uppercase tracking-wider text-accent",
                    "underline underline-offset-4 transition-opacity duration-fast",
                    "hover:opacity-70 focus-visible:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-accent"
                  )}
                >
                  Clear filters
                </button>
              </>
            ) : (
              <p className="font-sans text-sm text-text-tertiary">
                Industry solutions expanding soon.
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            id="industry-results-grid"
            // layout on the grid container enables smooth positional
            // transitions as cards reflow during filter/search.
            layout
            className={cn(
              "grid gap-4",
              "grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            )}
            role="list"
            aria-label="Industries"
            aria-live="polite"
            aria-atomic="false"
          >
            {visibleIndustries.map((industry, index) => (
              <div key={industry.id} role="listitem">
                <IndustryCard
                  industry={industry}
                  entranceDelay={
                    Math.min(index, STAGGER_CAP_INDEX) * CARD_STAGGER_S
                  }
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result count footer — screen-reader-accessible live region */}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {visibleIndustries.length} industr
        {visibleIndustries.length === 1 ? "y" : "ies"} shown
      </p>
    </section>
  );
}

// ── CategoryPill ────────────────────────────────────────────────────────
// Kept in this file rather than extracted: it has exactly one consumer
// (IndustryExplorer), it's too small to warrant its own file, and keeping
// it here keeps the filter UI logic and rendering co-located.

interface CategoryPillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  prefersReducedMotion: boolean;
}

function CategoryPill({ label, isActive, onClick, prefersReducedMotion }: CategoryPillProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isActive}
      onClick={onClick}
      className={cn(
        "relative rounded-full px-3 py-1.5",
        "font-sans text-xs font-medium",
        "border transition-[border-color,background-color,color] duration-base ease-out-quart",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep",
        isActive
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-border-hairline bg-bg-elevated text-text-secondary hover:border-border-hover hover:text-text-primary"
      )}
    >
      {label}
      {/* Active indicator dot */}
      {isActive && (
        <motion.span
          layoutId="category-pill-indicator"
          className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-accent"
          aria-hidden="true"
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.2, ease: EASE_OUT_QUART }
          }
        />
      )}
    </button>
  );
}
