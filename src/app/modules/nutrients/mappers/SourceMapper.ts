import { SourceApiResource } from '../contracts/SourceApiResource';
import { Source } from '../contracts/Source';

export class SourceMapper {
  toApp(api: SourceApiResource): Source {
    return {
      id: api.id!,
      name: api.name!,
      slug: api.slug!,
      url: api.url ?? null,
      description: api.description ?? null,
      createdAt: new Date(api.created_at!),
      updatedAt: new Date(api.updated_at!),
    };
  }
}
