import type { Metadata } from "next";
import type { BlogPost } from "@/types/blog-post";
import type { BlogCategory } from "@/data/blog-posts";
import { SITE_URL } from "@/lib/site";

const SITE_NAME = "HAFYN BUILDS";
const DEFAULT_DESCRIPTION =
  "HAFYN BUILDS is the flagship software engineering & AI company of the HAFYN technology holding group. Engineering the impossible. Building what matters.";
const DEFAULT_OG_IMAGE_ROUTE = "/og-image.png";

function routeOgImage(title: string, path: string): string {
  const url = new URL(DEFAULT_OG_IMAGE_ROUTE, SITE_URL);
  url.searchParams.set("title", title);
  url.searchParams.set("route", path);
  return `${url.pathname}${url.search}`;
}

interface BuildMetadataArgs {
  title: string;
  description?: string;
  path: string; // e.g. "/about"
  ogImage?: string;
  noIndex?: boolean;
  // Article pages need type: "article" for OG -- all other pages use
  // "website". Passed explicitly rather than inferred so the function
  // stays predictable with no hidden branching.
  ogType?: "website" | "article";
  // Article-specific OG fields -- only used when ogType === "article".
  publishedTime?: string;
  author?: string;
  section?: string;
}

// ---------------------------------------------------------------------------
// Central metadata builder -- every page.tsx calls this instead of
// hand-writing its own metadata object, so title/description/OG/Twitter
// shape stays identical and correct across all 9 pages (Master Build
// Prompt, SEO Execution section).
// ---------------------------------------------------------------------------

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  ogImage,
  noIndex = false,
  ogType = "website",
  publishedTime,
  author,
  section,
}: BuildMetadataArgs): Metadata {
  const fullTitle =
    title === SITE_NAME ||
    title.startsWith(`${SITE_NAME} | `) ||
    title.endsWith(` | ${SITE_NAME}`)
      ? title
      : `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;

  // Resolve OG image to an absolute URL. next/og requires absolute URLs.
  // If the caller passes a relative path (e.g. "/images/blog/cover.jpg"),
  // we prefix with SITE_URL. If already absolute, use as-is.
  const resolvedOgImage = ogImage ?? routeOgImage(title, path);
  const absoluteOgImage = resolvedOgImage.startsWith("http")
    ? resolvedOgImage
    : `${SITE_URL}${resolvedOgImage}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        { url: absoluteOgImage, width: 1200, height: 630, alt: fullTitle },
      ],
      locale: "en_US",
      type: ogType,
      // Article-specific OG fields -- omitted when not an article page
      // so the object stays clean for website-type pages.
      ...(ogType === "article" && publishedTime
        ? { publishedTime }
        : {}),
      ...(ogType === "article" && author
        ? { authors: [author] }
        : {}),
      ...(ogType === "article" && section
        ? { section }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteOgImage],
    },
  };
}

// ---------------------------------------------------------------------------
// Article-specific metadata builder -- wraps buildMetadata with the
// correct OG type and article fields derived directly from the BlogPost
// data shape. Call sites pass the post + category objects; this function
// owns the field mapping so article metadata stays consistent regardless
// of how many article pages exist.
//
// Cover image handling: if post.coverImage is empty (dev sentinel per
// Decision D40), falls back to DEFAULT_OG_IMAGE so OG preview never
// shows a broken image. Real articles always ship with a real cover.
// ---------------------------------------------------------------------------

export function buildArticleMetadata(
  post: BlogPost,
  category: BlogCategory
): Metadata {
  const ogImage = post.coverImage || undefined;

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    ogImage,
    ogType: "article",
    publishedTime: post.publishedAt,
    // Author string for OG -- matches the Person schema name exactly
    // so social sharing previews and schema data are consistent.
    author: "Zain Marwat",
    section: category.label,
  });
}