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

type VisibilityListener = (isVisible: boolean) => void;

type ObserverBucket = {
  observer: IntersectionObserver;
  listeners: Map<Element, Set<VisibilityListener>>;
};

const observerBuckets = new Map<string, ObserverBucket>();

function getObserverBucket(rootMargin: string): ObserverBucket | null {
  if (typeof IntersectionObserver === "undefined") return null;
  const existing = observerBuckets.get(rootMargin);
  if (existing) return existing;

  const listeners = new Map<Element, Set<VisibilityListener>>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const elementListeners = listeners.get(entry.target);
        if (!elementListeners) continue;
        for (const listener of elementListeners) listener(entry.isIntersecting);
      }
    },
    { rootMargin }
  );
  const bucket = { observer, listeners };
  observerBuckets.set(rootMargin, bucket);
  return bucket;
}

function releaseObserverBucket(rootMargin: string, bucket: ObserverBucket) {
  if (bucket.listeners.size > 0) return;
  bucket.observer.disconnect();
  observerBuckets.delete(rootMargin);
}

/**
 * Shared viewport activity signal for decorative and interactive motion.
 * One native IntersectionObserver is shared by every consumer using the same
 * root margin, so lifecycle-aware effects do not each create their own
 * observer. The hook remains live (rather than one-shot) so loops pause when
 * off-screen and resume when the surface re-enters the viewport.
 */
export function useViewportActivity<T extends Element = HTMLDivElement>(
  targetRef: RefObject<T | null>,
  rootMargin = "0px",
  onVisibilityChange?: VisibilityListener
): { isVisible: boolean } {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const bucket = getObserverBucket(rootMargin);
    if (!bucket) {
      const fallbackTimer = window.setTimeout(() => {
        setIsVisible(true);
        onVisibilityChange?.(true);
      }, 0);
      return () => window.clearTimeout(fallbackTimer);
    }

    const listener: VisibilityListener = (next) => {
      setIsVisible((current) => (current === next ? current : next));
      onVisibilityChange?.(next);
    };
    const elementListeners = bucket.listeners.get(element) ?? new Set<VisibilityListener>();
    elementListeners.add(listener);
    bucket.listeners.set(element, elementListeners);
    bucket.observer.observe(element);

    return () => {
      elementListeners.delete(listener);
      if (elementListeners.size === 0) {
        bucket.listeners.delete(element);
        bucket.observer.unobserve(element);
      }
      releaseObserverBucket(rootMargin, bucket);
    };
  }, [rootMargin, targetRef, onVisibilityChange]);

  return { isVisible };
}

/**
 * BUG-003 (corrective #3): Lazy-mount hook for below-the-fold content.
 * Uses the shared viewport registry, then flips a one-shot shouldMount flag.
 * The registry keeps observer construction bounded while the one-shot state
 * preserves the existing deferred loading and reserved-layout contract.
 */
export function useLazyMount(
  options?: { rootMargin?: string }
): { sentinelRef: React.RefObject<HTMLDivElement | null>; shouldMount: boolean } {
  const rootMargin = options?.rootMargin ?? "200px";
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const handleVisibilityChange = useCallback((visible: boolean) => {
    if (visible) setShouldMount(true);
  }, []);
  const { isVisible } = useViewportActivity<HTMLDivElement>(sentinelRef, rootMargin, handleVisibilityChange);

  return { sentinelRef, shouldMount: shouldMount || isVisible };
}
