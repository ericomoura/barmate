import { useState } from 'react';
import type { Ingredient, Recipe, RecipeItem } from '../../../types';
import styles from './RecipeList.module.css';
import { RecipeListItem } from './RecipeListItem';

interface RecipeListProps {
  items: Recipe[];
  ingredients: Ingredient[];
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string, newItems: RecipeItem[]) => void;
}

export function RecipeList({ items, ingredients, onDelete, onEdit }: RecipeListProps) {
  function sortRecipes(recipes: Recipe[], criteria: string, ascending: boolean): Recipe[]{
    var sorted: Recipe[] = recipes;

    if (criteria === 'name') {
      sorted = [...recipes].sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === 'ingredients') {
      sorted = [...recipes].sort((a, b) => a.items.length - b.items.length);
    }

    return ascending ? sorted : sorted.reverse();
  }


  const [sortCriteria, setSortCriteria] = useState<string>('name');
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const sortedRecipes = sortRecipes(items, sortCriteria, sortAscending);
  
  

  return (
    <section className={styles.section}>
      <h4 id="saved-recipes-heading">Saved Recipes</h4>
      <div className={styles.sortMenu}>
          <label>Sort by:</label>
          <select
            value={sortCriteria}
            onChange={e => setSortCriteria(e.target.value)}>
              <option value="name">Name</option>
              <option value="ingredients">Ingredients</option>
          </select>
          <button onClick={() => setSortAscending(!sortAscending)}>{sortAscending ? '↑' : '↓'}</button>
      </div>
      
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
