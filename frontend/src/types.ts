export interface Ingredient {
    readonly id: string;
    name: string;
    amount: number;
    category?: string;
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

export interface RecipeListFilters {
    inStockSpirit: boolean;
    inStockMixer: boolean;
    inStockFruit: boolean;
    inStockOther: boolean;
}