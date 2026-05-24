import { Unit } from '../../ingredients/contracts/Unit';

export type UnitConversionResult = {
  value: number;
  fromUnit: Unit;
  toUnit: Unit;
  nutrientId: number | null;
};
