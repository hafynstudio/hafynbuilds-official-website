import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_STROKE_WIDTH } from "@/lib/icons";
import { blogPosts } from "@/data/blog-posts";
import type { BlogPost } from "@/types/blog-post";

// ---------------------------------------------------------------------------
// RelatedArticles -- server component. Appears at the bottom of every
// article page, above the AuthorBox.
//
// Algorithm (Decision D46):
//   1. Filter blogPosts to same category as current article.
//   2. Exclude the current article by slug.
//   3. Sort by publishedAt descending (most recent first).
//   4. Cap at 3 results.
//
// Empty state: if 0 related articles exist, this component renders nothing
// (null) -- no empty-state UI, no "no related posts" message. The section
// simply doesn't appear. This matches the PRD's ban on fake/placeholder
// content and keeps the article page clean when the blog is sparse.
//
// Motion posture: server component, no animation. Related articles are
// supplementary content -- they don't need entrance animation. The user
// has already committed to reading; a subtle static grid is enough.
// RevealSection could wrap this if the team later decides it needs a
// reveal -- zero component changes needed, just wrap at the call site.
//
// Data source: blogPosts from data/blog-posts.ts. In production this is
// REAL_POSTS only. In development the dev example post may appear as a
// related article if it shares a category -- that's acceptable behaviour
// for a dev-only sentinel.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Date formatter -- same config as ArticleCard.tsx. Defined at module
// scope so the Intl instance is created once per module load, not per
// render. Not extracted to a shared util yet -- will promote if a third
// consumer appears (same promotion principle as Decision D29/D38).
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// getRelatedPosts -- pure function, easily unit-testable in isolation.
// Called at render time (server component) -- no client state needed.
// ---------------------------------------------------------------------------
function getRelatedPosts(currentSlug: string, category: string): BlogPost[] {
  return blogPosts
    .filter((p) => p.category === category && p.slug !== currentSlug)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 3);
}

// ---------------------------------------------------------------------------
// RelatedArticleCard -- compact card variant used only here.
// Distinct from ArticleCard (grid card) -- this is a horizontal layout
// optimised for the "related" context at the bottom of an article.
// Not extracted to a shared component because:
//   (a) it has a different layout from ArticleCard
//   (b) it's currently only used in one place
// If a third consumer appears, promote to components/blog/CompactArticleCard.tsx.
// ---------------------------------------------------------------------------
function RelatedArticleCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group relative flex gap-4 overflow-hidden rounded-card",
        "border border-border-hairline bg-bg-elevated p-4",
        "shadow-card-rest",
        // Top-edge highlight
        "before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px",
        "before:rounded-t-card",
        "before:bg-gradient-to-r before:from-transparent before:via-white/8 before:to-transparent",
        // Hover
        "transition-[border-color,box-shadow,transform] duration-base ease-out-quart",
        "hover:-translate-y-0.5 hover:border-accent/20",
        "hover:shadow-[0_0_30px_rgba(62,123,250,0.06)]",
        // Focus
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"
      )}
    >
      {/* Cover thumbnail -- 16:9, fixed width */}
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-md",
          "w-24 h-16 md:w-32 md:h-20",
          "bg-bg-tertiary"
        )}
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="128px"
            className={cn(
              "object-cover",
              "transition-transform duration-slow ease-out-quart",
              "group-hover:scale-[1.04]"
            )}
          />
        ) : (
          // Gradient fallback -- same pattern as ArticleCard (Decision D40)
          <div className="absolute inset-0 bg-gradient-to-br from-bg-tertiary to-surface" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between gap-2 min-w-0">
        {/* Category + date */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-disabled">
            {post.category}
          </span>
          <span className="text-text-disabled" aria-hidden="true">·</span>
          <span className="font-mono text-[9px] tabular-nums text-text-disabled">
            {formatDate(post.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h4
          className={cn(
            "font-sans text-sm font-semibold leading-snug text-text-primary",
            "line-clamp-2",
            "transition-colors duration-fast group-hover:text-accent"
          )}
        >
          {post.title}
        </h4>

        {/* Read time + arrow */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-text-disabled">
            <Clock
              size={10}
              strokeWidth={ICON_STROKE_WIDTH}
              aria-hidden="true"
            />
            <span className="font-mono text-[9px] tabular-nums">
              {post.readTimeMinutes} min read
            </span>
          </span>

          <ArrowRight
            size={13}
            strokeWidth={ICON_STROKE_WIDTH}
            aria-hidden="true"
            className={cn(
              "shrink-0 text-text-disabled",
              "transition-[transform,color] duration-base ease-out-quart",
              "group-hover:translate-x-0.5 group-hover:text-accent"
            )}
          />
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// RelatedArticles -- exported component
// ---------------------------------------------------------------------------

interface RelatedArticlesProps {
  currentSlug: string;
  category: string;
  className?: string;
}

export function RelatedArticles({
  currentSlug,
  category,
  className,
}: RelatedArticlesProps) {
  const related = getRelatedPosts(currentSlug, category);

  // Empty state: render nothing -- section simply absent (Decision D46).
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-articles-heading" className={className}>
      {/* Section heading */}
      <div className="mb-6 flex items-center gap-4">
        <h2
          id="related-articles-heading"
          className="font-sans text-lg font-semibold text-text-primary"
        >
          Related Articles
        </h2>
        {/* Decorative rule -- visual separator, consistent with other
            section headings across the site */}
        <div
          className="h-px flex-1 bg-gradient-to-r from-border-hairline to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Cards grid -- 1 col mobile, up to 3 col on wide screens */}
      <div
        className={cn(
          "grid gap-4",
          related.length === 1 && "grid-cols-1",
          related.length === 2 && "grid-cols-1 sm:grid-cols-2",
          related.length === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {related.map((post) => (
          <RelatedArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}