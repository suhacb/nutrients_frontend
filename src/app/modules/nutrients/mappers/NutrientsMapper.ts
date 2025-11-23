import { ResourceMapper } from "../../../core/ResourceMapper/ResourceMapper";
import { Nutrient } from "../contracts/Nutrient";
import { NutrientApiPayload } from "../contracts/NutrientApiPayload";
import { NutrientApiResource } from "../contracts/NutrientApiResource";

export class NutrientsMapper extends ResourceMapper<Nutrient, NutrientApiResource, NutrientApiPayload> {
    public toApp(api: NutrientApiResource): Nutrient {
        return {
            id: api.id,
            source: api.source,
            externalId: api.external_id ?? null,
            name: api.name,
            description: api.description ?? null,
            derivationCode: api.derivation_code ?? null,
            derivationDescription: api.derivation_description ?? null,
            createdAt: new Date(api.created_at),
            updatedAt: api.updated_at ? new Date(api.updated_at) : null,
            deletedAt: api.deleted_at ? new Date(api.deleted_at) : null,
        }
    }

    public toApi(app: Nutrient): NutrientApiPayload {
        return {
            source: app.source,
            external_id: app.externalId,
            name: app.name,
            description: app.description,
            derivation_code: app.derivationCode,
            derivation_description: app.derivationDescription,
        }
    }

    public make(): Nutrient {
        return {
            id: 0,
            source: '',
            externalId: null,
            name: '',
            description: null,
            derivationCode: null,
            derivationDescription: null,
            createdAt: new Date(),
            updatedAt: null,
            deletedAt: null,
        }
    }
}