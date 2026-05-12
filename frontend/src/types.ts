export interface Ingredient {
    readonly id: string;
    name: string;
    amount: number;
    category: string;
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

export type IngredientFormData = Omit<Ingredient, 'id'> & { id?: string };
export const DEFAULT_ING_DATA: IngredientFormData = { name: '', amount: 0, category: 'Other' };

export type RecipeFormData = Omit<Recipe, 'id'> & { id?: string };
export const DEFAULT_RECIPE_DATA: RecipeFormData = { name: '', items: [] };
