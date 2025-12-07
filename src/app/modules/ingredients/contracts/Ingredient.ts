export type Ingredient = {
    id: number,
    source: string,
    externalId: string | null,
    name: string,
    description: string | null,
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}