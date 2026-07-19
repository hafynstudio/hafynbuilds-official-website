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
