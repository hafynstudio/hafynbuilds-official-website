// HAFYN BUILDS — Industry Package Pricing Table
// 20 industries x 3 packages x 28 countries = 1680 rows at full scale.
// Phase 12: seeding Pakistan (PKR) only as starter. Other countries
// added via admin panel or manual data entry later.
//
// LOOKUP ONLY — no calculation, no conversion. Each row is a hardcoded
// price exactly as the client will see it in that country.

import type { IndustryPackagePrice } from "@/types/industry-package-pricing";

export const industryPackagePricing: IndustryPackagePrice[] = [
  // ══════════════════════════════════════════════════════════════════
  // PAKISTAN (PKR) — All 20 industries x 3 tiers = 60 rows
  // ══════════════════════════════════════════════════════════════════

  // ── Restaurant ────────────────────────────────────────────────────
  { packageId: "restaurant-starter", countryCode: "PK", regularPrice: 54999, foundingPrice: 39999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "restaurant-standard", countryCode: "PK", regularPrice: 99999, foundingPrice: 74999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "restaurant-premium", countryCode: "PK", regularPrice: 174999, foundingPrice: 129999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Café & Coffee Shop ────────────────────────────────────────────
  { packageId: "cafe-coffee-shop-starter", countryCode: "PK", regularPrice: 54999, foundingPrice: 39999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "cafe-coffee-shop-standard", countryCode: "PK", regularPrice: 99999, foundingPrice: 74999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "cafe-coffee-shop-premium", countryCode: "PK", regularPrice: 174999, foundingPrice: 129999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Bakery & Pastry ───────────────────────────────────────────────
  { packageId: "bakery-pastry-starter", countryCode: "PK", regularPrice: 54999, foundingPrice: 39999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "bakery-pastry-standard", countryCode: "PK", regularPrice: 99999, foundingPrice: 74999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "bakery-pastry-premium", countryCode: "PK", regularPrice: 174999, foundingPrice: 129999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Catering & Events ─────────────────────────────────────────────
  { packageId: "catering-events-food-starter", countryCode: "PK", regularPrice: 54999, foundingPrice: 39999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "catering-events-food-standard", countryCode: "PK", regularPrice: 99999, foundingPrice: 74999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "catering-events-food-premium", countryCode: "PK", regularPrice: 174999, foundingPrice: 129999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Medical Clinic ────────────────────────────────────────────────
  { packageId: "medical-clinic-starter", countryCode: "PK", regularPrice: 59999, foundingPrice: 44999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "medical-clinic-standard", countryCode: "PK", regularPrice: 109999, foundingPrice: 79999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "medical-clinic-premium", countryCode: "PK", regularPrice: 189999, foundingPrice: 139999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Dental Practice ───────────────────────────────────────────────
  { packageId: "dental-practice-starter", countryCode: "PK", regularPrice: 59999, foundingPrice: 44999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "dental-practice-standard", countryCode: "PK", regularPrice: 109999, foundingPrice: 79999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "dental-practice-premium", countryCode: "PK", regularPrice: 189999, foundingPrice: 139999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Hospital ──────────────────────────────────────────────────────
  { packageId: "hospital-starter", countryCode: "PK", regularPrice: 74999, foundingPrice: 54999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "hospital-standard", countryCode: "PK", regularPrice: 134999, foundingPrice: 99999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "hospital-premium", countryCode: "PK", regularPrice: 224999, foundingPrice: 169999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Physiotherapy & Rehab ─────────────────────────────────────────
  { packageId: "physiotherapy-rehabilitation-starter", countryCode: "PK", regularPrice: 54999, foundingPrice: 39999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "physiotherapy-rehabilitation-standard", countryCode: "PK", regularPrice: 99999, foundingPrice: 74999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "physiotherapy-rehabilitation-premium", countryCode: "PK", regularPrice: 174999, foundingPrice: 129999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Hair Salon ────────────────────────────────────────────────────
  { packageId: "hair-salon-starter", countryCode: "PK", regularPrice: 49999, foundingPrice: 36999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "hair-salon-standard", countryCode: "PK", regularPrice: 89999, foundingPrice: 66999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "hair-salon-premium", countryCode: "PK", regularPrice: 159999, foundingPrice: 119999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Beauty Spa ────────────────────────────────────────────────────
  { packageId: "beauty-spa-starter", countryCode: "PK", regularPrice: 49999, foundingPrice: 36999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "beauty-spa-standard", countryCode: "PK", regularPrice: 89999, foundingPrice: 66999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "beauty-spa-premium", countryCode: "PK", regularPrice: 159999, foundingPrice: 119999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Real Estate Developer ─────────────────────────────────────────
  { packageId: "real-estate-developer-starter", countryCode: "PK", regularPrice: 64999, foundingPrice: 47999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "real-estate-developer-standard", countryCode: "PK", regularPrice: 119999, foundingPrice: 89999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "real-estate-developer-premium", countryCode: "PK", regularPrice: 199999, foundingPrice: 149999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── General Contractor ────────────────────────────────────────────
  { packageId: "general-contractor-starter", countryCode: "PK", regularPrice: 59999, foundingPrice: 44999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "general-contractor-standard", countryCode: "PK", regularPrice: 109999, foundingPrice: 79999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "general-contractor-premium", countryCode: "PK", regularPrice: 189999, foundingPrice: 139999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── School & University ───────────────────────────────────────────
  { packageId: "school-university-starter", countryCode: "PK", regularPrice: 59999, foundingPrice: 44999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "school-university-standard", countryCode: "PK", regularPrice: 109999, foundingPrice: 79999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "school-university-premium", countryCode: "PK", regularPrice: 189999, foundingPrice: 139999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Tutoring Centre ───────────────────────────────────────────────
  { packageId: "tutoring-centre-starter", countryCode: "PK", regularPrice: 49999, foundingPrice: 36999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "tutoring-centre-standard", countryCode: "PK", regularPrice: 89999, foundingPrice: 66999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "tutoring-centre-premium", countryCode: "PK", regularPrice: 159999, foundingPrice: 119999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Pharmacy ──────────────────────────────────────────────────────
  { packageId: "pharmacy-starter", countryCode: "PK", regularPrice: 49999, foundingPrice: 36999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "pharmacy-standard", countryCode: "PK", regularPrice: 89999, foundingPrice: 66999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "pharmacy-premium", countryCode: "PK", regularPrice: 159999, foundingPrice: 119999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Accounting Firm ───────────────────────────────────────────────
  { packageId: "accounting-firm-starter", countryCode: "PK", regularPrice: 54999, foundingPrice: 39999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "accounting-firm-standard", countryCode: "PK", regularPrice: 99999, foundingPrice: 74999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "accounting-firm-premium", countryCode: "PK", regularPrice: 174999, foundingPrice: 129999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Travel Agency ─────────────────────────────────────────────────
  { packageId: "travel-agency-starter", countryCode: "PK", regularPrice: 54999, foundingPrice: 39999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "travel-agency-standard", countryCode: "PK", regularPrice: 99999, foundingPrice: 74999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "travel-agency-premium", countryCode: "PK", regularPrice: 174999, foundingPrice: 129999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Hotel & Boutique Stay ─────────────────────────────────────────
  { packageId: "hotel-boutique-starter", countryCode: "PK", regularPrice: 64999, foundingPrice: 47999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "hotel-boutique-standard", countryCode: "PK", regularPrice: 119999, foundingPrice: 89999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "hotel-boutique-premium", countryCode: "PK", regularPrice: 199999, foundingPrice: 149999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Logistics & Courier ───────────────────────────────────────────
  { packageId: "logistics-courier-starter", countryCode: "PK", regularPrice: 54999, foundingPrice: 39999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "logistics-courier-standard", countryCode: "PK", regularPrice: 99999, foundingPrice: 74999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "logistics-courier-premium", countryCode: "PK", regularPrice: 174999, foundingPrice: 129999, currencyCode: "PKR", currencySymbol: "Rs" },

  // ── Auto Repair Workshop ──────────────────────────────────────────
  { packageId: "auto-repair-workshop-starter", countryCode: "PK", regularPrice: 49999, foundingPrice: 36999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "auto-repair-workshop-standard", countryCode: "PK", regularPrice: 89999, foundingPrice: 66999, currencyCode: "PKR", currencySymbol: "Rs" },
  { packageId: "auto-repair-workshop-premium", countryCode: "PK", regularPrice: 159999, foundingPrice: 119999, currencyCode: "PKR", currencySymbol: "Rs" },
];

// ── Lookup helper ────────────────────────────────────────────────────────
/**
 * Find pricing for a specific package in a specific country.
 * Returns undefined if no pricing row exists (e.g. country not yet added).
 */
export function getIndustryPackagePrice(
  packageId: string,
  countryCode: string
): IndustryPackagePrice | undefined {
  return industryPackagePricing.find(
    (p) => p.packageId === packageId && p.countryCode === countryCode
  );
}
