import { Source } from './Source';

export type NutrientSourceMapping = {
  id: number;
  externalId: string;
  name: string | null;
  source: Source | null;
};
