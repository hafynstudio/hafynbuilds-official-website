import {
  Brain,
  Globe,
  Layers,
  Workflow,
  Building2,
  Shield,
  Zap,
  TrendingUp,
  Code2,
  RefreshCw,
  UtensilsCrossed,
  Stethoscope,
  Briefcase,
  ShoppingBag,
  GraduationCap,
  Sparkles,
  HardHat,
  Cpu,
  Landmark,
  Car,
  Hotel,
  Palette,
  Factory,
  Truck,
  type LucideIcon,
} from "lucide-react";

/**
 * Single stroke-width constant used by every icon across the site.
 * One value here = one consistent visual weight everywhere.
 * Never pass a raw strokeWidth number directly to a Lucide icon —
 * always reference this constant so a future weight change is one edit.
 */
export const ICON_STROKE_WIDTH = 1.5;

/**
 * Centralised icon registry — maps the string key stored in data files
 * (capability.icon, techPrinciple.icon, industry.iconOrIllustration, etc.)
 * to the actual Lucide component. Components look up their icon here
 * rather than importing Lucide directly, keeping the icon dependency
 * surface in one place.
 *
 * Shield/Zap/TrendingUp/Code2/RefreshCw added in Phase 8 to power
 * data/tech-philosophy.ts (Capabilities page Tech Philosophy strip).
 *
 * UtensilsCrossed through Factory added in Phase 11 to power
 * data/industries.ts — one representative icon per industry category
 * (13 total) rather than a unique icon per individual industry, since
 * PRD §2.2.6 calls for "personality-matched visual styling" at the
 * category level, not a bespoke icon per each of the 50+ industries.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  Brain,
  Globe,
  Layers,
  Workflow,
  Building2,
  Shield,
  Zap,
  TrendingUp,
  Code2,
  RefreshCw,
  UtensilsCrossed,
  Stethoscope,
  Briefcase,
  ShoppingBag,
  GraduationCap,
  Sparkles,
  HardHat,
  Cpu,
  Landmark,
  Car,
  Hotel,
  Palette,
  Factory,
  // FIX (Phase 2, CONTENT-003): Logistics (data/industries.ts) references
  // iconOrIllustration "Truck", which was missing from the registry and
  // rendered a null icon. Added to complete the category set.
  Truck,
};
