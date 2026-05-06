export type IngredientApiPayload = {
  source: string;
  name: string;
  external_id?: string | null;
  class?: string | null;
  slug?: string | null;
  description?: string | null;
  default_amount: number;
  default_amount_unit_id: number;
  brand_id?: number | null;
};
