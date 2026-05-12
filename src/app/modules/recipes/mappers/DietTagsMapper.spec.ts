import { DietTagsMapper } from './DietTagsMapper';
import { DietTagApiResource } from '../contracts/DietTagApiResource';

describe('DietTagsMapper', () => {
  let mapper: DietTagsMapper;

  const fullResource: DietTagApiResource = {
    id: 1,
    name: 'Ketogenic',
    slug: 'ketogenic',
    description: 'High fat, very low carbohydrate diet.',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
  };

  beforeEach(() => {
    mapper = new DietTagsMapper();
  });

  describe('toApp', () => {
    it('maps all scalar fields', () => {
      const result = mapper.toApp(fullResource);

      expect(result.id).toBe(1);
      expect(result.name).toBe('Ketogenic');
      expect(result.slug).toBe('ketogenic');
      expect(result.description).toBe('High fat, very low carbohydrate diet.');
      expect(result.createdAt).toEqual(new Date('2024-03-01T00:00:00Z'));
      expect(result.updatedAt).toEqual(new Date('2024-06-01T00:00:00Z'));
    });

    it('maps description to null when absent', () => {
      const result = mapper.toApp({ ...fullResource, description: null });

      expect(result.description).toBeNull();
    });

    it('maps description to null when undefined', () => {
      const result = mapper.toApp({ ...fullResource, description: undefined });

      expect(result.description).toBeNull();
    });
  });
});
