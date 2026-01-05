import { useMemo } from 'react';
import type { Ingredient, Recipe } from '../types';

interface RecipeListProps {
    items: Recipe[];
    ingredients: Ingredient[];
}

export function RecipeList({ items, ingredients }: RecipeListProps) {
    const sortedRecipes = [...items].sort((a, b) => a.name.localeCompare(b.name));

    // Map ingredientId -> Ingredient
    const ingredientById = useMemo(
        () => new Map(ingredients.map(i => [i.id, i])),
        [ingredients]
    );

    return (
        <section>
            <h2 id="recipes-heading">Recipes</h2>

            {sortedRecipes.length === 0 ? (
                <p style={{ color: '#888' }}>No recipes available.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {sortedRecipes.map(recipe => (
                        <li key={recipe.id} style={{ padding: '8px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontWeight: 600 }}>{recipe.name}</span>
                                <span style={{ color: '#888' }}>({recipe.items.length} item{recipe.items.length === 1 ? '' : 's'})</span>
                            </div>

                            {
                                <ul style={{ listStyle: 'disc', paddingLeft: 20, marginTop: 6 }}>
                                    {recipe.items.map((item) => {
                                        const ing = ingredientById.get(item.ingredientId);
                                        return (
                                            <li key={`${recipe.id}-${item.ingredientId}`}>
                                                <span>{ing?.name}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            }
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
