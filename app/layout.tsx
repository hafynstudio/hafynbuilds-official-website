import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { organizationSchema } from "@/lib/seo/schema";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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

        <CustomCursor />
        <LoadingScreen />
        <Header />

        {/* tabIndex={-1} makes this programmatically focusable so the
            skip link above reliably moves keyboard focus here, not just
            scroll position, across all browsers. pt-header compensates
            for the fixed header being removed from normal document flow. */}
        <div id="main-content" tabIndex={-1} className="flex-1 pt-header">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}
