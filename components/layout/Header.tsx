"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { CurrencySwitcher } from "@/components/investment/CurrencySwitcher";

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
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 8);
  });


  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
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
            <Button href="/contact" size="sm">
              Start a Build
            </Button>
          </div>

          {/* Mobile: CurrencySwitcher (if on /investment) + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            {showCurrencySwitcher && <CurrencySwitcher />}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileNavOpen}
              className="rounded-md p-2 text-text-primary"
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navLinks={NAV_LINKS}
        isActive={isActive}
      />
    </>
  );
}
