import { NutrientApiResource } from "../../nutrients/contracts/NutrientApiResource"

export type IngredientApiResource = {
    id: number,
    external_id: string | null,
    source: string,
    class: string,
    name: string,
    description: string | null,
    default_amount: number,
    default_amount_unit_id: number,
    default_amount_unit: any,
    nutrients: NutrientApiResource[],
    created_at: string,
    updated_at: string,
    deleted_at: string | null
    /*
    "nutrition_facts"
    */
}