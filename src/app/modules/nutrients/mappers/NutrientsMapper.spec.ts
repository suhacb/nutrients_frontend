import { NutrientsMapper } from './NutrientsMapper';
import { NutrientApiResource } from '../contracts/NutrientApiResource';
import { SourceApiResource } from '../contracts/SourceApiResource';
import { NutrientTagApiResource } from '../contracts/NutrientTagApiResource';
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

  const childResource: NutrientApiResource = {
    id: 2,
    name: 'Vitamin D3',
    slug: 'vitamin-d3',
    external_id: 'D3',
    description: null,
    sync_status: 'synced',
    is_label_standard: false,
    display_order: null,
    iu_to_canonical_factor: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: undefined,
    deleted_at: undefined,
  };

  const fullResource: NutrientApiResource = {
    id: 1,
    name: 'Vitamin D',
    slug: 'vitamin-d',
    external_id: 'VIT_D',
    description: 'Essential vitamin.',
    sync_status: 'synced',
    is_label_standard: true,
    display_order: 5,
    iu_to_canonical_factor: 0.025,
    source: sourceResource,
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
      const result = mapper.toApp(fullResource);

      expect(result.id).toBe(1);
      expect(result.name).toBe('Vitamin D');
      expect(result.slug).toBe('vitamin-d');
      expect(result.externalId).toBe('VIT_D');
      expect(result.description).toBe('Essential vitamin.');
      expect(result.syncStatus).toBe('synced');
      expect(result.isLabelStandard).toBeTrue();
      expect(result.displayOrder).toBe(5);
      expect(result.iuToCanonicalFactor).toBe(0.025);
      expect(result.createdAt).toEqual(new Date('2024-01-15T10:00:00Z'));
      expect(result.updatedAt).toEqual(new Date('2024-06-01T12:00:00Z'));
      expect(result.deletedAt).toBeNull();
    });

    it('maps the nested source relation', () => {
      const result = mapper.toApp(fullResource);

      expect(result.source).not.toBeNull();
      expect(result.source!.id).toBe(1);
      expect(result.source!.name).toBe('USDA');
    });

    it('maps the nested canonicalUnit relation', () => {
      const result = mapper.toApp(fullResource);

      expect(result.canonicalUnit).not.toBeNull();
      expect(result.canonicalUnit!.id).toBe(10);
      expect(result.canonicalUnit!.abbreviation).toBe('mg');
    });

    it('maps parent to null when explicitly null', () => {
      const result = mapper.toApp(fullResource);

      expect(result.parent).toBeNull();
    });

    it('maps children array recursively', () => {
      const result = mapper.toApp(fullResource);

      expect(result.children).toBeDefined();
      expect(result.children!.length).toBe(1);
      expect(result.children![0].id).toBe(2);
      expect(result.children![0].name).toBe('Vitamin D3');
    });

    it('maps tags array', () => {
      const result = mapper.toApp(fullResource);

      expect(result.tags).toBeDefined();
      expect(result.tags!.length).toBe(1);
      expect(result.tags![0].name).toBe('Fat-soluble');
    });

    it('omits optional relations when not present in the API response', () => {
      const minimal: NutrientApiResource = {
        id: 99,
        name: 'Iron',
        slug: 'iron',
        sync_status: 'synced',
        is_label_standard: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: undefined,
        deleted_at: undefined,
      };

      const result = mapper.toApp(minimal);

      expect('source' in result).toBeFalse();
      expect('canonicalUnit' in result).toBeFalse();
      expect('parent' in result).toBeFalse();
      expect('children' in result).toBeFalse();
      expect('tags' in result).toBeFalse();
    });

    it('sets source to null when API returns null (relation loaded but empty)', () => {
      const result = mapper.toApp({ ...fullResource, source: null });

      expect('source' in result).toBeTrue();
      expect(result.source).toBeNull();
    });

    it('sets externalId, description, displayOrder, iuToCanonicalFactor to null when absent', () => {
      const result = mapper.toApp({
        ...fullResource,
        external_id: undefined,
        description: undefined,
        display_order: undefined,
        iu_to_canonical_factor: undefined,
      });

      expect(result.externalId).toBeNull();
      expect(result.description).toBeNull();
      expect(result.displayOrder).toBeNull();
      expect(result.iuToCanonicalFactor).toBeNull();
    });
  });
});
