import { Nutrient } from "../../nutrients/contracts/Nutrient";
import { Unit } from "./Unit";

export type Ingredient = {
    id: number,
    externalId: string | null,
    source: string,
    class: string,
    name: string,
    description: string | null,
    defaultAmount: number,
    defaultAmountUnit: Unit,
    defaultAmountUnitId: number,
    nutrients: Nutrient[],
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    /*
    "nutrition_facts"
    */
}