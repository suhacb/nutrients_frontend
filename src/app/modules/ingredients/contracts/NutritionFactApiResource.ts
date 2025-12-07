import { UnitApiResource } from "./UnitApiResource"

export type NutritionFactApiResource = {
    id: number,
    ingredient_id: number,
    category: string,
    name: string,
    amount: number, 
    amount_unit_id: number,
    unit?: UnitApiResource,
    created_at: string,
    updated_at: string
}