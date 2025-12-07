import { NutrientApiResource } from "../../nutrients/contracts/NutrientApiResource"
import { IngredientCategoryApiResource } from "./IngredientCategoryApiResource"
import { NutritionFactApiResource } from "./NutritionFactApiResource"
import { UnitApiResource } from "./UnitApiResource"

export type IngredientApiResource = {
    id: number,
    external_id: string | null,
    source: string,
    class: string,
    name: string,
    description: string | null,
    default_amount: number,
    default_amount_unit_id: number,
    default_amount_unit?: UnitApiResource,
    nutrients?: NutrientApiResource[],
    nutrition_facts?: NutritionFactApiResource[],
    categories?: IngredientCategoryApiResource[],
    created_at: string,
    updated_at: string,
    deleted_at: string | null
}