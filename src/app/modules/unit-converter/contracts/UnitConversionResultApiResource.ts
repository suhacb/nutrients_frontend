import { UnitApiResource } from '../../ingredients/contracts/UnitApiResource';

export type UnitConversionResultApiResource = {
  value?: number;
  from_unit?: UnitApiResource;
  to_unit?: UnitApiResource;
  nutrient_id?: number | null;
};
