import { ResourceMapper } from '../../../core/ResourceMapper/ResourceMapper';
import { Unit } from '../contracts/Unit';
import { UnitApiPayload } from '../contracts/UnitApiPayload';
import { UnitApiResource } from '../contracts/UnitApiResource';

export class UnitsMapper extends ResourceMapper<Unit, UnitApiResource, UnitApiPayload> {
  public toApp(api: UnitApiResource): Unit {
    return {
      id: api.id!,
      name: api.name!,
      abbreviation: api.abbreviation!,
      type: api.type ?? null,
      toBaseFactor: api.to_base_factor ?? null,
      baseUnitId: api.base_unit_id ?? null,
      createdAt: new Date(api.created_at!),
      updatedAt: new Date(api.updated_at!),
    };
  }

  public toApi(app: Unit): UnitApiPayload {
    return {
      name: app.name,
      abbreviation: app.abbreviation,
      type: app.type,
    };
  }

  public make(): Unit {
    return {
      id: 0,
      name: '',
      abbreviation: '',
      type: null,
      toBaseFactor: null,
      baseUnitId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
