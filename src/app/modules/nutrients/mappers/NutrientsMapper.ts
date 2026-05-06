import { ResourceMapper } from '../../../core/ResourceMapper/ResourceMapper';
import { Nutrient } from '../contracts/Nutrient';
import { NutrientApiPayload } from '../contracts/NutrientApiPayload';
import { NutrientApiResource } from '../contracts/NutrientApiResource';
import { NutrientTagMapper } from './NutrientTagMapper';
import { SourceMapper } from './SourceMapper';
import { UnitsMapper } from '../../ingredients/mappers/UnitsMapper';

export class NutrientsMapper extends ResourceMapper<Nutrient, NutrientApiResource, NutrientApiPayload> {
  public toApp(api: NutrientApiResource): Nutrient {
    return {
      id: api.id!,
      externalId: api.external_id ?? null,
      name: api.name!,
      description: api.description ?? null,
      slug: api.slug ?? '',
      iuToCanonicalFactor: api.iu_to_canonical_factor ?? null,
      isLabelStandard: api.is_label_standard ?? false,
      displayOrder: api.display_order ?? null,
      syncStatus: api.sync_status ?? '',
      ...(api.source !== undefined && { source: api.source ? new SourceMapper().toApp(api.source) : null }),
      ...(api.canonical_unit !== undefined && { canonicalUnit: api.canonical_unit ? new UnitsMapper().toApp(api.canonical_unit) : null }),
      ...(api.parent !== undefined && { parent: api.parent ? this.toApp(api.parent) : null }),
      ...(api.children !== undefined && { children: api.children.map(c => this.toApp(c)) }),
      ...(api.tags !== undefined && { tags: api.tags.map(t => new NutrientTagMapper().toApp(t)) }),
      createdAt: new Date(api.created_at!),
      updatedAt: api.updated_at ? new Date(api.updated_at) : null,
      deletedAt: api.deleted_at ? new Date(api.deleted_at) : null,
    };
  }

  public toApi(app: Nutrient): NutrientApiPayload {
    return {
      source_id: app.source?.id ?? 0,
      name: app.name,
      external_id: app.externalId,
      description: app.description,
      slug: app.slug,
      iu_to_canonical_factor: app.iuToCanonicalFactor,
      is_label_standard: app.isLabelStandard,
      display_order: app.displayOrder,
    };
  }

  public make(): Nutrient {
    return {
      id: 0,
      externalId: null,
      name: '',
      description: null,
      slug: '',
      iuToCanonicalFactor: null,
      isLabelStandard: false,
      displayOrder: null,
      syncStatus: '',
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    };
  }
}
