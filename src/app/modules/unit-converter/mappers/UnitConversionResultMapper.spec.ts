import { UnitConversionResultMapper } from './UnitConversionResultMapper';
import { UnitConversionResultApiResource } from '../contracts/UnitConversionResultApiResource';

describe('UnitConversionResultMapper', () => {
  let mapper: UnitConversionResultMapper;

  const unitResource = (id: number, name: string, abbr: string) => ({
    id,
    name,
    abbreviation: abbr,
    type: 'mass',
    to_base_factor: 1,
    base_unit_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  });

  const fullResource: UnitConversionResultApiResource = {
    value: 3.5274,
    from_unit: unitResource(1, 'Gram', 'g'),
    to_unit: unitResource(2, 'Ounce', 'oz'),
    nutrient_id: null,
  };

  beforeEach(() => {
    mapper = new UnitConversionResultMapper();
  });

  it('maps value from the API resource', () => {
    expect(mapper.toApp(fullResource).value).toBe(3.5274);
  });

  it('maps fromUnit', () => {
    const result = mapper.toApp(fullResource);
    expect(result.fromUnit.id).toBe(1);
    expect(result.fromUnit.name).toBe('Gram');
    expect(result.fromUnit.abbreviation).toBe('g');
  });

  it('maps toUnit', () => {
    const result = mapper.toApp(fullResource);
    expect(result.toUnit.id).toBe(2);
    expect(result.toUnit.abbreviation).toBe('oz');
  });

  it('maps nutrientId to null when absent', () => {
    expect(mapper.toApp(fullResource).nutrientId).toBeNull();
  });

  it('maps nutrientId when present', () => {
    const resource: UnitConversionResultApiResource = { ...fullResource, nutrient_id: 42 };
    expect(mapper.toApp(resource).nutrientId).toBe(42);
  });
});
