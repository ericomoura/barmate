import type { Ingredient, Recipe } from '../types';

export const KEYS = {
  ingredients: 'barmate.ingredients',
  recipes: 'barmate.recipes',
} as const;

export function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`localStorage persist failed for key=${key}`, e);
  }
}

export function loadIngredients(): Ingredient[] {
  return read<Ingredient[]>(KEYS.ingredients, []);
}
export function saveIngredients(list: Ingredient[]): void {
  write(KEYS.ingredients, list);
}

export function loadRecipes(): Recipe[] {
  return read<Recipe[]>(KEYS.recipes, []);
}
export function saveRecipes(list: Recipe[]): void {
  write(KEYS.recipes, list);
}