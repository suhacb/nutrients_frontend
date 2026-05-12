export type NutrientProfileRowApiResource = {
  nutrient_id: number;
  nutrient_name: string;
  amount: number;
  unit_id: number;
  unit: string;
};

export type NutrientProfileApiResource = {
  total: NutrientProfileRowApiResource[];
  per_portion: NutrientProfileRowApiResource[];
  portions: number;
};
