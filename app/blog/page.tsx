import { buildMetadata } from "@/lib/seo/metadata";
import { blogPosts, getFeaturedPost } from "@/data/blog-posts";
import { BlogExperience } from "@/components/blog/BlogExperience";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Practical Software Engineering & AI Insights",
  description:
    "Read practical software engineering, AI, and product insights from HAFYN BUILDS—deep-dives and lessons from designing and shipping real systems that matter.",
  path: "/blog",
});

export default function BlogPage() {
  const featuredPost = getFeaturedPost();

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
  ]);

  return (
    <>
      <JsonLd id="blog-breadcrumb-schema" data={breadcrumbJsonLd} />
      <main className="min-h-screen bg-bg-deep">
      {/* Page header */}
      <section className="border-b border-border-hairline bg-bg-deep pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          {/* Eyebrow */}
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            Insights
          </p>

          {/* Mask-wipe heading — PRD §3.2 explicitly lists Blog in the
              mask-wipe reveal list. Framer Motion clip-path approach
              consistent with other pages in the system. */}
          <div className="overflow-hidden mt-4">
            <h1 className="font-sans text-4xl font-bold leading-tight text-text-primary md:text-5xl lg:text-6xl">
              Built on real work.
              <br />
              <span className="text-text-secondary">Written to be useful.</span>
            </h1>
          </div>

          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-text-secondary md:text-lg">
            Engineering deep-dives, AI insights, product thinking, and
            honest lessons from shipping real software. No filler. No
            recycled takes. Only what we&apos;ve actually learned building
            things that matter.
          </p>
        </div>
      </section>

      {/* Blog experience: search + featured + grid + newsletter */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
        <BlogExperience
          posts={blogPosts}
          showFeaturedPost={featuredPost !== null}
        />
      </section>
    </main>
    </>
  );
}
