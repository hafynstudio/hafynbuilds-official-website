import type { SocialLink } from "@/types/social";

// Placeholder URLs per PRD §5 — real profile links to be supplied by the
// user before launch. Shape is final; only the `url` values change when
// real links arrive, so Footer.tsx / MobileNav.tsx / the future Contact
// social grid (Phase 16) never need code changes for this update.
export const socialLinks: SocialLink[] = [
  { platform: "facebook", url: "#", label: "Facebook" },
  { platform: "instagram", url: "#", label: "Instagram" },
  { platform: "tiktok", url: "#", label: "TikTok" },
  { platform: "linkedin", url: "#", label: "LinkedIn" },
  { platform: "twitter", url: "#", label: "X (Twitter)" },
  { platform: "email", url: "mailto:hello@hafynbuilds.com", label: "Email" },
  { platform: "whatsapp", url: "https://wa.me/00000000000", label: "WhatsApp" },
];
