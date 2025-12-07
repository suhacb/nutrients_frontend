export type IngredientApiPaylod = {
    external_id: string | null,
    source: string | null,
    class: string,
    name: string,
    description: string | null,
    default_amount: number,
    default_amount_unit_id: number
}