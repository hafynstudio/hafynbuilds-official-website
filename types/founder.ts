export interface PhilosophyQuote {
  quote: string;
  context?: string;
}

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "twitter"
  | "email"
  | "whatsapp";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label: string;
}

export interface FounderProfile {
  name: string;
  title: string;
  portraitUrl: string;
  bio: string; // first-person narrative; paragraphs separated by \n\n
  philosophyQuotes: PhilosophyQuote[];
  socialLinks: SocialLink[];
}
