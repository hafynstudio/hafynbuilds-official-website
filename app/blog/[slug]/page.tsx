import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { RevealSection } from "@/components/ui/RevealSection";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ShareBar } from "@/components/blog/ShareBar";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { AuthorBox } from "@/components/blog/AuthorBox";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { buildArticleMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/site";
import {
  articleSchema,
  breadcrumbSchema,
  articleBreadcrumbs,
} from "@/lib/seo/schema";
import {
  blogPosts,
  BLOG_CATEGORIES,
  type BlogCategory,
} from "@/data/blog-posts";
import type { BlogPost } from "@/types/blog-post";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Route config
//
// SSG: only slugs in REAL_POSTS are pre-rendered at build time.
// The dev example post (slug: "dev-example-post") is intentionally
// excluded -- it only exists in the data array during development, so
// it should never be statically generated or accessible in production.
//
// dynamicParams = false: any slug not returned by generateStaticParams
// gets a hard 404. This prevents ghost pages from being indexed and
// ensures Google never crawls a URL that doesn't correspond to a real
// article (PRD Section 4, SEO requirements).
//
// In development: the dev example post is in blogPosts[] but NOT in
// generateStaticParams(), so /blog/dev-example-post returns 404 even
// in dev. This is intentional -- the dev post exists to test the
// listing page components (ArticleCard, FeaturedPost, ArticleGrid),
// not the article page. If you need to test the article page layout
// during development, add a real entry to REAL_POSTS temporarily.
// ---------------------------------------------------------------------------

export const dynamicParams = false;

export function generateStaticParams() {
  // Filter to production-safe posts only -- exclude the dev example post
  // which only exists when NODE_ENV === "development".
  const productionSlugs = blogPosts
    .filter((post) => post.slug !== "dev-example-post")
    .map((post) => ({ slug: post.slug }));

  return productionSlugs;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Resolves a BlogPost by slug. Returns null if not found.
function getPost(slug: string): BlogPost | null {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}

// Resolves a BlogCategory from a post's category string.
// Falls back to a minimal object if the category isn't in BLOG_CATEGORIES
// (shouldn't happen if data/blog-posts.ts is maintained correctly, but
// we never want a missing category to throw -- graceful degradation).
function getCategory(categoryValue: string): BlogCategory {
  return (
    BLOG_CATEGORIES.find((c) => c.value === categoryValue) ?? {
      label: categoryValue,
      slug: categoryValue.toLowerCase().replace(/\s+/g, "-"),
      value: categoryValue,
    }
  );
}

// Formats a date string for display in the article hero.
// Separate from ArticleCard's formatter -- this one includes the full
// month name for the more generous hero layout.
const heroDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function formatHeroDate(iso: string): string {
  try {
    return heroDateFormatter.format(new Date(iso));
  } catch {
    return "";
  }
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  // If post not found, generateStaticParams + dynamicParams=false means
  // this code path is never reached in production. In dev it may be hit
  // for the dev example post -- return a minimal noIndex metadata so it
  // never accidentally gets indexed if somehow rendered.
  if (!post) {
    return {
      title: "Article Not Found | HAFYN BUILDS",
      robots: { index: false, follow: false },
    };
  }

  const category = getCategory(post.category);
  return buildArticleMetadata(post, category);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  // Hard 404 for unknown slugs -- enforced by dynamicParams=false at the
  // router level, but we also call notFound() here as a safety net in case
  // this component is ever called directly (e.g. in tests or via ISR).
  if (!post) notFound();

  const category = getCategory(post.category);

  // Canonical article URL -- passed down to ShareBar as a prop so the
  // client component never has to reconstruct it from window.location
  // (avoids hydration mismatches on SSR -- Decision D47).
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  // JSON-LD schema objects -- both injected as separate <script> tags
  // so Google can parse them independently.
  const articleJsonLd = articleSchema(post);
  const breadcrumbJsonLd = breadcrumbSchema(
    articleBreadcrumbs(post, category)
  );

  return (
    <>
      {/* ----------------------------------------------------------------
          JSON-LD schema injection
          Article schema: chains this post to the Founder's Person schema
          via the author.url field -- the compounding SEO/AI-attribution
          mechanism (PRD Section 4, Decision D45).
          Breadcrumb schema: signals page hierarchy, triggers breadcrumb
          display in Google search results.
      ---------------------------------------------------------------- */}
      <script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Reading progress bar -- sticky top, fills on scroll */}
      <ReadingProgress />

      {/* Share bar -- desktop sticky sidebar + mobile bottom strip */}
      <ShareBar title={post.title} url={canonicalUrl} />

      <article>
        {/* ------------------------------------------------------------
            Article Hero -- title, meta, category, read time
            Full-width, generous vertical padding, no cover image hero
            (cover image appears in the article body if included in the
            HTML content, or as the OG image -- not as a page banner,
            which would create layout complexity with the progress bar
            and share bar).
        ------------------------------------------------------------ */}
        <header
          className={cn(
            "relative border-b border-border-hairline",
            "bg-gradient-to-b from-bg-deep to-bg-base",
            "px-4 pb-12 pt-24 md:pb-16 md:pt-32"
          )}
        >
          {/* Grain texture overlay -- consistent with the rest of the site */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-3xl">
            {/* Breadcrumb nav -- visible, semantic, matches breadcrumb schema */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-text-disabled">
                <li>
                  <Link
                    href="/"
                    className="transition-colors duration-fast hover:text-text-tertiary"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/blog"
                    className="transition-colors duration-fast hover:text-text-tertiary"
                  >
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href={`/blog/category/${category.slug}`}
                    className="transition-colors duration-fast hover:text-text-tertiary"
                  >
                    {category.label}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li
                  className="max-w-[20ch] truncate text-text-tertiary"
                  aria-current="page"
                >
                  {post.title}
                </li>
              </ol>
            </nav>

            {/* Category pill */}
            <div className="mb-4">
              <a
                href={`/blog/category/${category.slug}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full",
                  "border border-accent/20 bg-accent/10 px-3 py-1",
                  "font-mono text-[10px] uppercase tracking-widest text-accent",
                  "transition-[border-color,background-color] duration-base",
                  "hover:border-accent/40 hover:bg-accent/15"
                )}
              >
                {category.label}
              </a>
            </div>

            {/* Article title -- h1, single per page (Decision D34 principle) */}
            <h1
              className={cn(
                "font-sans text-3xl font-bold leading-tight text-text-primary",
                "md:text-4xl lg:text-5xl",
                "mb-6"
              )}
            >
              {post.title}
            </h1>

            {/* Excerpt -- larger body text, introduces the article */}
            <p
              className={cn(
                "font-sans text-lg leading-relaxed text-text-secondary",
                "mb-8 max-w-[60ch]"
              )}
            >
              {post.excerpt}
            </p>

            {/* Meta row -- date + read time + author */}
            <div
              className={cn(
                "flex flex-wrap items-center gap-4",
                "border-t border-border-hairline pt-6"
              )}
            >
              {/* Author */}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "relative h-8 w-8 overflow-hidden rounded-full",
                    "ring-1 ring-border-hairline"
                  )}
                >
                  <Image
                    src="/images/founder.jpg"
                    alt="Zain Marwat"
                    width={32}
                    height={32}
                    className="object-cover object-top"
                    sizes="32px"
                  />
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-text-primary">
                    Zain Marwat
                  </p>
                  <p className="font-mono text-[10px] text-text-disabled">
                    Founder, Director & CEO
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div
                className="hidden h-8 w-px bg-border-hairline sm:block"
                aria-hidden="true"
              />

              {/* Published date */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-disabled">
                  Published
                </p>
                <p className="font-mono text-xs text-text-tertiary">
                  <time dateTime={post.publishedAt}>
                    {formatHeroDate(post.publishedAt)}
                  </time>
                </p>
              </div>

              {/* Divider */}
              <div
                className="hidden h-8 w-px bg-border-hairline sm:block"
                aria-hidden="true"
              />

              {/* Read time */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-disabled">
                  Read time
                </p>
                <p className="font-mono text-xs text-text-tertiary">
                  {post.readTimeMinutes} min
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ------------------------------------------------------------
            Article body -- max readable measure, generous padding.
            max-w-[72ch] on the prose content (Decision D45 / PRD §2.2.8).
            The outer container is wider to allow the share bar sidebar
            to sit beside the content column on wide viewports without
            overlapping it.
        ------------------------------------------------------------ */}
        <div
          className={cn(
            "mx-auto max-w-3xl",
            "px-4 py-12 md:py-16"
          )}
        >
          {post.bodyContent ? (
            <ArticleBody
              html={post.bodyContent}
              className="max-w-[72ch]"
            />
          ) : (
            // Empty body state -- dev example post has bodyContent: "".
            // In production this should never render (real articles always
            // have content). Renders a subtle placeholder so the page
            // doesn't look broken during development.
            <div
              className={cn(
                "rounded-card border border-dashed border-border-hairline",
                "p-8 text-center"
              )}
            >
              <p className="font-mono text-sm text-text-disabled">
                Article content will appear here.
              </p>
            </div>
          )}

          {/* ------------------------------------------------------------
              Related articles -- same category, most recent, max 3.
              Renders nothing if 0 related posts exist (Decision D46).
          ------------------------------------------------------------ */}
          <RelatedArticles
            currentSlug={post.slug}
            category={post.category}
            className="mt-16 border-t border-border-hairline pt-12"
          />

          {/* ------------------------------------------------------------
              Author box -- visible SEO signal pairing with article schema.
              Always rendered, regardless of related articles.
          ------------------------------------------------------------ */}
          <RevealSection className="mt-12">
            <AuthorBox />
          </RevealSection>

          {/* ------------------------------------------------------------
              Bottom padding -- accounts for the mobile share bar pinned
              to the bottom of the viewport so content is never obscured.
          ------------------------------------------------------------ */}
          <div className="h-20 md:h-0" aria-hidden="true" />
        </div>
      </article>
    </>
  );
}