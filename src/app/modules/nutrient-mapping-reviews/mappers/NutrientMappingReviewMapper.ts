import { NutrientMappingReview } from '../contracts/NutrientMappingReview';
import { NutrientMappingReviewApiResource } from '../contracts/NutrientMappingReviewApiResource';

export class NutrientMappingReviewMapper {
  toApp(api: NutrientMappingReviewApiResource): NutrientMappingReview {
    return {
      id: api.id!,
      status: (api.status ?? 'pending') as NutrientMappingReview['status'],
      confidence: api.confidence ?? null,
      decisionType: api.decision_type ?? null,
      reasoning: api.reasoning ?? null,
      resolvedAt: api.resolved_at ? new Date(api.resolved_at) : null,
      nutrient: api.nutrient ? { id: api.nutrient.id!, name: api.nutrient.name! } : null,
      suggestedCanonical: api.suggested_canonical
        ? { id: api.suggested_canonical.id!, name: api.suggested_canonical.name! }
        : null,
    };
  }
}
