import type { SocialLink } from "@/types/social";

/**
 * Real production social links + contact channels.
 * LinkedIn and TikTok remain as "#" placeholders — accounts pending
 * creation by the user; only the `url` values will change when those
 * accounts exist, so Footer.tsx / MobileNav.tsx / Contact page never
 * need code changes for this update.
 *
 * WhatsApp URL uses international format (923091310489) — the wa.me
 * short link requires the country code (92 = Pakistan) with the leading
 * 0 dropped from the local number (03091310489 -> 923091310489).
 */
export const socialLinks: SocialLink[] = [
  { platform: "facebook",  url: "https://www.facebook.com/hafynbuilds",  label: "Facebook" },
  { platform: "instagram", url: "https://www.instagram.com/hafynbuilds/", label: "Instagram" },
  { platform: "tiktok",    url: "#", label: "TikTok" },
  { platform: "linkedin",  url: "#", label: "LinkedIn" },
  { platform: "twitter",   url: "https://x.com/HAFYNBuilds", label: "X (Twitter)" },
  { platform: "email",     url: "mailto:hafynbuilds@gmail.com", label: "Email" },
  { platform: "whatsapp",  url: "https://wa.me/923091310489", label: "WhatsApp" },
];