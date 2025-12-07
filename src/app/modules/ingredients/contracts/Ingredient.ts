export type Ingredient = {
    id: number,
    externalId: string | null,
    source: string,
    class: string,
    name: string,
    description: string | null,
    defaultAmount: number,
    defaultAmountUnitId: number,
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    /*
    "default_amount_unit"
    "nutrients"
    "nutrition_facts"
    */
}