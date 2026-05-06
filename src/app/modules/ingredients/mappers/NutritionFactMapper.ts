import { ResourceMapper } from '../../../core/ResourceMapper/ResourceMapper';
import { NutritionFact } from '../contracts/NutritionFact';
import { NutritionFactApiPayload } from '../contracts/NutritionFactApiPayload';
import { NutritionFactApiResource } from '../contracts/NutritionFactApiResource';
import { UnitsMapper } from './UnitsMapper';

export class NutritionFactMapper extends ResourceMapper<NutritionFact, NutritionFactApiResource, NutritionFactApiPayload> {
  public toApp(api: NutritionFactApiResource): NutritionFact {
    return {
      id: api.id!,
      category: api.category ?? null,
      name: api.name!,
      amount: api.amount ?? null,
      unit: api.unit ? new UnitsMapper().toApp(api.unit) : null,
      createdAt: new Date(api.created_at!),
      updatedAt: new Date(api.updated_at!),
    };
  }

  public toApi(app: NutritionFact): NutritionFactApiPayload {
    return {
      category: app.category,
      name: app.name,
      amount: app.amount,
      amount_unit_id: app.unit?.id ?? 0,
    };
  }

  public make(): NutritionFact {
    return {
      id: 0,
      category: null,
      name: '',
      amount: null,
      unit: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
