import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SOCIAL_ICONS } from "@/components/ui/icons/SocialIcons";
import { socialLinks } from "@/data/social-links";

// Full sitemap, including Team and Founder — per PRD §2.1, both are
// reachable via footer links even though they're excluded from the top
// nav to avoid clutter.
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

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm text-text-secondary">
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
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
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
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-text-secondary transition-colors duration-fast hover:border-border-hover hover:text-text-primary"
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
