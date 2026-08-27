"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { SOCIAL_ICONS } from "@/components/ui/icons/SocialIcons";
import { socialLinks } from "@/data/social-links";
import { useFocusTrap, usePrefersReducedMotion } from "@/lib/hooks";
import { EASE_ENTRANCE, MOTION_DURATION_S } from "@/lib/motion";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: readonly NavLink[];
  isActive: (href: string) => boolean;
}

/**
 * Fullscreen mobile navigation overlay — deliberately bespoke rather than
 * a reuse of components/ui/Modal.tsx: Modal's mobile variant is a
 * bottom-sheet (correct for content like Investment's Industry Explorer),
 * but primary site navigation reads better as a fullscreen slide-down
 * panel, matching Linear/Vercel-style mobile nav patterns.
 */
export function MobileNav({
  isOpen,
  onClose,
  navLinks,
  isActive,
}: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useFocusTrap(panelRef, isOpen);

  useEffect(() => {
    // FIX (Phase 2, A11Y-004): when the panel closes, return focus to the
    // element that opened it (the header hamburger). Previously focus was
    // dropped to <body> on close.
    if (!isOpen) {
      const restoreTo = previouslyFocusedRef.current;
      previouslyFocusedRef.current = null;
      if (restoreTo && typeof restoreTo.focus === "function") {
        restoreTo.focus({ preventScroll: true });
      }
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    previouslyFocusedRef.current = previouslyFocused;

    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    const frame = requestAnimationFrame(() => panelRef.current?.focus());

    return () => {
      document.documentElement.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(frame);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          tabIndex={-1}
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -16 }}
          transition={{ duration: prefersReducedMotion ? 0 : MOTION_DURATION_S.medium, ease: EASE_ENTRANCE }}
          className="fixed inset-0 z-modal flex flex-col bg-bg-primary md:hidden"
        >
          <div className="flex h-header items-center justify-between px-6">
            <Logo />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label="Primary"
            className="flex flex-1 flex-col justify-center px-8"
          >
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: prefersReducedMotion ? 0 : MOTION_DURATION_S.staggerStep * index,
                    duration: prefersReducedMotion ? 0 : MOTION_DURATION_S.medium,
                    ease: EASE_ENTRANCE,
                  }}
                >
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={
                      isActive(link.href)
                        ? "text-4xl font-bold text-text-primary"
                        : "text-4xl font-bold text-text-tertiary transition-colors hover:text-text-primary"
                    }
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="mt-12">
              <Button href="/contact" fullWidth>
                Start a Build
              </Button>
            </div>
          </nav>

          <div className="flex items-center justify-center gap-5 px-8 pb-10">
            {socialLinks.map((social) => {
              const Icon = SOCIAL_ICONS[social.platform];
              // FIX (Phase 2, A11Y-002): placeholder profiles render as
              // non-interactive, non-focusable chips instead of href="#"
              // links that jumped to page top.
              if (social.url === "#") {
                return (
                  <span
                    key={social.platform}
                    title={`${social.label} — coming soon`}
                    aria-hidden="true"
                    className="cursor-not-allowed text-text-disabled"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                );
              }
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  aria-label={social.label}
                  className="text-text-tertiary transition-colors hover:text-text-primary"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
