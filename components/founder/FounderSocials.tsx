import Link from "next/link";
import { socialLinks } from "@/data/social-links";
import { SOCIAL_ICONS } from "@/components/ui/icons/SocialIcons";
import { RevealSection, RevealItem } from "@/components/ui/RevealSection";
import type { SocialPlatform } from "@/types/social";

// Profile-identity platforms only -- matches lib/seo/schema.ts's sameAs
// filter exactly (Decision D30). Email and WhatsApp are contact-action
// channels reserved for the Contact page (Phase 16), not founder
// identity/profile links.
const PROFILE_PLATFORMS: SocialPlatform[] = [
  "linkedin",
  "twitter",
  "instagram",
  "facebook",
  "tiktok",
];

/**
 * Premium custom icon-button social row (PRD Section 2.2.7). Reads from
 * the same data/social-links.ts source of truth used sitewide -- when
 * real profile URLs replace the "#" placeholders, this component (and
 * the Person schema sameAs array) update automatically with zero code
 * changes.
 */
export function FounderSocials() {
  const profiles = socialLinks.filter((link) =>
    PROFILE_PLATFORMS.includes(link.platform)
  );

  if (profiles.length === 0) return null;

  return (
    <section className="border-t border-border bg-bg-secondary px-6 py-16 lg:px-12">
      <RevealSection
        as="div"
        stagger={0.08}
        className="mx-auto flex max-w-[720px] flex-col items-center text-center"
      >
        <RevealItem>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.17em] text-accent">
            Connect
          </span>
        </RevealItem>
        <RevealItem className="mt-3">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Follow the journey
          </h2>
        </RevealItem>
        <RevealItem className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {profiles.map((link) => {
            const Icon = SOCIAL_ICONS[link.platform];
            // FIX (Phase 2, A11Y-002): placeholder profiles (url === "#")
            // rendered as real <Link href="#"> that jumped to page top.
            // They now render as non-interactive, non-focusable chips.
            if (link.url === "#") {
              return (
                <span
                  key={link.platform}
                  title={`${link.label} — coming soon`}
                  aria-hidden="true"
                  className="flex h-12 w-12 cursor-not-allowed items-center justify-center rounded-full border border-border bg-surface text-text-disabled"
                >
                  <Icon className="h-5 w-5" />
                </span>
              );
            }
            return (
              <Link
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-glow-accent"
              >
                <Icon className="h-5 w-5 text-text-secondary transition-colors duration-200 group-hover:text-accent" />
              </Link>
            );
          })}
        </RevealItem>
      </RevealSection>
    </section>
  );
}
