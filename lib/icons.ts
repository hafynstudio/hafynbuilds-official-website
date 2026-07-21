import {
  Brain,
  Globe,
  Layers,
  Workflow,
  Building2,
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
 * (capability.icon, etc.) to the actual Lucide component. Components
 * look up their icon here rather than importing Lucide directly, keeping
 * the icon dependency surface in one place and making it trivial to
 * swap an icon globally (one line here, zero component changes).
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  Brain,
  Globe,
  Layers,
  Workflow,
  Building2,
};
