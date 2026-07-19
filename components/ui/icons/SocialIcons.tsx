import { Mail } from "lucide-react";
import type { SocialPlatform } from "@/types/social";

// lucide-react removed Facebook, Instagram, and LinkedIn brand icons in
// a recent release to avoid trademark/logo-policy issues. All three are
// replaced with accurate custom SVG glyphs here — consistent with the
// already-custom X, TikTok, and WhatsApp icons in this same file.
// Mail remains from lucide-react since it is a generic/non-brand icon
// with no trademark concerns.

interface IconProps {
  className?: string;
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

// Lucide's bundled "Twitter" icon is the legacy bird mark, superseded by
// the current X wordmark — a simple custom glyph is more accurate than
// shipping an outdated brand icon from our approved icon library.
function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 4L20 20M20 4L4 20"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

// TikTok has no equivalent in lucide-react. Simplified custom glyph —
// swap for the official brand SVG asset if/when the user supplies one.
function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.5 3c.3 1.9 1.6 3.4 3.5 3.8v2.7c-1.3 0-2.5-.4-3.5-1.1v6.4a5.6 5.6 0 1 1-5.6-5.6c.2 0 .4 0 .6.03v2.8a2.8 2.8 0 1 0 2 2.7V3h3z" />
    </svg>
  );
}

// Custom WhatsApp glyph — tinted via the dedicated --color-whatsapp token
// reserved in Phase 1 specifically for this use case (Contact page CTA
// and social icon only — never used elsewhere in the UI).
function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8.9-.1.2-.3.2-.5.1-.2-.1-1-.4-2-1.2-.7-.6-1.2-1.4-1.4-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.2.2-.4.1-.1 0-.3 0-.4L9 8.5c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.4 3.8 3.4.5.2.9.4 1.3.5.5.2 1 .1 1.3.1.4-.1 1.2-.5 1.4-1 .2-.5.2-.9.1-1z" />
    </svg>
  );
}

export const SOCIAL_ICONS: Record<SocialPlatform, React.ComponentType<IconProps>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  twitter: XIcon,
  tiktok: TikTokIcon,
  whatsapp: WhatsAppIcon,
  email: Mail,
};
