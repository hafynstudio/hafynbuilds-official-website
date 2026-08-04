"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { BLOG_CATEGORIES } from "@/data/blog-posts";
import { cn } from "@/lib/utils";

// ─── Component ───────────────────────────────────────────────────────────────
// Owns the search input (ephemeral useState in parent BlogExperience)
// and renders category pills as real <Link> elements pointing to
// /blog/category/[slug] (SSG routes — Decision: Hybrid Architecture).
// Search is client-side instant filter. Categories are server routes.

interface BlogSearchProps {
  /** Current search query — controlled by BlogExperience. */
  searchQuery: string;
  /** Called on every keystroke. BlogExperience owns the state. */
  onSearchChange: (value: string) => void;
  /** Number of posts currently visible after search filtering.
   * Passed through to CommandPalette's result count badge. */
  resultCount: number;
  /** Total posts available (before search). When 0, search input
   * is visually dimmed — there's nothing to search. */
  totalPosts: number;
  /** ID of the results region the search input controls. Passed
   * through to CommandPalette's `resultsId` prop. */
  resultsId?: string;
}

export function BlogSearch({
  searchQuery,
  onSearchChange,
  resultCount,
  totalPosts,
  resultsId,
}: BlogSearchProps) {
  const pathname = usePathname();
  const isEmpty = totalPosts === 0;

  // Determine active category from current URL path
  const activeSlug = (() => {
    if (!pathname) return null;
    const match = pathname.match(/^\/blog\/category\/([^/]+)$/);
    return match ? match[1] : null;
  })();

  const isAllActive = pathname === "/blog";

  return (
    <div className="flex flex-col gap-4">
      {/* Search input */}
      <CommandPalette
        placeholder="Search articles..."
        value={searchQuery}
        onChange={onSearchChange}
        resultCount={searchQuery.trim().length > 0 ? resultCount : undefined}
        ariaLabel="Search blog articles by title, excerpt, or category"
        resultsId={resultsId}
        // FIX (Phase 2, A11Y-008): when there are no posts to search, the
        // input was only mouse-dismissed (pointer-events-none) but stayed
        // keyboard-focusable. disabled removes it from the tab order too.
        disabled={isEmpty}
        className={cn(
          isEmpty && "pointer-events-none opacity-40"
        )}
      />

      {/* Category pills — real navigation links */}
      <nav aria-label="Blog categories">
        <ul className="flex flex-wrap gap-2">
          {/* "All" pill */}
          <li>
            <Link
              href="/blog"
              className={cn(
                "inline-flex items-center rounded-full border px-3.5 py-1.5",
                "font-mono text-[11px] font-medium uppercase tracking-widest",
                "transition-[background-color,border-color,color] duration-fast ease-out-quart",
                // Active state
                isAllActive
                  ? "border-accent/30 bg-accent/10 text-accent"
                  : "border-border-hairline bg-bg-elevated text-text-tertiary hover:border-border-hover hover:text-text-secondary",
                // Focus-visible
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                "focus-visible:ring-offset-1 focus-visible:ring-offset-bg-deep"
              )}
              aria-current={isAllActive ? "page" : undefined}
            >
              All
            </Link>
          </li>

          {BLOG_CATEGORIES.map((cat) => {
            const isActive = activeSlug === cat.slug;
            return (
              <li key={cat.slug}>
                <Link
                  href={`/blog/category/${cat.slug}`}
                  className={cn(
                    "inline-flex items-center rounded-full border px-3.5 py-1.5",
                    "font-mono text-[11px] font-medium uppercase tracking-widest",
                    "transition-[background-color,border-color,color] duration-fast ease-out-quart",
                    isActive
                      ? "border-accent/30 bg-accent/10 text-accent"
                      : "border-border-hairline bg-bg-elevated text-text-tertiary hover:border-border-hover hover:text-text-secondary",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    "focus-visible:ring-offset-1 focus-visible:ring-offset-bg-deep"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {cat.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}