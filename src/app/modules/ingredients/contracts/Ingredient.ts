import { Nutrient } from "../../nutrients/contracts/Nutrient";
import { IngredientCategory } from "./IngredientCategory";
import { NutritionFact } from "./NutritionFact";
import { Unit } from "./Unit";

export type Ingredient = {
    id: number,
    externalId: string | null,
    source: string,
    class: string,
    name: string,
    description: string | null,
    defaultAmount: number,
    defaultAmountUnitId: number,
    defaultAmountUnit?: Unit,
    nutrients?: Nutrient[],
    nutritionFacts?: NutritionFact[],
    categories?: IngredientCategory[],
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}