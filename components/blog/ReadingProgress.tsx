"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// ReadingProgress -- sticky top bar that fills horizontally as the user
// scrolls through an article. CSS-only animation (scaleX transform) for
// zero jank per the performance budget (Master Build Prompt).
//
// Architecture:
// - A single rAF-throttled scroll listener updates a single number (0-100).
// - The bar uses CSS transform: scaleX() -- GPU-accelerated, never triggers
//   layout or paint.
// - The article content element is identified by a stable data attribute
//   (data-article-body) so this component has no coupling to class names
//   or DOM structure decisions made elsewhere.
// - prefers-reduced-motion: bar still renders (it's informational, not
//   decorative) but the transition duration drops to 0ms so it jumps
//   instantly rather than animating -- respects the user's preference
//   while preserving the functionality.
// ---------------------------------------------------------------------------

interface ReadingProgressProps {
  /** Additional class names for the outer wrapper. */
  className?: string;
}

export function ReadingProgress({ className }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  // Tracks whether a rAF is already scheduled -- prevents queuing
  // multiple frames on fast scroll, keeping the listener cost minimal.
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function calculateProgress() {
      // The scrollable article content is bounded by the element with
      // data-article-body. If the attribute isn't found (e.g. component
      // accidentally mounted outside an article page), fall back to the
      // full document height so the bar still works without erroring.
      const articleEl = document.querySelector<HTMLElement>(
        "[data-article-body]"
      );

      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      let total: number;
      let start: number;

      if (articleEl) {
        const rect = articleEl.getBoundingClientRect();
        // Distance from the top of the article to the current scroll pos.
        // rect.top is relative to viewport, so we add scrollTop to make
        // it absolute, then subtract the window height so "0%" starts
        // when the article top enters the viewport (not the page top).
        start = rect.top + scrollTop - windowHeight;
        total = articleEl.offsetHeight;
      } else {
        // Fallback: measure entire document
        start = 0;
        total = document.documentElement.scrollHeight - windowHeight;
      }

      const scrolled = scrollTop - start;
      const pct = total > 0 ? Math.min(Math.max((scrolled / total) * 100, 0), 100) : 0;
      setProgress(pct);
    }

    function onScroll() {
      // Cancel any pending frame before scheduling a new one --
      // guarantees at most one rAF is queued at a time.
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        calculateProgress();
        rafRef.current = null;
      });
    }

    // Run once on mount to set initial state (handles page-refresh
    // mid-article where scrollY is already non-zero).
    calculateProgress();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    // Outer track -- full width, hairline height, sits below the header.
    // z-40 keeps it below the header (z-50) but above page content.
    <div
      className={cn(
        "fixed left-0 right-0 top-0 z-40 h-[2px] bg-transparent",
        className
      )}
      role="progressbar"
      aria-label="Article reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Fill bar -- scaleX from left origin, GPU-only transform */}
      <div
        className={cn(
          "h-full origin-left bg-gradient-to-r from-accent to-accent-glow",
          // Standard transition for users who haven't requested reduced motion.
          // 100ms is fast enough to feel real-time but smooths out the
          // discrete scroll event increments visually.
          "transition-transform duration-100 ease-linear",
          // prefers-reduced-motion: drop transition entirely so the bar
          // jumps to position instantly instead of animating.
          "motion-reduce:transition-none"
        )}
        style={{ transform: `scaleX(${progress / 100})` }}
        aria-hidden="true"
      />
    </div>
  );
}