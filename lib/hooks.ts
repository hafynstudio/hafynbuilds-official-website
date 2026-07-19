"use client";

import { useEffect, useState } from "react";

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
 * non-essential motion (magnetic pull, cursor trailing, modal slide/scale)
 * must check this and fall back to an instant or fade-only transition —
 * this is a hard accessibility requirement, not a nice-to-have.
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
