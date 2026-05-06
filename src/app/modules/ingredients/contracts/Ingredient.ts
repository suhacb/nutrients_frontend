import { Nutrient } from '../../nutrients/contracts/Nutrient';
import { Brand } from './Brand';
import { IngredientCategory } from './IngredientCategory';
import { IngredientNutrientPivot } from './IngredientNutrientPivot';
import { NutritionFact } from './NutritionFact';
import { Unit } from './Unit';

export type IngredientNutrient = Nutrient & { pivot?: IngredientNutrientPivot };

export type Ingredient = {
  id: number;
  externalId: string | null;
  source: string | null;
  class: string | null;
  name: string;
  slug: string;
  description: string | null;
  defaultAmount: number | null;
  syncStatus: string;
  brand?: Brand | null;
  defaultAmountUnit?: Unit | null;
  nutrients?: IngredientNutrient[];
  nutritionFacts?: NutritionFact[];
  categories?: IngredientCategory[];
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
};
