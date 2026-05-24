import { Source } from './Source';

export type NutrientSourceMapping = {
  id: number;
  externalId: string;
  source: Source | null;
};
