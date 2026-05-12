import { RecipesMapper } from './RecipesMapper';
import { RecipeApiResource } from '../contracts/RecipeApiResource';
import { DietTagApiResource } from '../contracts/DietTagApiResource';
import { UnitApiResource } from '../../ingredients/contracts/UnitApiResource';

describe('RecipesMapper', () => {
  let mapper: RecipesMapper;

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

  const dietTagResource: DietTagApiResource = {
    id: 3,
    name: 'Ketogenic',
    slug: 'ketogenic',
    description: 'High fat diet.',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const ingredientWithPivot = {
    id: 7,
    name: 'Chicken breast',
    slug: 'chicken-breast',
    sync_status: 'synced' as const,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    pivot: {
      recipe_id: 1,
      ingredient_id: 7,
      amount: 200,
      unit_id: 10,
      unit: unitResource,
    },
  };

  const fullResource: RecipeApiResource = {
    id: 1,
    name: 'Pasta Bolognese',
    slug: 'pasta-bolognese',
    description: 'A classic Italian dish.',
    instructions: '## Method\n1. Cook pasta.',
    portions: 4,
    source_url: 'https://example.com/pasta',
    sync_status: 'synced',
    diet_tags: [dietTagResource],
    ingredients: [ingredientWithPivot],
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
    deleted_at: null,
  };

  beforeEach(() => {
    mapper = new RecipesMapper();
  });

  describe('toApp', () => {
    it('maps all scalar fields', () => {
      const result = mapper.toApp(fullResource);

      expect(result.id).toBe(1);
      expect(result.name).toBe('Pasta Bolognese');
      expect(result.slug).toBe('pasta-bolognese');
      expect(result.description).toBe('A classic Italian dish.');
      expect(result.instructions).toBe('## Method\n1. Cook pasta.');
      expect(result.portions).toBe(4);
      expect(result.sourceUrl).toBe('https://example.com/pasta');
      expect(result.syncStatus).toBe('synced');
    });

    it('maps diet_tags array', () => {
      const result = mapper.toApp(fullResource);

      expect(result.dietTags.length).toBe(1);
      expect(result.dietTags[0].id).toBe(3);
      expect(result.dietTags[0].name).toBe('Ketogenic');
      expect(result.dietTags[0].slug).toBe('ketogenic');
    });

    it('maps ingredients array with pivot data', () => {
      const result = mapper.toApp(fullResource);

      expect(result.ingredients.length).toBe(1);

      const ing = result.ingredients[0];
      expect(ing.id).toBe(7);
      expect(ing.name).toBe('Chicken breast');
      expect(ing.amount).toBe(200);
      expect(ing.unitId).toBe(10);
      expect(ing.unitAbbreviation).toBe('g');
      expect(ing.unitName).toBe('Gram');
    });

    it('maps description and instructions to null when absent', () => {
      const result = mapper.toApp({
        ...fullResource,
        description: null,
        instructions: null,
      });

      expect(result.description).toBeNull();
      expect(result.instructions).toBeNull();
    });

    it('maps source_url to null when absent', () => {
      const result = mapper.toApp({ ...fullResource, source_url: null });

      expect(result.sourceUrl).toBeNull();
    });

    it('maps empty diet_tags to an empty array', () => {
      const result = mapper.toApp({ ...fullResource, diet_tags: [] });

      expect(result.dietTags).toEqual([]);
    });

    it('maps empty ingredients to an empty array', () => {
      const result = mapper.toApp({ ...fullResource, ingredients: [] });

      expect(result.ingredients).toEqual([]);
    });

    it('handles ingredient pivot with no unit loaded', () => {
      const ingredientNoUnit = {
        ...ingredientWithPivot,
        pivot: { ...ingredientWithPivot.pivot, unit: null },
      };

      const result = mapper.toApp({ ...fullResource, ingredients: [ingredientNoUnit] });

      expect(result.ingredients[0].unitName).toBe('');
      expect(result.ingredients[0].unitAbbreviation).toBe('');
    });
  });

  describe('make', () => {
    it('returns a default empty recipe', () => {
      const result = mapper.make();

      expect(result.id).toBe(0);
      expect(result.name).toBe('');
      expect(result.dietTags).toEqual([]);
      expect(result.ingredients).toEqual([]);
      expect(result.portions).toBe(1);
    });
  });
});
