import { ResourceMapper } from '../../../core/ResourceMapper/ResourceMapper';
import { NutrientsMapper } from '../../nutrients/mappers/NutrientsMapper';
import { Ingredient, IngredientNutrient } from '../contracts/Ingredient';
import { IngredientApiPayload } from '../contracts/IngredientApiPayload';
import { IngredientApiResource } from '../contracts/IngredientApiResource';
import { BrandMapper } from './BrandMapper';
import { IngredientCategoryMapper } from './IngredientCategoryMapper';
import { NutritionFactMapper } from './NutritionFactMapper';
import { UnitsMapper } from './UnitsMapper';

export class IngredientsMapper extends ResourceMapper<Ingredient, IngredientApiResource, IngredientApiPayload> {
  public toApp(api: IngredientApiResource): Ingredient {
    return {
      id: api.id!,
      externalId: api.external_id ?? null,
      source: api.source ?? null,
      class: api.class ?? null,
      name: api.name!,
      slug: api.slug ?? '',
      description: api.description ?? null,
      defaultAmount: api.default_amount ?? null,
      syncStatus: api.sync_status ?? '',
      ...(api.brand !== undefined && { brand: api.brand ? new BrandMapper().toApp(api.brand) : null }),
      ...(api.default_amount_unit !== undefined && { defaultAmountUnit: api.default_amount_unit ? new UnitsMapper().toApp(api.default_amount_unit) : null }),
      ...(api.nutrients != null && {
        nutrients: api.nutrients.map((n): IngredientNutrient => ({
          ...new NutrientsMapper().toApp(n),
          ...(n.pivot !== undefined && {
            pivot: {
              amount: n.pivot.amount ?? null,
              amountUnit: n.pivot.amount_unit ? new UnitsMapper().toApp(n.pivot.amount_unit) : null,
              createdAt: new Date(n.pivot.created_at!),
              updatedAt: new Date(n.pivot.updated_at!),
            },
          }),
        })),
      }),
      ...(api.nutrition_facts != null && {
        nutritionFacts: api.nutrition_facts.map(nf => new NutritionFactMapper().toApp(nf)),
      }),
      ...(api.categories != null && {
        categories: api.categories.map(c => new IngredientCategoryMapper().toApp(c)),
      }),
      createdAt: new Date(api.created_at!),
      updatedAt: api.updated_at ? new Date(api.updated_at) : null,
      deletedAt: api.deleted_at ? new Date(api.deleted_at) : null,
    };
  }

  public toApi(app: Ingredient): IngredientApiPayload {
    return {
      source: app.source ?? '',
      name: app.name,
      external_id: app.externalId,
      class: app.class,
      slug: app.slug,
      description: app.description,
      default_amount: app.defaultAmount ?? 100,
      default_amount_unit_id: app.defaultAmountUnit?.id ?? 0,
      brand_id: app.brand?.id ?? null,
    };
  }

  public make(): Ingredient {
    return {
      id: 0,
      externalId: null,
      source: null,
      class: null,
      name: '',
      slug: '',
      description: null,
      defaultAmount: 100,
      syncStatus: '',
      nutrients: [],
      nutritionFacts: [],
      categories: [],
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    };
  }
}
