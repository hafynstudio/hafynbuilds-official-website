export type BlogPostTag = "new" | "trending" | "deep-dive" | null;

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  bodyContent: string;
  coverImage: string;
  category: string;
  tag: BlogPostTag;
  publishedAt: string;
  authorId: string;
  readTimeMinutes: number;
}
