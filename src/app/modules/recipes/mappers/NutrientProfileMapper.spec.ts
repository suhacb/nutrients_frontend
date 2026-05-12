import { NutrientProfileMapper } from './NutrientProfileMapper';
import { NutrientProfileApiResource } from '../contracts/NutrientProfileApiResource';

describe('NutrientProfileMapper', () => {
  let mapper: NutrientProfileMapper;

  const fullResource: NutrientProfileApiResource = {
    portions: 4,
    total: [
      { nutrient_id: 1, nutrient_name: 'Protein', amount: 80.0, unit_id: 10, unit: 'g' },
      { nutrient_id: 2, nutrient_name: 'Fat',     amount: 32.4, unit_id: 10, unit: 'g' },
    ],
    per_portion: [
      { nutrient_id: 1, nutrient_name: 'Protein', amount: 20.0, unit_id: 10, unit: 'g' },
      { nutrient_id: 2, nutrient_name: 'Fat',     amount: 8.1,  unit_id: 10, unit: 'g' },
    ],
  };

  beforeEach(() => {
    mapper = new NutrientProfileMapper();
  });

  describe('toApp', () => {
    it('maps portions', () => {
      const result = mapper.toApp(fullResource);

      expect(result.portions).toBe(4);
    });

    it('maps total rows', () => {
      const result = mapper.toApp(fullResource);

      expect(result.total.length).toBe(2);
      expect(result.total[0].nutrientId).toBe(1);
      expect(result.total[0].nutrientName).toBe('Protein');
      expect(result.total[0].amount).toBe(80.0);
      expect(result.total[0].unitId).toBe(10);
      expect(result.total[0].unit).toBe('g');
    });

    it('maps per_portion rows', () => {
      const result = mapper.toApp(fullResource);

      expect(result.perPortion.length).toBe(2);
      expect(result.perPortion[0].nutrientId).toBe(1);
      expect(result.perPortion[0].amount).toBe(20.0);
    });

    it('maps empty total and per_portion to empty arrays', () => {
      const result = mapper.toApp({ portions: 2, total: [], per_portion: [] });

      expect(result.total).toEqual([]);
      expect(result.perPortion).toEqual([]);
    });
  });
});
