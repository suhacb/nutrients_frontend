import { Unit } from "./Unit"

export type NutritionFact = {
    id: number,
    ingredientId: number,
    category: string,
    name: string,
    amount: number, 
    amountUnitId: number,
    unit?: Unit,
    createdAt: Date,
    updatedAt: Date
}