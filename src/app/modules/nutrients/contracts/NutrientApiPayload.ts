export type NutrientApiPayload = {
  name: string;
  description?: string | null;
  parent_id?: number | null;
  slug?: string | null;
  canonical_unit_id?: number | null;
  iu_to_canonical_factor?: number | null;
  is_label_standard?: boolean;
  display_order?: number | null;
};
