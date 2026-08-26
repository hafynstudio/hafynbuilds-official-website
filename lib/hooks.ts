"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";

/**
 * Subscribes to a CSS media query and returns whether it currently
 * matches. Used for: desktop/mobile Modal variant switching, and
 * fine-pointer detection gating (magnetic buttons, ParallaxGrid's
 * cursor-reactive spotlight — both meaningless on touch devices).
 */
const getServerMediaQuerySnapshot = () => false;
const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerClientSnapshot = () => false;

export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerClientSnapshot
  );
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onStoreChange);
      return () => mediaQueryList.removeEventListener("change", onStoreChange);
    },
    [query]
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerMediaQuerySnapshot
  );
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

/**
 * True for devices with no reliable hover (touch phones/tablets) — the
 * complementary concept to useHasFinePointer, kept as a distinct query
 * (not a simple `!useHasFinePointer()`) since a device could theoretically
 * report neither "fine" nor "coarse". Promoted from a local implementation
 * originally defined only inside CapabilitiesTeaser.tsx (Phase 4), where
 * it powered the touch-device auto-activation fallback for cards that
 * would otherwise never receive a hover event. Promoted here once Phase 8
 * (DeployedInterfaces.tsx) became a second real consumer needing the
 * identical behavior — mirrors this file's own "promote once reconfirmed"
 * precedent, first established for useFocusTrap.
 */
export function useCoarsePointer(): boolean {
  return useMediaQuery("(hover: none), (pointer: coarse)");
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

/**
 * BUG-003 (corrective #3): Lazy-mount hook for below-the-fold content.
 *
 * Uses IntersectionObserver to detect when a sentinel element approaches
 * the viewport (with configurable lookahead via rootMargin), then flips a
 * one-shot shouldMount flag. Designed for the DynamicBuildConsole wrapper
 * so that the GSAP-heavy HorizontalCinematic component only loads when the
 * user has scrolled near it — moving its chunk-fetch + GSAP initialization
 * outside Lighthouse's measurement window.
 *
 * Falls back to immediate mount if IntersectionObserver is unavailable
 * (SSR, extremely old browsers) — never withholds content permanently.
 */
export function useLazyMount(
  options?: { rootMargin?: string }
): { sentinelRef: React.RefObject<HTMLDivElement | null>; shouldMount: boolean } {
  const [shouldMount, setShouldMount] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const rootMargin = options?.rootMargin ?? "200px";

  useEffect(() => {
    if (shouldMount) return;

    if (typeof IntersectionObserver === "undefined") {
      const fallbackTimer = window.setTimeout(() => setShouldMount(true), 0);
      return () => window.clearTimeout(fallbackTimer);
    }

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, shouldMount]);

  return { sentinelRef, shouldMount };
}
