"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { CurrencySwitcher } from "@/components/investment/CurrencySwitcher";

const MobileNav = dynamic(
  () => import("@/components/layout/MobileNav").then((m) => ({ default: m.MobileNav })),
  { ssr: false }
);

// Primary nav per the locked sitemap (PRD §2.1). Home is reachable via
// the logo and Contact is the dedicated CTA button, so both are
// intentionally excluded from this list rather than duplicated as plain
// nav items. Team and Founder are reachable via About/Footer per
// PRD §2.1, not top nav.
const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/method", label: "Method" },
  { href: "/investment", label: "Investment" },
  { href: "/blog", label: "Blog" },
] as const;

export function Header() {
  const pathname = usePathname();
  return <HeaderShell key={pathname} pathname={pathname} />;
}

function HeaderShell({ pathname }: { pathname: string }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateScrolledState = () => setIsScrolled(window.scrollY > 8);
    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMobileNav() {
    setIsMobileNavOpen(false);
    requestAnimationFrame(() => {
      mobileMenuTriggerRef.current?.focus({ preventScroll: true });
    });
  }

  // CurrencySwitcher only appears on the Investment page and its
  // sub-routes (e.g. /investment/restaurant in Phase 11). Pricing
  // context is meaningless anywhere else on the site.
  //
  // Rendered at BOTH breakpoints on this route — mobile users need
  // one-tap access to change currency (hiding it inside the hamburger
  // would be 2 taps for a critical page-context control).
  const showCurrencySwitcher = pathname.startsWith("/investment");

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-header flex h-header items-center border-b bg-bg-primary/70 backdrop-blur-lg transition-colors duration-base ease-out-quart",
          isScrolled ? "border-border" : "border-transparent"
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6">
          <Logo />

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "text-sm font-medium transition-colors duration-fast",
                      isActive(link.href)
                        ? "text-text-primary"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop: CurrencySwitcher + Start a Build */}
          <div className="hidden items-center gap-3 md:flex">
            {showCurrencySwitcher && <CurrencySwitcher />}
            <Link
              href="/contact"
              prefetch={false}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-accent-button px-4 text-sm font-medium text-text-primary transition-colors duration-fast hover:bg-accent-button-hover hover:shadow-glow-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            >
              Start a Build
            </Link>
          </div>

          {/* Mobile: CurrencySwitcher (if on /investment) + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            {showCurrencySwitcher && <CurrencySwitcher />}
            <button
              ref={mobileMenuTriggerRef}
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileNavOpen}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-text-primary"
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {isMobileNavOpen && (
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={closeMobileNav}
          navLinks={NAV_LINKS}
          isActive={isActive}
        />
      )}
    </>
  );
}
