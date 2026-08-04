// ---------------------------------------------------------------------------
// sitemap.ts — auto-generated sitemap.xml (Next.js App Router convention).
//
// Coverage:
//   - All 9 static marketing pages
//   - Dynamic blog article pages (REAL_POSTS only — dev example excluded)
//   - Dynamic blog category pages (all BLOG_CATEGORIES)
//   - Dynamic investment/[industry] pages (active industries only)
//   - /admin explicitly excluded (reserved scaffold, not public)
//   - /api/* excluded (route handlers, not indexable pages)
//
// Priority logic:
//   1.0 — Home (entry point for all organic traffic)
//   0.9 — Founder (business-critical Person schema page — "who is Zain Marwat")
//   0.8 — Core marketing pages (About, Capabilities, Method, Investment, Blog)
//   0.7 — Supporting pages (Team, Contact)
//   0.6 — Blog articles (individual — high SEO value but lower than site core)
//   0.5 — Blog categories + Industry pages (faceted/listing pages)
//
// changeFrequency logic:
//   "yearly"  — static pages that rarely change (About, Team, Founder,
//               Capabilities, Method)
//   "monthly" — pages that update with new content (Investment, Blog listing,
//               blog categories, industry pages)
//   "weekly"  — Home (trust bar, featured work may rotate)
//   "daily"   — individual blog articles (fresh content signal)
//
// TAD Section 11: sitemap.xml is a hard requirement for the "rank for HAFYN"
// and "Zain Marwat" SEO goals. Google cannot efficiently discover dynamic
// routes without an explicit sitemap.
// ---------------------------------------------------------------------------

import type { MetadataRoute } from "next";
import { blogPosts, BLOG_CATEGORIES } from "@/data/blog-posts";
import { industries } from "@/data/industries";

// TODO(Phase 20): confirm and swap in the final production domain.
const SITE_URL = "https://hafynbuilds.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // ── Static pages ──────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/team`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/capabilities`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/method`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/investment`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      // Founder page: highest non-home priority because it is the
      // business-critical Person schema page. Google discovering and
      // indexing this page is directly tied to the "who is Zain Marwat"
      // SEO/AI-attribution goal (PRD Section 4).
      url: `${SITE_URL}/founder`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];

  // ── Dynamic blog article pages ────────────────────────────────────────
  // Filter: exclude the dev example post (slug: "dev-example-post").
  // It exists only during development and must never appear in the
  // sitemap — Google would attempt to crawl it and receive a 404
  // (dynamicParams=false on the article page), which is a crawl error.
  const blogArticleRoutes: MetadataRoute.Sitemap = blogPosts
    .filter((post) => post.slug !== "dev-example-post")
    .map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));

  // ── Dynamic blog category pages ───────────────────────────────────────
  // All categories are always included — even empty ones render a
  // "coming soon" message rather than 404, so they are valid URLs.
  const blogCategoryRoutes: MetadataRoute.Sitemap = BLOG_CATEGORIES.map(
    (category) => ({
      url: `${SITE_URL}/blog/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })
  );

  // ── Dynamic investment/[industry] pages ───────────────────────────────
  // Only active industries are included. isActive: false industries
  // are not rendered by the Industry Explorer (PRD §2.2.6 empty-state
  // rule) and should not be in the sitemap either.
  const industryRoutes: MetadataRoute.Sitemap = industries
    .filter((industry) => industry.isActive)
    .map((industry) => ({
      url: `${SITE_URL}/investment/${industry.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  return [
    ...staticRoutes,
    ...blogArticleRoutes,
    ...blogCategoryRoutes,
    ...industryRoutes,
  ];
}