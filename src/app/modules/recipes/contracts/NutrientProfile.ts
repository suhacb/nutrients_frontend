export type NutrientProfileRow = {
  nutrientId: number;
  nutrientName: string;
  amount: number;
  unitId: number;
  unit: string;
};

export type NutrientProfile = {
  total: NutrientProfileRow[];
  perPortion: NutrientProfileRow[];
  portions: number;
};
