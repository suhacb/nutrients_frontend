import { NutrientMappingReviewMapper } from './NutrientMappingReviewMapper';
import { NutrientMappingReviewApiResource } from '../contracts/NutrientMappingReviewApiResource';

describe('NutrientMappingReviewMapper', () => {
  let mapper: NutrientMappingReviewMapper;

  const fullResource: NutrientMappingReviewApiResource = {
    id: 1,
    status: 'pending',
    confidence: 82,
    decision_type: 'merge',
    reasoning: 'High similarity score.',
    resolved_at: null,
    nutrient: { id: 10, name: 'Vitamin D' },
    suggested_canonical: { id: 20, name: 'Vitamin D3' },
  };

  beforeEach(() => {
    mapper = new NutrientMappingReviewMapper();
  });

  it('maps all fields from a full API resource', () => {
    const result = mapper.toApp(fullResource);

    expect(result.id).toBe(1);
    expect(result.status).toBe('pending');
    expect(result.confidence).toBe(82);
    expect(result.decisionType).toBe('merge');
    expect(result.reasoning).toBe('High similarity score.');
    expect(result.resolvedAt).toBeNull();
    expect(result.nutrient).toEqual({ id: 10, name: 'Vitamin D' });
    expect(result.suggestedCanonical).toEqual({ id: 20, name: 'Vitamin D3' });
  });

  it('parses resolved_at as a Date when present', () => {
    const resource: NutrientMappingReviewApiResource = {
      ...fullResource,
      resolved_at: '2025-01-15T12:00:00Z',
    };

    const result = mapper.toApp(resource);

    expect(result.resolvedAt).toBeInstanceOf(Date);
    expect(result.resolvedAt!.getFullYear()).toBe(2025);
  });

  it('sets nutrient to null when API returns null', () => {
    const resource: NutrientMappingReviewApiResource = { ...fullResource, nutrient: null };
    expect(mapper.toApp(resource).nutrient).toBeNull();
  });

  it('sets suggestedCanonical to null when API returns null', () => {
    const resource: NutrientMappingReviewApiResource = { ...fullResource, suggested_canonical: null };
    expect(mapper.toApp(resource).suggestedCanonical).toBeNull();
  });

  it('casts status to the union type', () => {
    const approved: NutrientMappingReviewApiResource = { ...fullResource, status: 'approved' };
    expect(mapper.toApp(approved).status).toBe('approved');
  });
});
