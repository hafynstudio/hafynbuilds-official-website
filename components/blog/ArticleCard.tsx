"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_STROKE_WIDTH } from "@/lib/icons";
import { EASE_OUT_QUART } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { BlogPost, BlogPostTag } from "@/types/blog-post";

// ─── Tag badge visual mapping ────────────────────────────────────────────────
// Uses ONLY existing design tokens — no new values added.
// accent-glow (cyan) = fresh/new, badge-founding (amber) = hot/trending,
// accent (blue) = depth/engineering.

interface TagStyle {
  label: string;
  dotClass: string;
  textClass: string;
  bgClass: string;
}

const TAG_STYLES: Record<NonNullable<BlogPostTag>, TagStyle> = {
  new: {
    label: "New",
    dotClass: "bg-accent-glow",
    textClass: "text-accent-glow",
    bgClass: "bg-accent-glow/10 border-accent-glow/20",
  },
  trending: {
    label: "Trending",
    dotClass: "bg-badge-founding",
    textClass: "text-badge-founding",
    bgClass: "bg-badge-founding/10 border-badge-founding/20",
  },
  "deep-dive": {
    label: "Deep Dive",
    dotClass: "bg-accent",
    textClass: "text-accent",
    bgClass: "bg-accent/10 border-accent/20",
  },
};

// ─── Date formatter ──────────────────────────────────────────────────────────
// Consistent across ArticleCard and FeaturedPost. Memoised outside
// component scope so the Intl.DateTimeFormat instance is created once.
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(iso: string): string {
  try {
    return dateFormatter.format(new Date(iso));
  } catch {
    return "";
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

interface ArticleCardProps {
  post: BlogPost;
  /** Stagger delay for grid entrance animation — parent controls. */
  entranceDelay?: number;
}

export const ArticleCard = memo(function ArticleCard({
  post,
  entranceDelay = 0,
}: ArticleCardProps) {
  const tagStyle = post.tag ? TAG_STYLES[post.tag] : null;
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.article
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.4, delay: entranceDelay, ease: EASE_OUT_QUART }
      }
      layout
      layoutId={`article-card-${post.slug}`}
    >
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          // Glass-surface base — consistent with IndustryCard system
          "group relative flex flex-col overflow-hidden rounded-card",
          "border border-border-hairline bg-bg-elevated",
          "shadow-card-rest",
          // Top-edge highlight (glass identity detail)
          "before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:rounded-t-card",
          "before:bg-gradient-to-r before:from-transparent before:via-white/8 before:to-transparent",
          // Hover state
          "transition-[border-color,box-shadow,transform] duration-base ease-out-quart",
          "hover:-translate-y-1 hover:border-accent/20 hover:shadow-card-hover",
          "hover:shadow-[0_0_40px_rgba(62,123,250,0.08)]",
          // Focus-visible
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"
        )}
      >
        {/* Cover image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg-tertiary">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn(
                "object-cover",
                "transition-transform duration-slow ease-out-quart",
                "group-hover:scale-[1.03]"
              )}
            />
          ) : (
            // Fallback — gradient placeholder, never a broken image icon
            <div className="absolute inset-0 bg-gradient-to-br from-bg-tertiary to-surface" />
          )}

          {/* Tag badge — top-left over image */}
          {tagStyle && (
            <div
              className={cn(
                "absolute left-3 top-3 z-10 flex items-center gap-1.5",
                "rounded-full border px-2.5 py-1 backdrop-blur-md",
                tagStyle.bgClass
              )}
            >
              <span
                className={cn("h-1.5 w-1.5 rounded-full", tagStyle.dotClass)}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "font-mono text-[10px] font-medium uppercase tracking-widest",
                  tagStyle.textClass
                )}
              >
                {tagStyle.label}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          {/* Category pill */}
          <span className="w-fit font-mono text-[10px] uppercase tracking-widest text-text-disabled">
            {post.category}
          </span>

          {/* Title */}
          <h3
            className={cn(
              "font-sans text-base font-semibold leading-snug text-text-primary",
              "line-clamp-2",
              "transition-colors duration-fast",
              "group-hover:text-accent"
            )}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="font-sans text-sm leading-relaxed text-text-tertiary line-clamp-2">
            {post.excerpt}
          </p>

          {/* Meta row */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-border-hairline">
            <div className="flex items-center gap-3">
              {/* Date */}
              <span className="font-mono text-[10px] tabular-nums text-text-disabled">
                {formatDate(post.publishedAt)}
              </span>

              {/* Read time */}
              <span className="flex items-center gap-1 text-text-disabled">
                <Clock
                  size={11}
                  strokeWidth={ICON_STROKE_WIDTH}
                  aria-hidden="true"
                />
                <span className="font-mono text-[10px] tabular-nums">
                  {post.readTimeMinutes} min
                </span>
              </span>
            </div>

            {/* Arrow */}
            <ArrowRight
              size={14}
              strokeWidth={ICON_STROKE_WIDTH}
              aria-hidden="true"
              className={cn(
                "text-text-disabled",
                "transition-[transform,color] duration-base ease-out-quart",
                "group-hover:translate-x-0.5 group-hover:text-accent"
              )}
            />
          </div>
        </div>
      </Link>
    </motion.article>
  );
});