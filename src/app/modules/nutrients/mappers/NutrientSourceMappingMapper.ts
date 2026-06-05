import { NutrientSourceMapping } from '../contracts/NutrientSourceMapping';
import { NutrientSourceMappingApiResource } from '../contracts/NutrientSourceMappingApiResource';
import { SourceMapper } from './SourceMapper';

export class NutrientSourceMappingMapper {
  toApp(api: NutrientSourceMappingApiResource): NutrientSourceMapping {
    return {
      id: api.id!,
      externalId: api.external_id!,
      name: api.name ?? null,
      source: api.source ? new SourceMapper().toApp(api.source) : null,
    };
  }
}
