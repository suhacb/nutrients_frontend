export type Brand = {
  id: number;
  name: string;
  slug: string;
  owner: string | null;
  country: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};
