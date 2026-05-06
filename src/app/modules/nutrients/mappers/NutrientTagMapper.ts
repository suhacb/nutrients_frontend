import { NutrientTagApiResource } from '../contracts/NutrientTagApiResource';
import { NutrientTag } from '../contracts/NutrientTag';

export class NutrientTagMapper {
  toApp(api: NutrientTagApiResource): NutrientTag {
    return {
      id: api.id!,
      name: api.name!,
      slug: api.slug!,
      description: api.description ?? null,
      createdAt: new Date(api.created_at!),
      updatedAt: new Date(api.updated_at!),
    };
  }
}
