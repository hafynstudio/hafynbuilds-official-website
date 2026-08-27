"use client";

import { useMemo, useState } from "react";
import { BlogSearch } from "./BlogSearch";
import { FeaturedPost } from "./FeaturedPost";
import { ArticleGrid } from "./ArticleGrid";
import { NewsletterCTA } from "./NewsletterCTA";
import type { BlogPost } from "@/types/blog-post";

// ─── Component ───────────────────────────────────────────────────────────────
// Client wrapper for Phase 14's "search only" state.
// Hybrid architecture decision:
// - Category filtering = server-rendered routes (/blog/category/[slug])
// - Search query = ephemeral client-side instant filter
//
// This component receives the already-category-scoped post list from the
// server page and applies ONLY local search filtering on top.

interface BlogExperienceProps {
  /** Posts already scoped by the server route.
   * /blog            → all posts
   * /blog/category/* → only that category's posts */
  posts: BlogPost[];
  /** Whether this route is the global /blog page. Controls whether the
   * featured post should be shown. Category pages hide it to avoid
   * repeating the same hero across every category archive. */
  showFeaturedPost?: boolean;
}

export function BlogExperience({
  posts,
  showFeaturedPost = false,
}: BlogExperienceProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Search matches title, excerpt, and category — enough for Phase 14's
  // listing use-case without pretending to be a full-text engine.
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return posts;

    return posts.filter((post) => {
      const haystack = [
        post.title,
        post.excerpt,
        post.category,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [posts, searchQuery]);

  const featuredPost = showFeaturedPost && posts.length > 0 ? posts[0] : null;

  // If a featured post is shown on /blog, exclude it from the grid below
  // so the same article doesn't appear twice in one viewport sequence.
  const gridPosts = useMemo(() => {
    const source = filteredPosts;

    if (!featuredPost) return source;
    return source.filter((post) => post.slug !== featuredPost.slug);
  }, [filteredPosts, featuredPost]);

  const isFiltered = searchQuery.trim().length > 0;

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <BlogSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={filteredPosts.length}
        totalPosts={posts.length}
        resultsId="blog-results-section"
      />

      {featuredPost && !isFiltered ? (
        <section
          aria-labelledby="featured-post-heading"
          className="flex flex-col gap-5"
        >
          <div className="flex items-center justify-between gap-4">
            <h2
              id="featured-post-heading"
              className="font-sans text-lg font-semibold text-text-primary md:text-xl"
            >
              Featured Insight
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              Pinned
            </span>
          </div>

          <FeaturedPost post={featuredPost} />
        </section>
      ) : null}

      <section
        id="blog-results-section"
        aria-labelledby="all-articles-heading"
        className="flex flex-col gap-5"
      >
        <div className="flex items-center justify-between gap-4">
          <h2
            id="all-articles-heading"
            className="font-sans text-lg font-semibold text-text-primary md:text-xl"
          >
            {isFiltered ? "Search Results" : "Latest Articles"}
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            {isFiltered ? `${filteredPosts.length} matching` : `${posts.length} total`}
          </span>
        </div>

          <ArticleGrid
            posts={gridPosts}
            isFiltered={isFiltered}
            hasFeaturedPost={Boolean(featuredPost)}
          />
      </section>

      <NewsletterCTA />
    </div>
  );
}
