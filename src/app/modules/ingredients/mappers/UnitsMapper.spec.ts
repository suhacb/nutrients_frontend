import { UnitsMapper } from './UnitsMapper';
import { UnitApiResource } from '../contracts/UnitApiResource';

describe('UnitsMapper', () => {
  let mapper: UnitsMapper;

  const fullResource: UnitApiResource = {
    id: 10,
    name: 'Gram',
    abbreviation: 'g',
    type: 'mass',
    to_base_factor: 0.001,
    base_unit_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  };

  beforeEach(() => {
    mapper = new UnitsMapper();
  });

  describe('toApp', () => {
    it('maps all fields from a full resource', () => {
      const result = mapper.toApp(fullResource);

      expect(result.id).toBe(10);
      expect(result.name).toBe('Gram');
      expect(result.abbreviation).toBe('g');
      expect(result.type).toBe('mass');
      expect(result.toBaseFactor).toBe(0.001);
      expect(result.baseUnitId).toBe(1);
      expect(result.createdAt).toEqual(new Date('2024-01-01T00:00:00Z'));
      expect(result.updatedAt).toEqual(new Date('2024-01-02T00:00:00Z'));
    });

    it('sets type and toBaseFactor to null when absent', () => {
      const result = mapper.toApp({ ...fullResource, type: undefined, to_base_factor: undefined, base_unit_id: undefined });

      expect(result.type).toBeNull();
      expect(result.toBaseFactor).toBeNull();
      expect(result.baseUnitId).toBeNull();
    });
  });
});
