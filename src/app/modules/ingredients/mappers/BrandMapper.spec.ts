import { BrandMapper } from './BrandMapper';
import { BrandApiResource } from '../contracts/BrandApiResource';

describe('BrandMapper', () => {
  let mapper: BrandMapper;

  const fullResource: BrandApiResource = {
    id: 7,
    name: 'Nature Valley',
    slug: 'nature-valley',
    owner: 'General Mills',
    country: 'US',
    description: 'Granola bar brand.',
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2024-04-10T00:00:00Z',
  };

  beforeEach(() => {
    mapper = new BrandMapper();
  });

  describe('toApp', () => {
    it('maps all fields from a full resource', () => {
      const result = mapper.toApp(fullResource);

      expect(result.id).toBe(7);
      expect(result.name).toBe('Nature Valley');
      expect(result.slug).toBe('nature-valley');
      expect(result.owner).toBe('General Mills');
      expect(result.country).toBe('US');
      expect(result.description).toBe('Granola bar brand.');
      expect(result.createdAt).toEqual(new Date('2024-04-01T00:00:00Z'));
      expect(result.updatedAt).toEqual(new Date('2024-04-10T00:00:00Z'));
    });

    it('sets owner, country and description to null when absent', () => {
      const result = mapper.toApp({ ...fullResource, owner: undefined, country: undefined, description: undefined });

      expect(result.owner).toBeNull();
      expect(result.country).toBeNull();
      expect(result.description).toBeNull();
    });
  });
});
