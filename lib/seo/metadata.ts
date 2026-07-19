import type { Metadata } from "next";

const SITE_NAME = "HAFYN BUILDS";
// TODO(Phase 20): confirm and swap in the final production domain before launch.
const SITE_URL = "https://hafynbuilds.com";
const DEFAULT_DESCRIPTION =
  "HAFYN BUILDS is the flagship software engineering & AI company of the HAFYN technology holding group. Engineering the impossible. Building what matters.";
// TODO: real OG image asset pending — see Phase 1 handoff doc pending items.
const DEFAULT_OG_IMAGE = "/og-image.png";

interface BuildMetadataArgs {
  title: string;
  description?: string;
  path: string; // e.g. "/about"
  ogImage?: string;
  noIndex?: boolean;
}

// Central metadata builder — every page.tsx calls this instead of hand-
// writing its own metadata object, so title/description/OG/Twitter shape
// stays identical and correct across all 9 pages (Master Build Prompt,
// SEO Execution section).
export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
}: BuildMetadataArgs): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
