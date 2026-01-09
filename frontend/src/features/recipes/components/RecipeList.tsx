import type { Ingredient, Recipe, RecipeItem } from '../../../types';
import { RecipeListItem } from './RecipeListItem';
import styles from './RecipeList.module.css';

interface RecipeListProps {
  items: Recipe[];
  ingredients: Ingredient[];
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string, newItems: RecipeItem[]) => void;
}

export function RecipeList({ items, ingredients, onDelete, onEdit }: RecipeListProps) {
  const sortedRecipes = [...items].sort((a, b) => a.name.localeCompare(b.name));



  return (
    <section className={styles.section}>
      <h4 id="saved-recipes-heading">Saved Recipes</h4>
      
      {sortedRecipes.length === 0 ? (
        <p className={styles.empty}>No recipes available.</p>
      ) : (
        <ul className={styles.list}>
          {sortedRecipes.map(recipe => {
            return (
              <RecipeListItem
                key={recipe.id}
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
