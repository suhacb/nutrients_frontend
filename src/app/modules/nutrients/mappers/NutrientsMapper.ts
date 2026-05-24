import { ResourceMapper } from '../../../core/ResourceMapper/ResourceMapper';
import { Nutrient } from '../contracts/Nutrient';
import { NutrientApiPayload } from '../contracts/NutrientApiPayload';
import { NutrientApiResource } from '../contracts/NutrientApiResource';
import { NutrientTagMapper } from './NutrientTagMapper';
import { NutrientSourceMappingMapper } from './NutrientSourceMappingMapper';
import { UnitsMapper } from '../../ingredients/mappers/UnitsMapper';

export class NutrientsMapper extends ResourceMapper<Nutrient, NutrientApiResource, NutrientApiPayload> {
  public toApp(api: NutrientApiResource): Nutrient {
    return {
      id: api.id!,
      name: api.name!,
      description: api.description ?? null,
      slug: api.slug ?? '',
      iuToCanonicalFactor: api.iu_to_canonical_factor ?? null,
      isLabelStandard: api.is_label_standard ?? false,
      displayOrder: api.display_order ?? null,
      syncStatus: api.sync_status ?? '',
      sourceMappings: (api.source_mappings ?? []).map(m => new NutrientSourceMappingMapper().toApp(m)),
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
      name: app.name,
      description: app.description,
      parent_id: app.parent?.id ?? null,
      slug: app.slug,
      canonical_unit_id: app.canonicalUnit?.id ?? null,
      iu_to_canonical_factor: app.iuToCanonicalFactor,
      is_label_standard: app.isLabelStandard,
      display_order: app.displayOrder,
    };
  }

  public make(): Nutrient {
    return {
      id: 0,
      name: '',
      description: null,
      slug: '',
      iuToCanonicalFactor: null,
      isLabelStandard: false,
      displayOrder: null,
      syncStatus: '',
      sourceMappings: [],
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    };
  }
}
