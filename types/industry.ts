export type IndustryVisualTheme = "warm" | "clean" | "elegant" | "vibrant" | "professional";

export interface Industry {
  id: string;
  name: string;
  category: string;
  description: string;
  iconOrIllustration: string;
  visualTheme: IndustryVisualTheme;
  isActive: boolean;
}
