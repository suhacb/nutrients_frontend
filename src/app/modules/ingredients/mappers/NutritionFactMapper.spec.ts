import { NutritionFactMapper } from './NutritionFactMapper';
import { NutritionFactApiResource } from '../contracts/NutritionFactApiResource';
import { UnitApiResource } from '../contracts/UnitApiResource';

describe('NutritionFactMapper', () => {
  let mapper: NutritionFactMapper;

  const unitResource: UnitApiResource = {
    id: 10,
    name: 'Gram',
    abbreviation: 'g',
    type: 'mass',
    to_base_factor: 0.001,
    base_unit_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  };

  const fullResource: NutritionFactApiResource = {
    id: 20,
    category: 'Macronutrient',
    name: 'Total Fat',
    amount: 3.5,
    unit: unitResource,
    created_at: '2024-05-01T00:00:00Z',
    updated_at: '2024-05-02T00:00:00Z',
  };

  beforeEach(() => {
    mapper = new NutritionFactMapper();
  });

  describe('toApp', () => {
    it('maps all fields including the nested unit', () => {
      const result = mapper.toApp(fullResource);

      expect(result.id).toBe(20);
      expect(result.category).toBe('Macronutrient');
      expect(result.name).toBe('Total Fat');
      expect(result.amount).toBe(3.5);
      expect(result.unit).not.toBeNull();
      expect(result.unit!.id).toBe(10);
      expect(result.unit!.abbreviation).toBe('g');
      expect(result.createdAt).toEqual(new Date('2024-05-01T00:00:00Z'));
      expect(result.updatedAt).toEqual(new Date('2024-05-02T00:00:00Z'));
    });

    it('sets unit to null when absent', () => {
      const result = mapper.toApp({ ...fullResource, unit: undefined });

      expect(result.unit).toBeNull();
    });

    it('sets amount and category to null when absent', () => {
      const result = mapper.toApp({ ...fullResource, amount: undefined, category: undefined });

      expect(result.amount).toBeNull();
      expect(result.category).toBeNull();
    });
  });
});
