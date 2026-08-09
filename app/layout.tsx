import type { Metadata } from "next";
import localFont from "next/font/local";
import dynamic from "next/dynamic";
import { GoogleAnalytics } from "@next/third-parties/google";
import { organizationSchema } from "@/lib/seo/schema";
import { Footer } from "@/components/layout/Footer";
import { CursorSpotlight } from "@/components/ui/CursorSpotlight";
import { CurrencyProvider } from "@/lib/currency/context";
import "./globals.css";

const LoadingScreen = dynamic(
  () =>
    import("@/components/layout/LoadingScreen").then(
      (m) => ({ default: m.LoadingScreen })
    ),
);

const Header = dynamic(
  () =>
    import("@/components/layout/Header").then(
      (m) => ({ default: m.Header })
    ),
);

// Self-hosted Inter — eliminates the render-blocking fonts.googleapis.com stylesheet
// request that was adding 170–320ms to mobile LCP. Files copied from @fontsource/inter
// (latin subset only — site is English-only). CSS variable name unchanged so no
// downstream component or Tailwind config changes are required.
const inter = localFont({
  src: [
    { path: "../public/fonts/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/inter-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/inter-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/inter-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

// Self-hosted JetBrains Mono — same motivation as Inter above. Four static weight files
// replace the Google CDN fetch. Weights 400/500/600/700 match the prior explicit weight
// restriction. CSS variable name unchanged.
const jetbrainsMono = localFont({
  src: [
    { path: "../public/fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/jetbrains-mono-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/jetbrains-mono-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Title strategy: buildMetadata() in lib/seo/metadata.ts is the single
// composer of page titles — it appends the " | HAFYN BUILDS" brand suffix
// exactly once. This layout's title.template MUST stay inert ("%s" only):
// Next applies a parent template on top of a page's own title string, so a
// template of "%s | HAFYN BUILDS" would turn buildMetadata's already-branded
// "About | HAFYN BUILDS" into "About | HAFYN BUILDS | HAFYN BUILDS".
// title.default remains the fallback for routes with no metadata export
// (e.g. the 404 page).
export const metadata: Metadata = {
  title: {
    default: "HAFYN BUILDS — Engineering the Impossible. Building What Matters.",
    template: "%s",
  },
  description:
    "HAFYN BUILDS is the flagship software engineering & AI company of the HAFYN technology holding group, founded by Zain Marwat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      // FIX (audit item 7): Next.js 15+ warns when `scroll-behavior: smooth`
      // is set via CSS but the html element lacks this data attribute --
      // without it, Next's router can interrupt an in-flight smooth scroll
      // on route change, causing a jarring scroll-position jump. This
      // attribute tells Next's router to respect the CSS-driven smooth
      // scroll instead of overriding it.
      data-scroll-behavior="smooth"
    >
      {/* FIX (audit item 1, safety net layer): overflow-x-hidden here is a
          defense-in-depth backstop, not the primary fix -- the actual root
          cause (WhatsAppCTA's scaled pulse-ring transform contributing to
          document scrollWidth) is fixed at the component level. This class
          simply guarantees that even if a future component introduces a
          similar transform-overflow issue, the page never becomes
          horizontally scrollable as a result. */}
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />

        <CursorSpotlight />

        <CurrencyProvider>
          <LoadingScreen />
          <Header />

          <main id="main-content" className="flex-1 overflow-x-hidden pt-header">
            {children}
          </main>

          <Footer />
        </CurrencyProvider>

        {/* Google Analytics 4 — injected via the official @next/third-parties
            integration. This is the Next.js-recommended approach for App
            Router: it hydrates the gtag loader on route change so page views
            are tracked automatically across client-side navigation (no manual
            pageview events needed). gaId comes from NEXT_PUBLIC_GA_ID; if the
            env var is missing at build time (e.g. an env that forgot to set
            it) it renders nothing rather than crashing the page. */}
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        ) : null}
      </body>
    </html>
  );
}