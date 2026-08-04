"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_STROKE_WIDTH } from "@/lib/icons";
import { EASE_OUT_QUART } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { BlogPost, BlogPostTag } from "@/types/blog-post";

// ─── Tag badge — same system as ArticleCard ──────────────────────────────────
// Duplicated here rather than extracted to a shared file because:
// (a) it's 15 lines, not a complex module, and (b) FeaturedPost and
// ArticleCard are visually distinct components that happen to share a
// small data mapping — extracting prematurely would add indirection
// without real reuse benefit. If a third consumer appears, promote then.

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

interface FeaturedPostProps {
  post: BlogPost;
}

export const FeaturedPost = memo(function FeaturedPost({
  post,
}: FeaturedPostProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tagStyle = post.tag ? TAG_STYLES[post.tag] : null;
  const prefersReducedMotion = usePrefersReducedMotion();

  // Parallax on cover image — subtle scroll-linked vertical shift.
  // PRD §2.2.8: "Featured/pinned post — large hero treatment with parallax"
  // Hook always runs (required by rules-of-hooks); the resulting value is
  // only applied to the image style when motion is not reduced (see below).
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <motion.article
      ref={containerRef}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.6, ease: EASE_OUT_QUART }
      }
      className="w-full"
    >
      <Link
        href={`/blog/${post.slug}`}
        aria-label={`Read featured article: ${post.title}`}
        className={cn(
          // Glass-surface base — larger scale than ArticleCard
          "group relative grid overflow-hidden rounded-card",
          "border border-border-hairline bg-bg-elevated",
          "shadow-card-rest",
          // Desktop: side-by-side (image left, content right)
          // Mobile: stacked (image top, content bottom)
          "grid-cols-1 lg:grid-cols-2",
          // Top-edge highlight
          "before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:rounded-t-card",
          "before:bg-gradient-to-r before:from-transparent before:via-white/8 before:to-transparent",
          // Hover
          "transition-[border-color,box-shadow] duration-base ease-out-quart",
          "hover:border-accent/20 hover:shadow-card-hover",
          "hover:shadow-[0_0_60px_rgba(62,123,250,0.08)]",
          // Focus-visible
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"
        )}
      >
        {/* Cover image — parallax */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg-tertiary lg:aspect-auto lg:min-h-[360px]">
          {post.coverImage ? (
            <motion.div
              className="absolute inset-0"
              style={{ y: prefersReducedMotion ? 0 : imageY }}
            >
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                fetchPriority="high"
                className={cn(
                  "object-cover",
                  "transition-transform duration-slow ease-out-quart",
                  "group-hover:scale-[1.03]"
                )}
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-bg-tertiary to-surface" />
          )}

          {/* Tag badge — top-left over image */}
          {tagStyle && (
            <div
              className={cn(
                "absolute left-4 top-4 z-10 flex items-center gap-1.5",
                "rounded-full border px-3 py-1.5 backdrop-blur-md",
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

          {/* Gradient overlay — ensures text readability on mobile
              where content stacks below the image (image bleeds visually
              into the content area via this fade). Hidden on desktop
              where the split layout handles separation. */}
          <div
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg-elevated to-transparent lg:hidden"
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center gap-4 p-6 md:p-8 lg:p-10">
          {/* Featured label + category */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-accent">
              Featured
            </span>
            <span
              className="h-3 w-px bg-border-hairline-strong"
              aria-hidden="true"
            />
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-disabled">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h2
            className={cn(
              "font-sans text-2xl font-bold leading-tight text-text-primary",
              "md:text-3xl lg:text-4xl",
              "transition-colors duration-fast",
              "group-hover:text-accent"
            )}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="font-sans text-sm leading-relaxed text-text-secondary line-clamp-3 md:text-base">
            {post.excerpt}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-4 pt-2">
            <span className="font-mono text-[11px] tabular-nums text-text-disabled">
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1 text-text-disabled">
              <Clock
                size={12}
                strokeWidth={ICON_STROKE_WIDTH}
                aria-hidden="true"
              />
              <span className="font-mono text-[11px] tabular-nums">
                {post.readTimeMinutes} min read
              </span>
            </span>
          </div>

          {/* Read article CTA */}
          <div className="flex items-center gap-2 pt-2">
            <span
              className={cn(
                "font-sans text-sm font-medium text-text-secondary",
                "transition-colors duration-fast",
                "group-hover:text-accent"
              )}
            >
              Read Article
            </span>
            <ArrowRight
              size={14}
              strokeWidth={ICON_STROKE_WIDTH}
              aria-hidden="true"
              className={cn(
                "text-text-disabled",
                "transition-[transform,color] duration-base ease-out-quart",
                "group-hover:translate-x-1 group-hover:text-accent"
              )}
            />
          </div>
        </div>
      </Link>
    </motion.article>
  );
});
