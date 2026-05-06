import { Unit } from './Unit';

export type IngredientNutrientPivot = {
  amount: number | null;
  amountUnit: Unit | null;
  createdAt: Date;
  updatedAt: Date;
};
