import { Unit } from '../../ingredients/contracts/Unit';
import { Source } from './Source';
import { NutrientTag } from './NutrientTag';

export type Nutrient = {
  id: number;
  externalId: string | null;
  name: string;
  description: string | null;
  slug: string;
  iuToCanonicalFactor: number | null;
  isLabelStandard: boolean;
  displayOrder: number | null;
  syncStatus: string;
  source?: Source | null;
  canonicalUnit?: Unit | null;
  parent?: Nutrient | null;
  children?: Nutrient[];
  tags?: NutrientTag[];
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
};
