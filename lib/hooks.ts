"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Subscribes to a CSS media query and returns whether it currently
 * matches. Used for: desktop/mobile Modal variant switching, and
 * fine-pointer detection gating (magnetic buttons, ParallaxGrid's
 * cursor-reactive spotlight — both meaningless on touch devices).
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
 * non-essential motion (magnetic pull, ParallaxGrid's spotlight, modal
 * slide/scale, loading screen sequence) must check this and fall back to
 * an instant or fade-only transition — this is a hard accessibility
 * requirement.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * True only for devices with an accurate pointing device (mouse/trackpad).
 * Touch devices report `pointer: coarse` — this gates the magnetic button
 * pull effect and ParallaxGrid's cursor-reactive spotlight, both of which
 * are meaningless on touchscreens.
 */
export function useHasFinePointer(): boolean {
  return useMediaQuery("(pointer: fine)");
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab/Shift+Tab focus cycling within a container while `isActive`
 * is true. Shared by Modal and MobileNav so any fullscreen overlay uses
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

// NOTE: useInView and useCountUp were added in an earlier Phase 4 pass
// specifically to power StatChips.tsx, which has since been removed
// (stats were integrated directly into HeroVisual's terminal card
// instead — see components/home/HeroVisual.tsx). Removed here rather
// than left as unconsumed exports, consistent with the CommandPalette
// deferral precedent from Phase 2 (build shared primitives only once a
// real consumer exists). Restore verbatim in Phase 5 if the Trust Bar
// genuinely needs a scroll-triggered reveal.
