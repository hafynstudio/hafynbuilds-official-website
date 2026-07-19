import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Founder",
  path: "/founder",
});

export default function FounderPage() {
  return (
    <main>
      <h1>Founder — built in Phase 13</h1>
    </main>
  );
}
