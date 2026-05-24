export type NutrientMappingReviewResolvePayload = {
  decision: 'merge' | 'parent' | 'keep' | 'reject';
  canonical_id?: number | null;
};
