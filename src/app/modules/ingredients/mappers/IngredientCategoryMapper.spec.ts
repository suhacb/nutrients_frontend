import { IngredientCategoryMapper } from './IngredientCategoryMapper';
import { IngredientCategoryApiResource } from '../contracts/IngredientCategoryApiResource';

describe('IngredientCategoryMapper', () => {
  let mapper: IngredientCategoryMapper;

  const fullResource: IngredientCategoryApiResource = {
    id: 5,
    name: 'Dairy',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z',
  };

  beforeEach(() => {
    mapper = new IngredientCategoryMapper();
  });

  describe('toApp', () => {
    it('maps all fields from a full resource', () => {
      const result = mapper.toApp(fullResource);

      expect(result.id).toBe(5);
      expect(result.name).toBe('Dairy');
      expect(result.createdAt).toEqual(new Date('2024-03-01T00:00:00Z'));
      expect(result.updatedAt).toEqual(new Date('2024-03-15T00:00:00Z'));
    });
  });
});
