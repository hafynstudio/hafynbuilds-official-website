import type { SocialLink } from "@/types/social";

export interface PhilosophyQuote {
  quote: string;
  context?: string;
}

export interface FounderProfile {
  name: string;
  title: string;
  portraitUrl: string;
  bio: string; // first-person narrative; paragraphs separated by \n\n
  philosophyQuotes: PhilosophyQuote[];
  socialLinks: SocialLink[];
}
