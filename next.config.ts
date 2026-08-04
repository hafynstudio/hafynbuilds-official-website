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
const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'" + (isDev ? " 'unsafe-eval'" : ""),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
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
