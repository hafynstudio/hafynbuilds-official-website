import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Investment",
  path: "/investment",
});

export default function InvestmentPage() {
  return (
    <main>
      <h1>Investment — built in Phases 10, 11 &amp; 12</h1>
    </main>
  );
}
