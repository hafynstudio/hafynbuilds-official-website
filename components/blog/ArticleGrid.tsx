"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_STROKE_WIDTH } from "@/lib/icons";
import { EASE_OUT_QUART } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ArticleCard } from "./ArticleCard";
import type { BlogPost } from "@/types/blog-post";

// ─── Constants ───────────────────────────────────────────────────────────────
// Stagger step matches the site-wide --duration-stagger-step (90ms).
const STAGGER_STEP_S = 0.09;

// ─── Component ───────────────────────────────────────────────────────────────

interface ArticleGridProps {
  /** Already-filtered posts to render. Empty array = honest empty state. */
  posts: BlogPost[];
  /** When true, search/filter is active — changes empty state messaging
   * from "no articles yet" to "no results found." */
  isFiltered: boolean;
  /** When true, the featured article is already rendered above the grid. */
  hasFeaturedPost?: boolean;
}

export function ArticleGrid({
  posts,
  isFiltered,
  hasFeaturedPost = false,
}: ArticleGridProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // ─── Empty state ─────────────────────────────────────────────────────────
  if (posts.length === 0) {
    return (
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.5, ease: EASE_OUT_QUART }
        }
        className={cn(
          "flex flex-col items-center justify-center gap-4 py-24 text-center"
        )}
        role="status"
        aria-live="polite"
      >
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            "border border-border-hairline bg-bg-elevated"
          )}
        >
          <FileText
            size={24}
            strokeWidth={ICON_STROKE_WIDTH}
            className="text-text-disabled"
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="font-sans text-base font-medium text-text-secondary">
            {isFiltered
              ? "No articles found."
              : hasFeaturedPost
                ? "Featured insight is above."
                : "No articles yet."}
          </p>
          <p className="max-w-sm font-sans text-sm text-text-tertiary">
            {isFiltered
              ? "Try adjusting your search or clearing the filters."
              : hasFeaturedPost
                ? "More articles are coming soon."
                : "We\u2019re writing something worth reading. Check back soon."}
          </p>
        </div>
      </motion.div>
    );
  }

  // ─── Grid ────────────────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "grid gap-6",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      <AnimatePresence mode="popLayout">
        {posts.map((post, index) => (
          <ArticleCard
            key={post.slug}
            post={post}
            entranceDelay={index * STAGGER_STEP_S}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}