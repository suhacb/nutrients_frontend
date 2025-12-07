import { ResourceMapper } from "../../../core/ResourceMapper/ResourceMapper";
import { IngredientCategory } from "../contracts/IngredientCategory";
import { IngredientCategoryApiPayload } from "../contracts/IngredientCategoryApiPayload";
import { IngredientCategoryApiResource } from "../contracts/IngredientCategoryApiResource";

export class IngredientCategoryMapper extends ResourceMapper<IngredientCategory, IngredientCategoryApiResource, IngredientCategoryApiPayload> {
    public toApp (api: IngredientCategoryApiResource): IngredientCategory {
        return {
            id: api.id,
            name: api.name,
            createdAt: new Date(api.created_at),
            updatedAt: new Date(api.updated_at),
        }
    }

    public toApi (app: IngredientCategory): IngredientCategoryApiPayload {
        return {
            name: app.name,
        }
    }

    public make (): IngredientCategory {
        return {
            id: 0,
            name: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    }
}