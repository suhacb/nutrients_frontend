export type Unit = {
  id: number;
  name: string;
  abbreviation: string;
  type: string | null;
  toBaseFactor: number | null;
  baseUnitId: number | null;
  createdAt: Date;
  updatedAt: Date;
};
