import type { Ingredient, Recipe, RecipeItem } from '../types';
import { RecipeListItem } from './RecipeListItem';

interface RecipeListProps {
  items: Recipe[];
  ingredients: Ingredient[];
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string, newItems: RecipeItem[]) => void;
}

export function RecipeList({ items, ingredients, onDelete, onEdit }: RecipeListProps) {
  const sortedRecipes = [...items].sort((a, b) => a.name.localeCompare(b.name));



  return (
    <section style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h4 id="saved-recipes-heading">Saved Recipes</h4>
      
      {sortedRecipes.length === 0 ? (
        <p style={{ color: '#888' }}>No recipes available.</p>
      ) : (
        <ul style={{listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 8}}>
          {sortedRecipes.map(recipe => {
            return (
              <RecipeListItem
                recipe={recipe}
                ingredients={ingredients}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            );
          })}
        </ul>
      )}
    </section>
  );
}
