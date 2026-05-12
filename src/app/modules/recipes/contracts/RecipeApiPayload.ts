export interface RecipeApiPayload {
  name: string;
  description?: string | null;
  instructions?: string | null;
  portions: number;
  source_url?: string | null;
}
