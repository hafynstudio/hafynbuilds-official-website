// HAFYN BUILDS — Foundation Package Definitions
// The 3 universal packages shown to every visitor regardless of industry.
// Pricing is NOT stored here — it lives in data/currency-rates.ts as
// per-country lookup values. This file holds only content/features/meta.

export interface FoundationPackage {
  id: "foundation" | "growth" | "business";
  name: string;
  tagline: string;
  colorClass: string;
  glowClass: string;
  borderClass: string;
  isMostChosen: boolean;
  deliveryDays: string;
  revisionRounds: number;
  supportPeriod: string;
  bestFor: string;
  features: string[];
  signatureFeatures: string[];
  ctaLabel: string;
  displayOrder: number;
}

export const foundationPackages: FoundationPackage[] = [
  {
    id: "foundation",
    name: "FOUNDATION",
    tagline: "Your business, credible online.",
    colorClass: "text-accent",
    glowClass: "hover:shadow-[0_0_60px_rgba(62,123,250,0.15)]",
    borderClass: "hover:border-accent/40",
    isMostChosen: false,
    deliveryDays: "7\u20138 days",
    revisionRounds: 2,
    supportPeriod: "30 days",
    bestFor: "New businesses and small shops establishing their first real online presence.",
    features: [
      "Up to 4 custom-designed pages \u2014 Home, About, Services, Contact",
      "Fully responsive on mobile, tablet, and desktop",
      "WhatsApp click-to-chat button",
      "Google Maps integration for your location",
      "Contact form with instant email notifications",
      "Basic on-page SEO setup",
      "Free domain + hosting setup assistance (1 year)",
      "SSL security certificate",
    ],
    signatureFeatures: [
      "Up to 4 custom-designed pages \u2014 Home, About, Services, Contact",
    ],
    ctaLabel: "Start with Foundation",
    displayOrder: 1,
  },
  {
    id: "growth",
    name: "GROWTH",
    tagline: "Turn your website into a lead-generating asset.",
    colorClass: "text-warning",
    glowClass: "hover:shadow-[0_0_60px_rgba(245,158,11,0.15)]",
    borderClass: "hover:border-warning/40",
    isMostChosen: true,
    deliveryDays: "10\u201312 days",
    revisionRounds: 4,
    supportPeriod: "90 days",
    bestFor: "Growing businesses that need to get found on Google and convert visitors into leads.",
    features: [
      "Everything in Foundation, plus:",
      "Up to 8 pages \u2014 adds Portfolio/Gallery, Testimonials, Blog, FAQ",
      "Built-in blog system \u2014 publish updates yourself, no developer needed",
      "Advanced SEO \u2014 keyword structure, sitemap, Google Search Console setup",
      "Google Business Profile optimization for local search",
      "Lead capture forms with instant notifications",
      "1 free content refresh at the 6-month mark",
    ],
    signatureFeatures: [
      "Built-in blog system \u2014 publish updates yourself, no developer needed",
      "Advanced SEO \u2014 keyword structure, sitemap, Google Search Console setup",
      "Google Business Profile optimization for local search",
    ],
    ctaLabel: "Start with Growth",
    displayOrder: 2,
  },
  {
    id: "business",
    name: "BUSINESS",
    tagline: "A complete digital operations layer.",
    colorClass: "text-error",
    glowClass: "hover:shadow-[0_0_60px_rgba(239,68,68,0.15)]",
    borderClass: "hover:border-error/40",
    isMostChosen: false,
    deliveryDays: "14\u201318 days",
    revisionRounds: 6,
    supportPeriod: "6 months",
    bestFor: "Established businesses that want their website to actively run part of their operations.",
    features: [
      "Everything in Growth, plus:",
      "Up to 12\u201315 pages, built on scalable architecture",
      "Custom business email setup (you@yourbusiness.com)",
      "Google Analytics + conversion tracking setup",
      "Booking / appointment or quote-request system",
      "Bilingual support \u2014 Urdu + English",
      "Dedicated onboarding call + team training session",
      "1 scheduled maintenance visit",
    ],
    signatureFeatures: [
      "Booking / appointment or quote-request system",
      "Bilingual support \u2014 Urdu + English",
      "Dedicated onboarding call + team training session",
    ],
    ctaLabel: "Start with Business",
    displayOrder: 3,
  },
];
