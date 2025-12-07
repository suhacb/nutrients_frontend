export type IngredientApiResource = {
    id: number,
    external_id: string | null,
    source: string,
    name: string,
    description: string | null,
    created_at: string,
    updated_at: string,
    deleted_at: string | null
}