export type NutritionFact = {
    id: number,
    ingredientId: number,
    category: string,
    name: string,
    amount: number, 
    amountUnitId: number, 
    createdAt: Date,
    updatedAt: Date
}