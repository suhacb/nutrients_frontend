import { DietTag } from './DietTag';

export type RecipeIngredient = {
  id: number;
  name: string;
  slug: string;
  amount: number;
  unitId: number;
  unitName: string;
  unitAbbreviation: string;
};

export type Recipe = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  instructions: string | null;
  portions: number;
  sourceUrl: string | null;
  syncStatus: string;
  dietTags: DietTag[];
  ingredients: RecipeIngredient[];
};
