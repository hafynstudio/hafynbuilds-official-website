import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { organizationSchema } from "@/lib/seo/schema";
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
      <body>
        {/* Organization schema is sitewide, so it is mounted once here
            rather than duplicated per page. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />
        {children}
      </body>
    </html>
  );
}
