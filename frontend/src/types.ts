export interface Ingredient {
    readonly id: string;
    name: string;
    amount: number;
}

export interface RecipeItem {
    ingredientId: string;
    amount: number;
}
export interface Recipe {
    readonly id: string;
    name: string;
    items: Array<RecipeItem>;
}