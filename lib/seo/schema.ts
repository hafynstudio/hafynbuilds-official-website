// JSON-LD generators — centralizes every schema type per TAD §11 so each
// page's structured data stays consistent instead of being hand-rolled
// inline. Organization schema is implemented now (sitewide, needed from
// day one). personSchema, articleSchema, and breadcrumbSchema are added
// to this file in Phases 13, 15, and 17 respectively, once the pages that
// consume them exist — they are intentionally not stubbed out here to
// avoid dead/unused exports in the meantime.

// TODO(Phase 20): confirm and swap in the final production domain.
const SITE_URL = "https://hafynbuilds.com";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HAFYN BUILDS",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description:
      "HAFYN BUILDS is the flagship software engineering & AI company of the HAFYN technology holding group.",
    founder: {
      "@type": "Person",
      name: "Zain Marwat",
    },
  };
}
