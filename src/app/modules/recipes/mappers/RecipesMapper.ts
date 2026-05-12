import { Recipe, RecipeIngredient } from '../contracts/Recipe';
import { RecipeApiResource } from '../contracts/RecipeApiResource';
import { DietTagsMapper } from './DietTagsMapper';

export class RecipesMapper {
  private readonly dietTagsMapper = new DietTagsMapper();

  toApp(api: RecipeApiResource): Recipe {
    return {
      id: api.id!,
      name: api.name!,
      slug: api.slug ?? '',
      description: api.description ?? null,
      instructions: api.instructions ?? null,
      portions: api.portions ?? 1,
      sourceUrl: api.source_url ?? null,
      syncStatus: api.sync_status ?? '',
      dietTags: (api.diet_tags ?? []).map(t => this.dietTagsMapper.toApp(t)),
      ingredients: (api.ingredients ?? []).map(i => this.mapIngredient(i)),
    };
  }

  private mapIngredient(api: NonNullable<RecipeApiResource['ingredients']>[number]): RecipeIngredient {
    const pivot = api.pivot;
    return {
      id: api.id!,
      name: api.name!,
      slug: api.slug ?? '',
      amount: pivot?.amount ?? 0,
      unitId: pivot?.unit_id ?? 0,
      unitName: pivot?.unit?.name ?? '',
      unitAbbreviation: pivot?.unit?.abbreviation ?? '',
    };
  }

  make(): Recipe {
    return {
      id: 0,
      name: '',
      slug: '',
      description: null,
      instructions: null,
      portions: 1,
      sourceUrl: null,
      syncStatus: '',
      dietTags: [],
      ingredients: [],
    };
  }
}
