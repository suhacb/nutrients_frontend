import { ResourceMapper } from "../../../core/ResourceMapper/ResourceMapper";
import { NutritionFact } from "../contracts/NutritionFact";
import { NutritionFactApiPayload } from "../contracts/NutritionFactApiPayload";
import { NutritionFactApiResource } from "../contracts/NutritionFactApiResource";
import { UnitsMapper } from "./UnitsMapper";

export class NutritionFactMapper extends ResourceMapper<NutritionFact, NutritionFactApiResource, NutritionFactApiPayload> {
    public toApp (api: NutritionFactApiResource): NutritionFact {
        return {
            id: api.id,
            ingredientId: api.ingredient_id,
            category: api.category,
            name: api.name,
            amount: api.amount, 
            amountUnitId: api.amount_unit_id,
            ...(api.unit !== undefined && {
                unit: new UnitsMapper().toApp(api.unit) 
            }),
            createdAt: new Date(api.created_at),
            updatedAt: new Date(api.updated_at),
        }
    }

    public toApi (app: NutritionFact): NutritionFactApiPayload {
        return {
            category: app.category,
            name: app.name,
            amount: app.amount,
            amount_unit_id: app.amountUnitId
        }
    }

    public make (): NutritionFact {
        return {
            id: 0,
            ingredientId: 0,
            category: '',
            name: '',
            amount: 0, 
            amountUnitId: 0, 
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    }
}