export type NutrientApiResource = {
    id: number,
    source: string,
    external_id: string | null,
    name: string,
    description: string | null,
    derivation_code: string | null,
    derivation_description: string | null,
    created_at: string,
    updated_at: string | null,
    deleted_at: string | null,
}