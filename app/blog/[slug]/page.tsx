import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Same routing-layer empty-state strategy as the industry route: with no
// posts in the data layer yet, generateStaticParams() returns [] and
// dynamicParams = false means *every* slug 404s at the router without
// rendering this component — so React 19's dev profiler never mis-times a
// throwing render here. Real MDX posts added in Phase 14/15 will be
// returned from generateStaticParams() and render normally.
export const dynamicParams = false;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildMetadata({ title: "Article Not Found", path: `/blog/${slug}` });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  await params;
  notFound();
}
