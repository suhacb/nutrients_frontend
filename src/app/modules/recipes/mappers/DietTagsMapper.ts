import { DietTag } from '../contracts/DietTag';
import { DietTagApiResource } from '../contracts/DietTagApiResource';

export class DietTagsMapper {
  toApp(api: DietTagApiResource): DietTag {
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
