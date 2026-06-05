export type NutrientMappingReviewApiResource = {
  id?: number;
  status?: string;
  confidence?: number | null;
  decision_type?: string | null;
  reasoning?: string | null;
  resolved_at?: string | null;
  source_nutrient?: { id?: number; name?: string } | null;
  suggested_canonical?: { id?: number; name?: string } | null;
};
