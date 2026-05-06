import { IngredientsMapper } from './IngredientsMapper';
import { IngredientApiResource } from '../contracts/IngredientApiResource';
import { BrandApiResource } from '../contracts/BrandApiResource';
import { UnitApiResource } from '../contracts/UnitApiResource';
import { NutritionFactApiResource } from '../contracts/NutritionFactApiResource';
import { IngredientCategoryApiResource } from '../contracts/IngredientCategoryApiResource';
import { NutrientApiResource } from '../../nutrients/contracts/NutrientApiResource';

describe('IngredientsMapper', () => {
  let mapper: IngredientsMapper;

  const unitResource: UnitApiResource = {
    id: 10,
    name: 'Gram',
    abbreviation: 'g',
    type: 'mass',
    to_base_factor: 0.001,
    base_unit_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const brandResource: BrandApiResource = {
    id: 7,
    name: 'Nature Valley',
    slug: 'nature-valley',
    owner: null,
    country: null,
    description: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const categoryResource: IngredientCategoryApiResource = {
    id: 5,
    name: 'Dairy',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const nutritionFactResource: NutritionFactApiResource = {
    id: 20,
    category: 'Macronutrient',
    name: 'Total Fat',
    amount: 3.5,
    unit: unitResource,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const nutrientResource: NutrientApiResource & { pivot?: any } = {
    id: 1,
    name: 'Vitamin C',
    slug: 'vitamin-c',
    sync_status: 'synced',
    is_label_standard: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: undefined,
    deleted_at: undefined,
    pivot: {
      amount: 60,
      amount_unit: unitResource,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  };

  const fullResource: IngredientApiResource = {
    id: 100,
    name: 'Whole Milk',
    slug: 'whole-milk',
    external_id: 'MILK_WHOLE',
    source: 'USDA',
    class: 'Dairy',
    description: 'Full-fat cow milk.',
    default_amount: 250,
    sync_status: 'synced',
    brand: brandResource,
    default_amount_unit: unitResource,
    nutrients: [nutrientResource as any],
    nutrition_facts: [nutritionFactResource],
    categories: [categoryResource],
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
    deleted_at: undefined,
  };

  beforeEach(() => {
    mapper = new IngredientsMapper();
  });

  describe('toApp', () => {
    it('maps all scalar fields', () => {
      const result = mapper.toApp(fullResource);

      expect(result.id).toBe(100);
      expect(result.name).toBe('Whole Milk');
      expect(result.slug).toBe('whole-milk');
      expect(result.externalId).toBe('MILK_WHOLE');
      expect(result.source).toBe('USDA');
      expect(result.class).toBe('Dairy');
      expect(result.description).toBe('Full-fat cow milk.');
      expect(result.defaultAmount).toBe(250);
      expect(result.syncStatus).toBe('synced');
      expect(result.createdAt).toEqual(new Date('2024-03-01T00:00:00Z'));
      expect(result.updatedAt).toEqual(new Date('2024-06-01T00:00:00Z'));
      expect(result.deletedAt).toBeNull();
    });

    it('maps the nested brand relation', () => {
      const result = mapper.toApp(fullResource);

      expect(result.brand).not.toBeNull();
      expect(result.brand!.id).toBe(7);
      expect(result.brand!.name).toBe('Nature Valley');
    });

    it('maps the nested defaultAmountUnit relation', () => {
      const result = mapper.toApp(fullResource);

      expect(result.defaultAmountUnit).not.toBeNull();
      expect(result.defaultAmountUnit!.abbreviation).toBe('g');
    });

    it('maps categories array', () => {
      const result = mapper.toApp(fullResource);

      expect(result.categories).toBeDefined();
      expect(result.categories!.length).toBe(1);
      expect(result.categories![0].name).toBe('Dairy');
    });

    it('maps nutrition facts array', () => {
      const result = mapper.toApp(fullResource);

      expect(result.nutritionFacts).toBeDefined();
      expect(result.nutritionFacts!.length).toBe(1);
      expect(result.nutritionFacts![0].name).toBe('Total Fat');
    });

    it('maps nutrients array with pivot data', () => {
      const result = mapper.toApp(fullResource);

      expect(result.nutrients).toBeDefined();
      expect(result.nutrients!.length).toBe(1);

      const nutrient = result.nutrients![0];
      expect(nutrient.id).toBe(1);
      expect(nutrient.name).toBe('Vitamin C');
      expect(nutrient.pivot).toBeDefined();
      expect(nutrient.pivot!.amount).toBe(60);
      expect(nutrient.pivot!.amountUnit).not.toBeNull();
      expect(nutrient.pivot!.amountUnit!.abbreviation).toBe('g');
    });

    it('omits optional relations when not present in the API response', () => {
      const minimal: IngredientApiResource = {
        id: 99,
        name: 'Water',
        slug: 'water',
        sync_status: 'synced',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: undefined,
        deleted_at: undefined,
      };

      const result = mapper.toApp(minimal);

      expect('brand' in result).toBeFalse();
      expect('defaultAmountUnit' in result).toBeFalse();
      expect('nutrients' in result).toBeFalse();
      expect('nutritionFacts' in result).toBeFalse();
      expect('categories' in result).toBeFalse();
    });

    it('sets categories and nutrients to empty when API returns null', () => {
      const result = mapper.toApp({ ...fullResource, categories: null as any, nutrients: null as any, nutrition_facts: null as any });

      expect('categories' in result).toBeFalse();
      expect('nutrients' in result).toBeFalse();
      expect('nutritionFacts' in result).toBeFalse();
    });

    it('sets nullable scalar fields to null when absent', () => {
      const result = mapper.toApp({
        ...fullResource,
        external_id: undefined,
        source: undefined,
        class: undefined,
        description: undefined,
        default_amount: undefined,
      });

      expect(result.externalId).toBeNull();
      expect(result.source).toBeNull();
      expect(result.class).toBeNull();
      expect(result.description).toBeNull();
      expect(result.defaultAmount).toBeNull();
    });
  });
});
