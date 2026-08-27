import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_STROKE_WIDTH } from "@/lib/icons";
import { getVisibleIndustries } from "@/lib/industries/provider";
import { INDUSTRY_CATEGORIES } from "@/data/industry-categories";
import { IndustryCard } from "./IndustryCard";
import { IndustryExplorerEnhancer } from "./IndustryExplorerEnhancer";

const ALL_CATEGORY_VALUE = "all";

function CategoryPill({
  label,
  isActive,
  value,
}: {
  label: string;
  isActive: boolean;
  value: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isActive}
      data-industry-category={value}
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
      <span
        data-category-dot
        aria-hidden="true"
        hidden={!isActive}
        className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-accent"
      />
    </button>
  );
}

export function IndustryExplorer() {
  const industries = getVisibleIndustries();

  return (
    <IndustryExplorerEnhancer>
      <section
        aria-labelledby="industry-explorer-heading"
        data-industry-explorer
        className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mb-12 flex flex-col gap-3">
          <div>
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
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4">
          <div className="relative w-full" role="search">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
              size={16}
              strokeWidth={ICON_STROKE_WIDTH}
              aria-hidden="true"
            />
            <input
              type="search"
              role="searchbox"
              data-industry-search
              aria-label="Search industries"
              aria-controls="industry-results-grid"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Search your industry..."
              className={cn(
                "w-full rounded-md py-3 pl-10 pr-12 font-sans text-sm",
                "bg-bg-elevated text-text-primary placeholder:text-text-tertiary",
                "border border-border-hairline-strong",
                "outline-none ring-0",
                "transition-[border-color,box-shadow] duration-base ease-out-quart",
                "focus:border-accent/40 focus:shadow-[0_0_0_3px_rgba(62,123,250,0.12),0_0_24px_rgba(62,123,250,0.08)]",
                "[&::-webkit-search-cancel-button]:hidden",
                "[&::-webkit-search-decoration]:hidden"
              )}
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
              <span
                data-industry-count
                className="font-mono text-xs tabular-nums text-text-tertiary"
                aria-live="polite"
                aria-atomic="true"
              />
              <button
                type="button"
                data-industry-clear
                hidden
                aria-label="Clear search"
                className="rounded-sm text-text-tertiary transition-colors duration-fast hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <X size={13} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
            <CategoryPill
              label="All"
              value={ALL_CATEGORY_VALUE}
              isActive
            />
            {INDUSTRY_CATEGORIES.map((category) => (
              <CategoryPill
                key={category}
                label={category}
                value={category}
                isActive={false}
              />
            ))}
          </div>
        </div>

        <div
          id="industry-results-grid"
          className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          role="list"
          aria-label="Industries"
          aria-live="polite"
          aria-atomic="false"
        >
          {industries.map((industry) => (
            <div key={industry.id} role="listitem">
              <IndustryCard industry={industry} />
            </div>
          ))}
        </div>

        <div
          data-industry-empty
          hidden
          className="flex min-h-48 flex-col items-center justify-center gap-3 text-center"
          role="status"
          aria-live="polite"
        >
          <p className="font-sans text-sm font-medium text-text-secondary">
            No industries match the current filters.
          </p>
          <button
            type="button"
            data-industry-clear-filters
            className={cn(
              "font-mono text-xs uppercase tracking-wider text-accent",
              "underline underline-offset-4 transition-opacity duration-fast",
              "hover:opacity-70 focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-accent"
            )}
          >
            Clear filters
          </button>
        </div>

        <p
          data-industry-count
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {industries.length} industries shown
        </p>
      </section>
    </IndustryExplorerEnhancer>
  );
}
