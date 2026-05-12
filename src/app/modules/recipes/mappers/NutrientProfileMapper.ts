import { NutrientProfile, NutrientProfileRow } from '../contracts/NutrientProfile';
import { NutrientProfileApiResource, NutrientProfileRowApiResource } from '../contracts/NutrientProfileApiResource';

export class NutrientProfileMapper {
  toApp(api: NutrientProfileApiResource): NutrientProfile {
    return {
      portions: api.portions,
      total: api.total.map(r => this.mapRow(r)),
      perPortion: api.per_portion.map(r => this.mapRow(r)),
    };
  }

  private mapRow(api: NutrientProfileRowApiResource): NutrientProfileRow {
    return {
      nutrientId: api.nutrient_id,
      nutrientName: api.nutrient_name,
      amount: api.amount,
      unitId: api.unit_id,
      unit: api.unit,
    };
  }
}
