export interface Ingredient {
    readonly id: string;
    name: string;
}

export interface RecipeItem {
        ingredientId: string;
        amount?: string;
}
export interface Recipe {
    readonly id: string;
    name: string;
    items: Array<RecipeItem>;
}