import type { FeaturedWork } from "@/types/featured-work";

/**
 * Featured work shown on the Home page (PRD §2.2.1).
 *
 * HAFYN BUILDS is a newly-launched brand with zero external client
 * projects at launch. Per the PRD's explicit ban on fake testimonials
 * and placeholder client work, every entry here is a real, verifiable
 * internal build — tagged "INTERNAL BUILD" so visitors can never
 * mistake them for client projects.
 *
 * Real client case studies drop into this array the moment they exist.
 * This component requires zero changes when that happens.
 *
 * displayOrder controls render sequence. First card (order 1) renders
 * as the full-width hero card — the remaining two render side-by-side
 * below it. A fourth card would extend the 2-col grid naturally.
 */
export const featuredWork: FeaturedWork[] = [
  {
    id: "hafyn-builds-website",
    name: "HAFYN BUILDS Website",
    description:
      "The site you are reading right now. Designed, architected, and engineered from zero — 9 pages, a full design system, a multi-currency pricing engine, and production-grade animation across every section.",
    tag: "Internal Build",
    status: "live",
    techStack: ["Next.js", "TypeScript", "Framer Motion", "GSAP", "Tailwind CSS"],
    metric: { label: "pages shipped", value: "9" },
    href: null,
    icon: "Globe",
    displayOrder: 1,
  },
  {
    id: "hafyn-investment-engine",
    name: "Multi-Currency Pricing Engine",
    description:
      "A fully isolated, admin-driven pricing engine handling 20+ industries, hand-calibrated per-country pricing across 20+ currencies, per-country price overrides, and IP-based geo-detection — zero third-party API dependency by design.",
    tag: "Internal Build",
    status: "in-progress",
    techStack: ["TypeScript", "Next.js Edge", "Zod", "localStorage"],
    metric: { label: "currencies supported", value: "20+" },
    href: null,
    icon: "Layers",
    displayOrder: 2,
  },
  {
    id: "hafyn-design-system",
    name: "HAFYN Design System",
    description:
      "Token-driven, dark-mode-first component library powering every page of this site. Glass-surface cards, magnetic buttons, scroll-reveal primitives, and a single motion constants file — every interaction consistent, every value traceable.",
    tag: "Internal Build",
    status: "live",
    techStack: ["TypeScript", "Tailwind CSS", "Framer Motion", "CSS Custom Properties"],
    metric: { label: "reusable primitives", value: "12" },
    href: null,
    icon: "Brain",
    displayOrder: 3,
  },
];
