import { ResourceMapper } from "../../../core/ResourceMapper/ResourceMapper";
import { NutrientsMapper } from "../../nutrients/mappers/NutrientsMapper";
import { Ingredient } from "../contracts/Ingredient";
import { IngredientApiPaylod } from "../contracts/IngredientApiPayload";
import { IngredientApiResource } from "../contracts/IngredientApiResource";
import { IngredientCategoryMapper } from "./IngredientCategoryMapper";
import { NutritionFactMapper } from "./NutritionFactMapper";
import { UnitsMapper } from "./UnitsMapper";

export class IngredientsMapper extends ResourceMapper<Ingredient, IngredientApiResource, IngredientApiPaylod> {
    public toApp (api: IngredientApiResource): Ingredient {
        return {
            id: api.id,
            externalId: api.external_id,
            source: api.source,
            class: api.class,
            name: api.name,
            description: api.description,
            defaultAmount: api.default_amount,
            defaultAmountUnit: new UnitsMapper().toApp(api.default_amount_unit),
            defaultAmountUnitId: api.default_amount_unit_id,
            nutrients: api.nutrients.map(nutrient => new NutrientsMapper().toApp(nutrient)),
            nutritionFacts: api.nutrition_facts.map(nutrition_fact => new NutritionFactMapper().toApp(nutrition_fact)),
            categories: api.categories.map(category => new IngredientCategoryMapper().toApp(category)),
            createdAt: new Date(api.created_at),
            updatedAt: new Date(api.updated_at),
            deletedAt: api.deleted_at ? new Date(api.deleted_at) : null
        }
    }

    public toApi (app: Ingredient): IngredientApiPaylod {
        return {
            external_id: app.externalId,
            source: app.source,
            class: app.class,
            name: app.name,
            description: app.description,
            default_amount: app.defaultAmount,
            default_amount_unit_id: app.defaultAmountUnitId
        }
    }

    public make (): Ingredient {
        return {
            id: 0,
            externalId: null,
            source: '',
            class: '',
            name: '',
            description: null,
            defaultAmount: 100,
            defaultAmountUnit: new UnitsMapper().make(),
            defaultAmountUnitId: 0,
            nutrients: [],
            nutritionFacts: [],
            categories: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        }
    }
}