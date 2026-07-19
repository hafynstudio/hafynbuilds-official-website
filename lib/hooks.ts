"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Subscribes to a CSS media query and returns whether it currently
 * matches. Used for: desktop/mobile Modal variant switching, and
 * fine-pointer detection for the custom cursor (touch devices should
 * never render a desktop-style cursor).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

/**
 * Wraps the `prefers-reduced-motion` media query. Every component with
 * non-essential motion (magnetic pull, cursor trailing, modal slide/scale,
 * loading screen sequence) must check this and fall back to an instant or
 * fade-only transition — this is a hard accessibility requirement.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * True only for devices with an accurate pointing device (mouse/trackpad).
 * Touch devices report `pointer: coarse` — this gates the custom cursor
 * and magnetic button effects, which are meaningless on touchscreens.
 */
export function useHasFinePointer(): boolean {
  return useMediaQuery("(pointer: fine)");
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab/Shift+Tab focus cycling within a container while `isActive`
 * is true. Extracted here (originally inline in Modal.tsx) so any
 * fullscreen overlay — Modal, MobileNav, and any future one — shares
 * exactly one implementation of this non-trivial accessibility behavior
 * instead of each reimplementing it slightly differently.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean
) {
  useEffect(() => {
    if (!isActive) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !containerRef.current) return;

      const focusables =
        containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, containerRef]);
}
