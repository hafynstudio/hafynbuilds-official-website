// ---------------------------------------------------------------------------
// robots.ts — robots.txt config (Next.js App Router convention).
//
// Rules:
//   - All public pages: Allow (default)
//   - /admin/*: Disallow — reserved scaffold, never public-facing
//   - /api/*: Disallow — route handlers, not indexable HTML pages
//
// Sitemap: explicitly referenced so Google discovers it immediately
// on first crawl, without needing to guess the URL.
//
// TAD Section 11: robots.txt is a hard requirement. Without it,
// Googlebot has no explicit signal to exclude /admin and /api,
// meaning it may waste crawl budget on non-indexable routes.
// ---------------------------------------------------------------------------

import type { MetadataRoute } from "next";

// TODO(Phase 20): confirm and swap in the final production domain.
const SITE_URL = "https://hafynbuilds.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Primary rule: allow all well-behaved crawlers to index
        // everything except the explicitly disallowed paths below.
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",  // reserved scaffold — never public
          "/api/",    // route handlers — not indexable pages
        ],
      },
    ],
    // Sitemap URL tells Google exactly where to find the sitemap
    // without relying on Search Console submission alone.
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}