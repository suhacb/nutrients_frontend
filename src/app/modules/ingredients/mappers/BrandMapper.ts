import { BrandApiResource } from '../contracts/BrandApiResource';
import { Brand } from '../contracts/Brand';

export class BrandMapper {
  toApp(api: BrandApiResource): Brand {
    return {
      id: api.id!,
      name: api.name!,
      slug: api.slug!,
      owner: api.owner ?? null,
      country: api.country ?? null,
      description: api.description ?? null,
      createdAt: new Date(api.created_at!),
      updatedAt: new Date(api.updated_at!),
    };
  }
}
