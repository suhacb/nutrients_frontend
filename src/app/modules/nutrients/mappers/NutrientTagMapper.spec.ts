import { NutrientTagMapper } from './NutrientTagMapper';
import { NutrientTagApiResource } from '../contracts/NutrientTagApiResource';

describe('NutrientTagMapper', () => {
  let mapper: NutrientTagMapper;

  const fullResource: NutrientTagApiResource = {
    id: 3,
    name: 'Fat-soluble',
    slug: 'fat-soluble',
    description: 'Vitamins that dissolve in fats.',
    created_at: '2024-02-10T08:00:00Z',
    updated_at: '2024-05-20T09:00:00Z',
  };

  beforeEach(() => {
    mapper = new NutrientTagMapper();
  });

  describe('toApp', () => {
    it('maps all fields from a full resource', () => {
      const result = mapper.toApp(fullResource);

      expect(result.id).toBe(3);
      expect(result.name).toBe('Fat-soluble');
      expect(result.slug).toBe('fat-soluble');
      expect(result.description).toBe('Vitamins that dissolve in fats.');
      expect(result.createdAt).toEqual(new Date('2024-02-10T08:00:00Z'));
      expect(result.updatedAt).toEqual(new Date('2024-05-20T09:00:00Z'));
    });

    it('sets description to null when absent', () => {
      const result = mapper.toApp({ ...fullResource, description: undefined });

      expect(result.description).toBeNull();
    });
  });
});
