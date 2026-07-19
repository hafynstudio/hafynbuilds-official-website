export interface Package {
  id: string;
  industryId: string | null; // null = one of the 3 universal Foundation packages
  name: string;
  description: string;
  basePriceUSD: number;
  features: string[];
  isFeatured: boolean;
  displayOrder: number;
}
