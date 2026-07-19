import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Insights",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <main>
      <h1>Blog — built in Phases 14 &amp; 15</h1>
    </main>
  );
}
