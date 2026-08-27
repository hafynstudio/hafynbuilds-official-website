import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// ---------------------------------------------------------------------------
// Content Security Policy (Phase 2, SEC-001).
//
// This site is fully statically generated, so a nonce-based "strict" CSP is
// not used: Next.js applies nonces only during dynamic rendering, which
// would force every page to render per-request and disable static caching
// (per the Next.js CSP guide). Instead this is the documented static-safe
// baseline: script/style allow 'unsafe-inline' because Next.js ships its
// hydration payload as inline scripts and the design system (Framer Motion
// style attributes + injected <style> keyframes) relies on inline styles.
// All other directives are restrictive: nothing loads from third-party
// origins, fonts and images are same-origin only, no object/embed, no
// framing, form actions confined to self.
//
// 'unsafe-eval' is required only in development (React dev uses eval for
// error reconstruction); it is absent from the production policy.
// ---------------------------------------------------------------------------
// GA4 allowlist: Google Analytics 4 (loaded via @next/third-parties
// GoogleAnalytics in app/layout.tsx) requires the gtag.js loader from
// googletagmanager.com (script-src) and sends events to Google's Analytics
// collection endpoints (connect-src for /g/collect beacons, img-src as a
// fallback beacon). These three GA endpoints are the minimal, canonical set
// needed for GA4 tracking to reach the browser; everything else stays strict.
const gaScriptHosts = ["https://www.googletagmanager.com"];
const gaConnectHosts = [
  "https://www.google-analytics.com",
  "https://analytics.google.com",
  "https://stats.g.doubleclick.net",
];
const gaImageHosts = ["https://www.google-analytics.com"];

// Vercel Analytics allowlist: Vercel Web Analytics (@vercel/analytics)
// requires script loading from va.vercel-scripts.com (script-src, primarily
// in development mode) and sends analytics data to vitals.vercel-insights.com
// (connect-src). These endpoints enable web analytics tracking on Vercel's
// platform while maintaining strict CSP for all other origins.
const vercelAnalyticsScriptHosts = ["https://va.vercel-scripts.com"];
const vercelAnalyticsConnectHosts = ["https://vitals.vercel-insights.com"];

const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'" +
    (isDev ? " 'unsafe-eval'" : "") +
    gaScriptHosts.map((h) => ` ${h}`).join("") +
    vercelAnalyticsScriptHosts.map((h) => ` ${h}`).join(""),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:" + gaImageHosts.map((h) => ` ${h}`).join(""),
  "font-src 'self'",
  "connect-src 'self'" +
    gaConnectHosts.map((h) => ` ${h}`).join("") +
    vercelAnalyticsConnectHosts.map((h) => ` ${h}`).join(""),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  // HSTS: only meaningful over HTTPS (Vercel serves HTTPS by default).
  // `preload` is intentionally omitted — the production domain must be
  // confirmed before committing to the HSTS preload list.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
