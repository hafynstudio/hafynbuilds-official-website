import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Start a Build",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main>
      <h1>Contact — built in Phase 16</h1>
    </main>
  );
}
