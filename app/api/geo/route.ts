import { type NextRequest, NextResponse } from "next/server";
import {
  countryPricingTable,
  FALLBACK_COUNTRY_CODE,
} from "@/data/currency-rates";

// Vercel provides geolocation data via request headers at the edge.
// We extract the country code and check whether it's in our supported
// pricing table. If unsupported, we return the fallback (US/USD).
// This route is called ONCE on first visit — the result is consumed by
// CurrencyProvider to pre-select the currency modal.
export async function GET(request: NextRequest) {
  // Vercel edge geolocation header — available in production automatically.
  // Falls back gracefully to the fallback country in local dev.
  const detectedCountry =
    request.headers.get("x-vercel-ip-country") ?? FALLBACK_COUNTRY_CODE;

  const supportedCodes = new Set(countryPricingTable.map((c) => c.countryCode));
  const resolvedCountry = supportedCodes.has(detectedCountry)
    ? detectedCountry
    : FALLBACK_COUNTRY_CODE;

  return NextResponse.json(
    { countryCode: resolvedCountry },
    {
      headers: {
        // Cache for 1 hour — IP doesn't change per session, no need
        // to hit this on every page load.
        "Cache-Control": "private, max-age=3600",
      },
    }
  );
}
