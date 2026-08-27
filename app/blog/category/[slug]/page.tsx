import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbSchema,
  categoryBreadcrumbs,
} from "@/lib/seo/schema";
import {
  BLOG_CATEGORIES,
  getPostsByCategory,
} from "@/data/blog-posts";
import { BlogExperience } from "@/components/blog/BlogExperience";
import { JsonLd } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = BLOG_CATEGORIES.find((cat) => cat.slug === slug);
  if (!category) return {};
  return buildMetadata({
    title: `${category.label} — Insights`,
    description: `HAFYN BUILDS articles on ${category.label.toLowerCase()} — engineering depth, real lessons, no filler.`,
    path: `/blog/category/${slug}`,
  });
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = BLOG_CATEGORIES.find((cat) => cat.slug === slug);

  // Hard 404 for unknown slugs — never silently render empty pages
  // that Google could index as ghost routes.
  if (!category) notFound();

  const posts = getPostsByCategory(category.value);

  // Phase 17 fix (I2): BreadcrumbList schema added.
  // categoryBreadcrumbs() helper already existed in lib/seo/schema.ts
  // but was not being called here. Structure: Home > Blog > [Category].
  // Triggers breadcrumb display in Google search results for category
  // archive pages, increasing CTR from organic traffic.
  const breadcrumbJsonLd = breadcrumbSchema(categoryBreadcrumbs(category));

  return (
    <>
      <JsonLd id="category-breadcrumb-schema" data={breadcrumbJsonLd} />

      <main className="min-h-screen bg-bg-deep">
        <section className="border-b border-border-hairline bg-bg-deep pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-text-disabled">
              <span className="text-accent">Insights</span>
              <span className="mx-2 text-border-hover" aria-hidden="true">/</span>
              {category.label}
            </p>

            <div className="overflow-hidden mt-4">
              <h1 className="font-sans text-4xl font-bold leading-tight text-text-primary md:text-5xl lg:text-6xl">
                {category.label}
              </h1>
            </div>

            <p className="mt-4 font-sans text-base text-text-secondary md:text-lg">
              {posts.length > 0
                ? `${posts.length} article${posts.length === 1 ? "" : "s"} in this category.`
                : "Articles coming soon \u2014 we\u2019re writing something worth reading."}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
          <BlogExperience
            posts={posts}
            showFeaturedPost={false}
          />
        </section>
      </main>
    </>
  );
}