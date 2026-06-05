import { NutrientsMapper } from './NutrientsMapper';
import { NutrientSourceMappingApiResource } from '../contracts/NutrientSourceMappingApiResource';
import { NutrientTagApiResource } from '../contracts/NutrientTagApiResource';
import { SourceApiResource } from '../contracts/SourceApiResource';
import { UnitApiResource } from '../../ingredients/contracts/UnitApiResource';

describe('NutrientsMapper', () => {
  let mapper: NutrientsMapper;

  const sourceResource: SourceApiResource = {
    id: 1,
    name: 'USDA',
    slug: 'usda',
    url: null,
    description: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const sourceMappingResource: NutrientSourceMappingApiResource = {
    id: 1,
    external_id: 'VIT_D',
    name: 'Vitamin D',
    source: sourceResource,
  };

  const unitResource: UnitApiResource = {
    id: 10,
    name: 'Milligram',
    abbreviation: 'mg',
    type: 'mass',
    to_base_factor: 0.000001,
    base_unit_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const tagResource: NutrientTagApiResource = {
    id: 3,
    name: 'Fat-soluble',
    slug: 'fat-soluble',
    description: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  // Fixtures are typed without explicit annotation so this spec is valid before and after
  // generated.d.ts is regenerated (the Nutrient schema changed: source_nutrients replaces
  // top-level source / external_id). Run npm run generate:api-types to sync generated.d.ts.
  const childResource = {
    id: 2,
    name: 'Vitamin D3',
    slug: 'vitamin-d3',
    source_nutrients: [] as NutrientSourceMappingApiResource[],
    description: null,
    sync_status: 'synced',
    is_label_standard: false,
    display_order: null,
    iu_to_canonical_factor: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: undefined,
    deleted_at: undefined,
  };

  const fullResource = {
    id: 1,
    name: 'Vitamin D',
    slug: 'vitamin-d',
    source_nutrients: [sourceMappingResource],
    description: 'Essential vitamin.',
    sync_status: 'synced',
    is_label_standard: true,
    display_order: 5,
    iu_to_canonical_factor: 0.025,
    canonical_unit: unitResource,
    parent: null,
    children: [childResource],
    tags: [tagResource],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-06-01T12:00:00Z',
    deleted_at: undefined,
  };

  beforeEach(() => {
    mapper = new NutrientsMapper();
  });

  describe('toApp', () => {
    it('maps all scalar fields', () => {
      const result = mapper.toApp(fullResource as any);

      expect(result.id).toBe(1);
      expect(result.name).toBe('Vitamin D');
      expect(result.slug).toBe('vitamin-d');
      expect(result.description).toBe('Essential vitamin.');
      expect(result.syncStatus).toBe('synced');
      expect(result.isLabelStandard).toBeTrue();
      expect(result.displayOrder).toBe(5);
      expect(result.iuToCanonicalFactor).toBe(0.025);
      expect(result.createdAt).toEqual(new Date('2024-01-15T10:00:00Z'));
      expect(result.updatedAt).toEqual(new Date('2024-06-01T12:00:00Z'));
      expect(result.deletedAt).toBeNull();
    });

    it('maps sourceMappings array', () => {
      const result = mapper.toApp(fullResource as any);

      expect(result.sourceMappings.length).toBe(1);
      expect(result.sourceMappings[0].id).toBe(1);
      expect(result.sourceMappings[0].externalId).toBe('VIT_D');
      expect(result.sourceMappings[0].source!.name).toBe('USDA');
    });

    it('returns an empty sourceMappings array when source_nutrients is absent', () => {
      const minimal = {
        id: 99,
        name: 'Iron',
        slug: 'iron',
        sync_status: 'synced',
        is_label_standard: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: undefined,
        deleted_at: undefined,
      };

      const result = mapper.toApp(minimal as any);

      expect(result.sourceMappings).toEqual([]);
    });

    it('maps the nested canonicalUnit relation', () => {
      const result = mapper.toApp(fullResource as any);

      expect(result.canonicalUnit).not.toBeNull();
      expect(result.canonicalUnit!.id).toBe(10);
      expect(result.canonicalUnit!.abbreviation).toBe('mg');
    });

    it('maps parent to null when explicitly null', () => {
      const result = mapper.toApp(fullResource as any);

      expect(result.parent).toBeNull();
    });

    it('maps children array recursively', () => {
      const result = mapper.toApp(fullResource as any);

      expect(result.children).toBeDefined();
      expect(result.children!.length).toBe(1);
      expect(result.children![0].id).toBe(2);
      expect(result.children![0].name).toBe('Vitamin D3');
      expect(result.children![0].sourceMappings).toEqual([]);
    });

    it('maps tags array', () => {
      const result = mapper.toApp(fullResource as any);

      expect(result.tags).toBeDefined();
      expect(result.tags!.length).toBe(1);
      expect(result.tags![0].name).toBe('Fat-soluble');
    });

    it('omits optional relations when not present in the API response', () => {
      const minimal = {
        id: 99,
        name: 'Iron',
        slug: 'iron',
        sync_status: 'synced',
        is_label_standard: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: undefined,
        deleted_at: undefined,
      };

      const result = mapper.toApp(minimal as any);

      expect('canonicalUnit' in result).toBeFalse();
      expect('parent' in result).toBeFalse();
      expect('children' in result).toBeFalse();
      expect('tags' in result).toBeFalse();
    });

    it('sets description, displayOrder, iuToCanonicalFactor to null when absent', () => {
      const result = mapper.toApp({
        ...fullResource,
        description: undefined,
        display_order: undefined,
        iu_to_canonical_factor: undefined,
      } as any);

      expect(result.description).toBeNull();
      expect(result.displayOrder).toBeNull();
      expect(result.iuToCanonicalFactor).toBeNull();
    });
  });

  describe('toApi', () => {
    it('includes name, slug, description, and other scalar fields', () => {
      const nutrient = mapper.toApp(fullResource as any);
      const result = mapper.toApi(nutrient);

      expect(result.name).toBe('Vitamin D');
      expect(result.slug).toBe('vitamin-d');
      expect(result.description).toBe('Essential vitamin.');
      expect(result.is_label_standard).toBeTrue();
      expect(result.display_order).toBe(5);
      expect(result.iu_to_canonical_factor).toBe(0.025);
    });

    it('does not include source_id or external_id', () => {
      const nutrient = mapper.toApp(fullResource as any);
      const result = mapper.toApi(nutrient) as Record<string, unknown>;

      expect('source_id' in result).toBeFalse();
      expect('external_id' in result).toBeFalse();
    });
  });

  describe('make', () => {
    it('returns a nutrient with an empty sourceMappings array', () => {
      const result = mapper.make();

      expect(result.sourceMappings).toEqual([]);
    });

    it('does not include an externalId field', () => {
      const result = mapper.make() as Record<string, unknown>;

      expect('externalId' in result).toBeFalse();
    });
  });
});
