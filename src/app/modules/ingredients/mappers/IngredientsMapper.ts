import { ResourceMapper } from "../../../core/ResourceMapper/ResourceMapper";
import { Ingredient } from "../contracts/Ingredient";
import { IngredientApiPaylod } from "../contracts/IngredientApiPayload";
import { IngredientApiResource } from "../contracts/IngredientApiResource";

export class IngredientsMapper extends ResourceMapper<Ingredient, IngredientApiResource, IngredientApiPaylod> {
    public toApp (api: IngredientApiResource): Ingredient {
        return {
            id: api.id,
            source: api.source,
            externalId: api.external_id,
            name: api.name,
            description: api.description,
            createdAt: new Date(api.created_at),
            updatedAt: new Date(api.updated_at),
            deletedAt: api.deleted_at ? new Date(api.deleted_at) : null
        }
    }

    public toApi (app: Ingredient): IngredientApiPaylod {
        return {
            source: app.source,
            external_id: app.externalId,
            name: app.name,
            description: app.description
        }
    }

    public make (): Ingredient {
        return {
            id: 0,
            externalId: null,
            source: '',
            name: '',
            description: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        }
    }
}