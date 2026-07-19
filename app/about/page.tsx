import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "About",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main>
      <h1>About — built in Phase 6</h1>
    </main>
  );
}
