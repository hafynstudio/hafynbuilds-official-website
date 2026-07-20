import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SOCIAL_ICONS } from "@/components/ui/icons/SocialIcons";
import { socialLinks } from "@/data/social-links";

const SITEMAP_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/method", label: "Method" },
  { href: "/investment", label: "Investment" },
  { href: "/founder", label: "Founder" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * A single reusable footer nav link with a growing underline on hover —
 * built from a `span` with `scale-x-0 -> scale-x-100` (transform, GPU-
 * cheap) rather than an animated `width`, which would trigger layout
 * recalculation on every hover.
 */
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group relative inline-block w-fit text-sm text-text-secondary transition-colors duration-fast hover:text-text-primary">
      {label}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-base ease-out-quart group-hover:scale-x-100"
      />
    </Link>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-bg-secondary">
      {/* Gradient hairline replacing the flat solid top border — a thin
          blue-to-cyan-to-transparent line reads as a considered detail
          rather than a default divider. Sits on top of the plain border
          above via absolute positioning so it degrades gracefully if
          gradients render oddly on any exotic browser. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent via-accent-glow to-transparent"
      />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-xs text-base text-text-secondary">
              Engineering the Impossible. Building What Matters.
            </p>
          </div>

          <nav aria-label="Footer sitemap">
            <h2 className="mb-4 text-sm font-semibold text-text-primary">
              Sitemap
            </h2>
            <ul className="grid grid-cols-2 gap-3">
              {SITEMAP_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 text-sm font-semibold text-text-primary">
              Connect
            </h2>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform];
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-text-secondary transition-colors duration-fast hover:border-accent/50 hover:text-accent"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-text-tertiary md:flex-row">
          <p>&copy; {year} HAFYN BUILDS. All rights reserved.</p>
          <p>Part of the HAFYN ecosystem.</p>
        </div>
      </div>
    </footer>
  );
}
