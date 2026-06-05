import { NutrientSourceMappingMapper } from './NutrientSourceMappingMapper';
import { NutrientSourceMappingApiResource } from '../contracts/NutrientSourceMappingApiResource';
import { SourceApiResource } from '../contracts/SourceApiResource';

describe('NutrientSourceMappingMapper', () => {
  let mapper: NutrientSourceMappingMapper;

  const sourceResource: SourceApiResource = {
    id: 1,
    name: 'USDA FoodData Central',
    slug: 'usda-fooddata-central',
    url: 'https://fdc.nal.usda.gov',
    description: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    mapper = new NutrientSourceMappingMapper();
  });

  describe('toApp', () => {
    it('maps all fields when source is present', () => {
      const resource: NutrientSourceMappingApiResource = {
        id: 1,
        external_id: '1004',
        name: 'Protein',
        source: sourceResource,
      };

      const result = mapper.toApp(resource);

      expect(result.id).toBe(1);
      expect(result.externalId).toBe('1004');
      expect(result.name).toBe('Protein');
      expect(result.source).not.toBeNull();
      expect(result.source!.id).toBe(1);
      expect(result.source!.name).toBe('USDA FoodData Central');
      expect(result.source!.slug).toBe('usda-fooddata-central');
    });

    it('sets name to null when absent', () => {
      const resource: NutrientSourceMappingApiResource = {
        id: 1,
        external_id: '1004',
        source: sourceResource,
      };

      const result = mapper.toApp(resource);

      expect(result.name).toBeNull();
    });

    it('sets source to null when API returns null', () => {
      const resource: NutrientSourceMappingApiResource = {
        id: 2,
        external_id: 'VIT_C',
        name: 'Vitamin C',
        source: null,
      };

      const result = mapper.toApp(resource);

      expect(result.id).toBe(2);
      expect(result.externalId).toBe('VIT_C');
      expect(result.name).toBe('Vitamin C');
      expect(result.source).toBeNull();
    });
  });
});
