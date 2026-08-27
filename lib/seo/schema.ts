import { socialLinks } from "@/data/social-links";
import type { SocialPlatform } from "@/types/social";
import type { BlogPost } from "@/types/blog-post";
import type { BlogCategory } from "@/data/blog-posts";
import type { Industry } from "@/types/industry";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/founder#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${SITE_URL}/#logo`;

const LOGO_URL = `${SITE_URL}/images/logo.png`;
const FOUNDER_IMAGE_URL = `${SITE_URL}/images/founder.webp`;
const CONTACT_EMAIL = "hafynbuilds@gmail.com";
const WHATSAPP_URL = "https://wa.me/923091310489";

// Only real profile URLs are included. Placeholder "#" values and contact
// channels are deliberately excluded from sameAs.
const SAMEAS_PLATFORMS: SocialPlatform[] = [
  "facebook",
  "instagram",
  "twitter",
];

function realSocialProfileUrls() {
  return socialLinks
    .filter(
      (link) =>
        SAMEAS_PLATFORMS.includes(link.platform) && link.url.startsWith("http")
    )
    .map((link) => link.url);
}

/**
 * Canonical Organization entity. The stable @id is reused by Person, Article,
 * and Service nodes so the site describes one organization rather than
 * disconnected inline Organization objects.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      "@id": LOGO_ID,
      url: LOGO_URL,
      contentUrl: LOGO_URL,
      width: 1024,
      height: 1024,
      encodingFormat: "image/png",
    },
    description:
      "HAFYN BUILDS is the flagship software engineering & AI company of the HAFYN technology holding group.",
    foundingDate: "2026-06-01",
    founder: { "@id": PERSON_ID },
    sameAs: realSocialProfileUrls(),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: CONTACT_EMAIL,
      url: WHATSAPP_URL,
      availableLanguage: "English",
    },
  };
}

/** Canonical founder entity used by the Founder page and Article authors. */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Zain Marwat",
    jobTitle: "Founder, Director & CEO",
    worksFor: { "@id": ORGANIZATION_ID },
    url: `${SITE_URL}/founder`,
    image: FOUNDER_IMAGE_URL,
  };
}

function articleImageUrl(post: BlogPost) {
  if (post.coverImage) {
    return post.coverImage.startsWith("http")
      ? post.coverImage
      : `${SITE_URL}${post.coverImage}`;
  }

  // The content model has no real cover image yet. Reuse the same truthful,
  // crawlable 1200x630 article-specific OG card already emitted in metadata;
  // do not invent a photographic cover or claim an unavailable image.
  const fallback = new URL("/og-image.png", SITE_URL);
  fallback.searchParams.set("title", post.title);
  fallback.searchParams.set("route", `/blog/${post.slug}`);
  return fallback.toString();
}

/** Article markup remains data-driven for every future production post. */
export function articleSchema(post: BlogPost) {
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    image: [articleImageUrl(post)],
    datePublished: post.publishedAt,
    // dateModified is intentionally omitted because BlogPost has no verified
    // update field. It must be added when the data layer records one.
    url,
    inLanguage: "en",
    author: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Zain Marwat",
      jobTitle: "Founder, Director & CEO",
      url: `${SITE_URL}/founder`,
    },
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@id": LOGO_ID },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    isPartOf: { "@id": WEBSITE_ID },
    articleSection: post.category,
  };
}

/** WebSite entity for the homepage; no SearchAction because no crawlable search URL exists. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  const pageUrl = items.at(-1)?.url ?? SITE_URL;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Service entity for an industry-specific website build page. */
export function serviceSchema(
  industry: Pick<Industry, "id" | "name" | "description">
) {
  const url = `${SITE_URL}/investment/${industry.id}`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: `${industry.name} website service`,
    serviceType: `${industry.name} website design and development`,
    description: industry.description,
    provider: { "@id": ORGANIZATION_ID },
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

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
