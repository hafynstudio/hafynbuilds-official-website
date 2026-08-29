type AnalyticsPrimitive = string | number | boolean;

type AnalyticsParams = Record<string, AnalyticsPrimitive>;

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/**
 * Sends a deliberately small, non-PII event to the existing GA4 loader.
 * Before the delayed loader is ready, it uses the standard dataLayer queue;
 * the conversion path never depends on analytics being available.
 */
export function trackEvent(eventName: string, params?: AnalyticsParams): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => {
    window.dataLayer?.push(args);
  });
  window.gtag("event", eventName, params || {});
}
