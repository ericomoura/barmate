import { useState } from 'react';
import type { Ingredient, Recipe, RecipeItem, RecipeListFilters } from '../../../types';
import styles from './RecipeList.module.css';
import { RecipeListItem } from './RecipeListItem';
import utils from '../../../styles/utilities.module.css';

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
  function filterRecipes(recipes: Recipe[], filters: RecipeListFilters): Recipe[] {
    let filtered = recipes
    .filter(recipe => {
      if (filters.inStock) {
        return recipe.items.every(item => {
          const ingredient = ingredients.find(ing => ing.id === item.ingredientId);
          return ingredient ? ingredient.amount >= item.amount : false;
        })
      }
      return true;
    })

    return filtered;
  }


  const [sortCriteria, setSortCriteria] = useState<string>('name');
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const [filters, setFilters] = useState<RecipeListFilters>({ inStock: false });
  const filteredSortedRecipes = sortRecipes(filterRecipes(items, filters), sortCriteria, sortAscending);
  
  

  return (
    <section className={styles.section}>
      <h4>Saved Recipes</h4>
      <div className={styles.filterSortRow}>
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

        <div className={utils.vDivider} />

        <div>
          <label>Filter by: </label>
          <label><input 
            type='checkbox'
            checked={filters.inStock}
            onChange={e => setFilters(prev => ({...prev, inStock: e.target.checked}))} />In stock</label>
        </div>
      </div>
      
      {filteredSortedRecipes.length === 0 ? (
        <p className={styles.empty}>No recipes available.</p>
      ) : (
        <ul className={styles.list}>
          {filteredSortedRecipes.map(recipe => {
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
