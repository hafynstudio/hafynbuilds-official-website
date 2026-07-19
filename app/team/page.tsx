import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Team",
  path: "/team",
});

export default function TeamPage() {
  return (
    <main>
      <h1>Team — built in Phase 7</h1>
    </main>
  );
}
