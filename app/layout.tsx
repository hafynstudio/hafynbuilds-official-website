import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { organizationSchema } from "@/lib/seo/schema";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CursorSpotlight } from "@/components/ui/CursorSpotlight";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HAFYN BUILDS — Engineering the Impossible. Building What Matters.",
    template: "%s | HAFYN BUILDS",
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />

        {/* Global, page-wide ambient cursor glow — mounted once here so
            it renders behind normal content but above section
            backgrounds via mix-blend-mode:screen (see CursorSpotlight.tsx
            for the full stacking-fix explanation). */}
        <CursorSpotlight />

        <LoadingScreen />
        <Header />

        {/* HERO-REGRESSION FIX: `pt-header` restores the top offset that
            the page content needs to clear the fixed-position Header —
            confirmed necessary by Hero's own
            `min-h-[calc(100dvh-var(--header-height))]` formula, which
            only makes sense if this wrapper reserves `--header-height`
            of top padding for a fixed (out-of-flow) header. This class
            was present in some form in the file's previous state before
            a corrupted copy/paste (a stray, unmatched closing </div> in
            what was pasted) lost it; this restores the correct computed
            spacing regardless of the exact original className used. */}
        <main id="main-content" className="flex-1 pt-header">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
