import { Unit } from '../../ingredients/contracts/Unit';
import { NutrientSourceMapping } from './NutrientSourceMapping';
import { NutrientTag } from './NutrientTag';

export type Nutrient = {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  iuToCanonicalFactor: number | null;
  isLabelStandard: boolean;
  displayOrder: number | null;
  syncStatus: string;
  sourceMappings: NutrientSourceMapping[];
  canonicalUnit?: Unit | null;
  parent?: Nutrient | null;
  children?: Nutrient[];
  tags?: NutrientTag[];
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
};
