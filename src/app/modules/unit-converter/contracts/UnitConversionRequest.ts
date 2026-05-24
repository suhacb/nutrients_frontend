export type UnitConversionRequest = {
  value: number;
  from_unit_id: number;
  to_unit_id?: number | null;
  nutrient_id?: number | null;
};
