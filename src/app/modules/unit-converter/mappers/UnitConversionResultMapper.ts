import { UnitsMapper } from '../../ingredients/mappers/UnitsMapper';
import { UnitConversionResult } from '../contracts/UnitConversionResult';
import { UnitConversionResultApiResource } from '../contracts/UnitConversionResultApiResource';

export class UnitConversionResultMapper {
  private readonly unitsMapper = new UnitsMapper();

  toApp(api: UnitConversionResultApiResource): UnitConversionResult {
    return {
      value: api.value!,
      fromUnit: this.unitsMapper.toApp(api.from_unit!),
      toUnit: this.unitsMapper.toApp(api.to_unit!),
      nutrientId: api.nutrient_id ?? null,
    };
  }
}
