import { Unit } from './Unit';

export type NutritionFact = {
  id: number;
  category: string | null;
  name: string;
  amount: number | null;
  unit: Unit | null;
  createdAt: Date;
  updatedAt: Date;
};
