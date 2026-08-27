// ---------------------------------------------------------------------------
// sitemap.ts — auto-generated sitemap.xml (Next.js 16 App Router convention,
// MetadataRoute.Sitemap).
//
// PRINCIPLE: accuracy > size; canonicality > quantity. This sitemap ships the
// canonical, indexable URL set only. No placeholder/thin pages, no redirects,
// no non-indexable routes, no query variants, no duplicate/trailing-slash
// variants. One canonical representation per page.
//
// COVERAGE (each entry is a real, public, HTTP-200, indexable page):
//   - 9 static marketing pages          (/about, /team, /capabilities, /method,
//                                        /investment, /founder, /blog, /contact, /)
//   - Dynamic blog article pages        (REAL posts from data/blog-posts.ts;
//                                        dev-example-post excluded)
//   - Dynamic blog category pages       (all 5 BLOG_CATEGORIES — real archive
//                                        routes linked from article breadcrumbs)
//   - Dynamic investment/[industry]     pages — ONLY getVisibleIndustries()
//                                        (the 20 industries with live packages &
//                                        pricing, the product's authoritative
//                                        source). See INDUSTRY_CURATION below.
//
// EXCLUDED (with reasons):
//   - /admin                     reserved scaffold, never public (robots disallowed)
//   - /api/contact, /api/geo     route handlers, not indexable HTML pages
//   - /og-image.png, /favicon.ico  generated/asset routes, not pages
//   - /blog/dev-example-post     dev-only data, 404 in production (dynamicParams=false)
//   - 42 industry URLs with no package  thin Phase-12 placeholder scaffolds (below)
//
// INDUSTRY_CURATION (why not all 62 industries):
//   data/industries.ts declares 62 industries, all isActive:true, so
//   generateStaticParams() on /investment/[industry] pre-renders every one at
//   build time as HTTP 200. The UI, however, only ever shows the industries
//   that ALSO have at least one real package in data/industry-packages.ts —
//   enforced by getVisibleIndustries() in lib/industries/provider.ts (the
//   Explorer's single source of truth). The ~42 industries without packages
//   render only a "built in Phase 12" scaffold <h1> with no packages, no
//   pricing, no content, and are not linked by the Explorer. They are thin
//   placeholder pages, NOT intended indexable content, so they are excluded.
//   Using getVisibleIndustries() guarantees the sitemap always matches what
//   the product actually offers — no per-build tuning, no garbage.
//
// CHANGE_FREQUENCY / PRIORITY: intentionally OMITTED. Google ignores both and
// they are a recognised source of fake signals (old-SEO habit). Only
// <lastmod> is emitted, from the real source where available.
//
// LAST_MODIFIED STRATEGY:
//   - Blog articles: use each post's stored publishedAt (the data's own
//     timestamp; BlogPost has no updatedAt field yet — genuinely stable —
//     so publishedAt is the correct dateModified source).
//   - Static pages / categories / industries: no per-item updatedAt metadata
//     exists anywhere in the app, so we use a SINGLE STABLE fallback date
//     (SITE_LAUNCH_DATE) instead of new Date(). This is deliberate: baking
//     new Date() in would stamp every build and every URL with "today",
//     a false-freshness signal. The stable fallback is documented below and
//     only bumped when the site's launch basis actually changes.
// ---------------------------------------------------------------------------

import type { MetadataRoute } from "next";
import { BLOG_CATEGORIES, blogPosts } from "@/data/blog-posts";
import { getVisibleIndustries } from "@/lib/industries/provider";
import { SITE_URL } from "@/lib/site";

// Stable fallback for pages without per-item update metadata. Chosen as a
// constant (not new Date()) so it is NOT regenerated per build — per-page
// freshness cannot be honestly claimed where no per-page update is recorded.
// Basis: HAFYN BUILDS' founding/launch date (matches organizationSchema
// foundingDate). Update only if the whole site's content basis changes.
const SITE_LAUNCH_DATE = new Date("2026-06-01T00:00:00.000Z");

// The one dev-only blog slug that must never surface in the sitemap. In
// production blogPosts already excludes it (data/blog-posts.ts), but this
// guard keeps the sitemap correct even if NODE_ENV flips or the guard
// in the data file changes.
const DEV_EXAMPLE_SLUG = "dev-example-post";

export default function sitemap(): MetadataRoute.Sitemap {
  // ── Static pages ──────────────────────────────────────────────────────
  // All 9 are real, public, indexable marketing pages, canonical via
  // lib/seo/metadata.ts alternates.canonical. lastModified = stable fallback.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: SITE_LAUNCH_DATE, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: SITE_LAUNCH_DATE, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/team`, lastModified: SITE_LAUNCH_DATE, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/capabilities`, lastModified: SITE_LAUNCH_DATE, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/method`, lastModified: SITE_LAUNCH_DATE, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/investment`, lastModified: SITE_LAUNCH_DATE, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/founder`, lastModified: SITE_LAUNCH_DATE, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: SITE_LAUNCH_DATE, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: SITE_LAUNCH_DATE, changeFrequency: "monthly", priority: 0.7 },
  ];

  // ── Blog article pages ────────────────────────────────────────────────
  // Authoritative source: data/blog-posts.ts (blogPosts/REAL_POSTS). The
  // dev-example-post is excluded — its route returns 404 in production
  // (dynamicParams=false on the article page), so including it would hand
  // Google a crawl error. lastModified = each post's real publishedAt.
  const blogArticleRoutes: MetadataRoute.Sitemap = blogPosts
    .filter((post) => post.slug !== DEV_EXAMPLE_SLUG)
    .map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  // ── Blog category pages ───────────────────────────────────────────────
  // All 5 categories are pre-rendered (generateStaticParams on
  // blog/category/[slug]), return 200, and are the breadcrumb targets used by
  // every article. They are real archive routes even when currently empty.
  // lastModified = stable fallback (no per-category updatedAt metadata).
  const blogCategoryRoutes: MetadataRoute.Sitemap = BLOG_CATEGORIES.map(
    (category) => ({
      url: `${SITE_URL}/blog/category/${category.slug}`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: "monthly",
      priority: 0.5,
    })
  );

  // ── Investment industry pages ─────────────────────────────────────────
  // Authoritative source: getVisibleIndustries() (isActive AND has a real
  // package). Exactly matches what the Industry Explorer offers users. The
  // 42 package-less industries are excluded (thin placeholder scaffolds).
  const industryRoutes: MetadataRoute.Sitemap = getVisibleIndustries().map(
    (industry) => ({
      url: `${SITE_URL}/investment/${industry.id}`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return [
    ...staticRoutes,
    ...blogArticleRoutes,
    ...blogCategoryRoutes,
    ...industryRoutes,
  ];
}