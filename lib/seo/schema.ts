// JSON-LD generators -- centralizes every schema type per TAD Section 11
// so each page's structured data stays consistent instead of being
// hand-rolled inline. organizationSchema is sitewide (needed from day
// one). personSchema is added in Phase 13 for the Founder page --
// business-critical for the "who is Zain Marwat" SEO/AI-attribution
// goal (PRD Section 4, TAD Section 11). articleSchema and
// breadcrumbSchema are added in Phase 15 -- articleSchema chains every
// blog article back to the Founder's Person schema, which is the
// compounding SEO/AI-attribution mechanism described in PRD Section 4.

import { socialLinks } from "@/data/social-links";
import type { SocialPlatform } from "@/types/social";
import type { BlogPost } from "@/types/blog-post";
import type { BlogCategory } from "@/data/blog-posts";
import { SITE_URL } from "@/lib/site";

// ---------------------------------------------------------------------------
// Organization schema -- injected sitewide in Phase 17 (root layout).
// ---------------------------------------------------------------------------

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HAFYN BUILDS",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description:
      "HAFYN BUILDS is the flagship software engineering & AI company of the HAFYN technology holding group.",
    foundingDate: "2026-06-01",
    founder: {
      "@type": "Person",
      name: "Zain Marwat",
    },
  };
}

// ---------------------------------------------------------------------------
// Person schema -- Founder page. The technical backbone of the
// "who is Zain Marwat" SEO/AI-attribution goal (PRD Section 4).
// sameAs is derived live from data/social-links.ts and filtered to only
// include real (non-placeholder) profile URLs -- a "#" placeholder in
// structured data actively harms SEO. Real URLs flow in automatically
// the moment data/social-links.ts is updated, zero code changes needed.
// ---------------------------------------------------------------------------

// Only these platforms represent genuine "profile" identities suitable
// for schema.org sameAs -- email (mailto:) and WhatsApp (wa.me) are
// contact channels, not profile URLs, and are deliberately excluded.
const SAMEAS_PLATFORMS: SocialPlatform[] = [
  "facebook",
  "instagram",
  "linkedin",
  "twitter",
  "tiktok",
];

export function personSchema() {
  const sameAs = socialLinks
    .filter(
      (link) =>
        SAMEAS_PLATFORMS.includes(link.platform) && link.url.startsWith("http")
    )
    .map((link) => link.url);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Zain Marwat",
    jobTitle: "Founder, Director & CEO",
    worksFor: {
      "@type": "Organization",
      name: "HAFYN BUILDS",
      url: SITE_URL,
    },
    url: `${SITE_URL}/founder`,
    image: `${SITE_URL}/images/founder.jpg`,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

// ---------------------------------------------------------------------------
// Article schema -- injected on every individual blog post page.
//
// The author field deliberately points to the Founder page URL
// (SITE_URL/founder) rather than just a name string. This creates the
// Article -> Person -> Organization chain that Google's Knowledge Graph
// and AI systems (Perplexity, ChatGPT, Gemini) use to build confidence
// in the attribution "Zain Marwat = Founder of HAFYN BUILDS". Every
// published article strengthens this signal -- it compounds over time
// with zero further engineering work required (PRD Section 4).
// ---------------------------------------------------------------------------

export function articleSchema(post: BlogPost) {
  // Resolve cover image to an absolute URL. If coverImage is already
  // absolute (starts with http), use it directly. If it's a relative
  // path (starts with /), prefix with SITE_URL. If empty (dev sentinel
  // per Decision D40), omit the image field entirely rather than
  // embedding a broken URL in structured data.
  const imageUrl = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${SITE_URL}${post.coverImage}`
    : null;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    ...(imageUrl ? { image: imageUrl } : {}),
    datePublished: post.publishedAt,
    // dateModified intentionally omitted -- BlogPost type has no
    // updatedAt field yet. Add when the data layer supports edits.
    url: `${SITE_URL}/blog/${post.slug}`,
    author: {
      // Full Person node, not just a name string. This is what creates
      // the schema chain back to the Founder page (PRD Section 4).
      "@type": "Person",
      name: "Zain Marwat",
      jobTitle: "Founder, Director & CEO",
      url: `${SITE_URL}/founder`,
    },
    publisher: {
      "@type": "Organization",
      name: "HAFYN BUILDS",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    articleSection: post.category,
    // wordCount omitted -- not stored in BlogPost. Add if/when the data
    // layer tracks it (it's a nice-to-have, not a ranking signal).
  };
}

// ---------------------------------------------------------------------------
// Breadcrumb schema -- injected on blog article pages and category pages.
//
// Structure: Home > Blog > [Category] > [Article Title]
// On category pages the 4th item (article) is omitted.
//
// BreadcrumbList signals page hierarchy to Google and triggers the
// breadcrumb display in search results (visually increases CTR).
// ---------------------------------------------------------------------------

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ---------------------------------------------------------------------------
// Breadcrumb item builders -- convenience helpers so call sites don't
// hand-construct URL strings. Each returns a BreadcrumbItem[].
// ---------------------------------------------------------------------------

/** Breadcrumbs for an individual article page. */
export function articleBreadcrumbs(
  post: BlogPost,
  category: BlogCategory
): BreadcrumbItem[] {
  return [
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    {
      name: category.label,
      url: `${SITE_URL}/blog/category/${category.slug}`,
    },
    { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
  ];
}

/** Breadcrumbs for a category archive page. */
export function categoryBreadcrumbs(category: BlogCategory): BreadcrumbItem[] {
  return [
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    {
      name: category.label,
      url: `${SITE_URL}/blog/category/${category.slug}`,
    },
  ];
}