import type { FounderProfile } from "@/types/founder";

// PLACEHOLDER — tagline is provisional brand-voice copy, NOT the real
// founder quote. Replace tagline, set photoUrl to the real image path,
// and flip isTaglinePlaceholder to false when founder content arrives
// (PRD §5). FounderTeaser.tsx branches on photoUrl null vs. string.
export const founder: FounderProfile = {
  name: "Zain Marwat",
  title: "Founder, CEO & Architect of HAFYN",
  tagline:
    "We do not build software to launch it. We build it to still be running, still be right, years later.",
  photoUrl: null,
  isTaglinePlaceholder: true,
};
