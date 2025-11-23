export type Nutrient = {
  id: number,
  source: string;
  externalId: string | null;
  name: string;
  description: string | null;
  derivationCode: string | null;
  derivationDescription: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
};