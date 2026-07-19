import type { FounderProfile } from "@/types/founder";

// Structure only — real bio, portrait, and social links are pending from
// the user per PRD §5. Populated fully in Phase 13. Shape matches
// FounderProfile exactly so FounderHero.tsx/PhilosophyQuotes.tsx never
// need to change when real content drops in.
export const founder: FounderProfile = {
  name: "Zain Marwat",
  title: "Founder, CEO & Architect of HAFYN",
  portraitUrl: "",
  bio: "",
  philosophyQuotes: [],
  socialLinks: [],
};
