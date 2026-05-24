export type NutrientMappingReview = {
  id: number;
  status: 'pending' | 'approved' | 'rejected';
  confidence: number | null;
  decisionType: string | null;
  reasoning: string | null;
  resolvedAt: Date | null;
  nutrient: { id: number; name: string } | null;
  suggestedCanonical: { id: number; name: string } | null;
};
