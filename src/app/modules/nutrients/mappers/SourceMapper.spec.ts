import { SourceMapper } from './SourceMapper';
import { SourceApiResource } from '../contracts/SourceApiResource';

describe('SourceMapper', () => {
  let mapper: SourceMapper;

  const fullResource: SourceApiResource = {
    id: 1,
    name: 'USDA FoodData Central',
    slug: 'usda-fooddata-central',
    url: 'https://fdc.nal.usda.gov',
    description: 'Official USDA nutrient database.',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-06-01T12:00:00Z',
  };

  beforeEach(() => {
    mapper = new SourceMapper();
  });

  describe('toApp', () => {
    it('maps all fields from a full resource', () => {
      const result = mapper.toApp(fullResource);

      expect(result.id).toBe(1);
      expect(result.name).toBe('USDA FoodData Central');
      expect(result.slug).toBe('usda-fooddata-central');
      expect(result.url).toBe('https://fdc.nal.usda.gov');
      expect(result.description).toBe('Official USDA nutrient database.');
      expect(result.createdAt).toEqual(new Date('2024-01-15T10:00:00Z'));
      expect(result.updatedAt).toEqual(new Date('2024-06-01T12:00:00Z'));
    });

    it('sets url and description to null when absent', () => {
      const result = mapper.toApp({ ...fullResource, url: undefined, description: undefined });

      expect(result.url).toBeNull();
      expect(result.description).toBeNull();
    });
  });
});
