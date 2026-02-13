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
    } else if (criteria === 'random') {
      sorted = [...recipes].sort(() => Math.random() - 0.5);
    }

    return ascending ? sorted : sorted.reverse();
  }
  function filterRecipes(recipes: Recipe[], filters: RecipeListFilters): Recipe[] {
    let filtered = recipes.filter(recipe => {
      return recipe.items.every(item => {
        const ingredient = ingredients.find(ing => ing.id === item.ingredientId);

        if (!ingredient) 
          return false;

        if (filters.inStockSpirit && ingredient.category === 'Spirit')
          return ingredient.amount >= item.amount;
        if (filters.inStockMixer && ingredient.category === 'Mixer')
          return ingredient.amount >= item.amount;
        if (filters.inStockFruit && ingredient.category === 'Fruit')
          return ingredient.amount >= item.amount;
        if (filters.inStockOther && ingredient.category === 'Other')
          return ingredient.amount >= item.amount;

        return true;
      });
    });

    return filtered;
  }


  const [sortCriteria, setSortCriteria] = useState<string>('name');
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const [filters, setFilters] = useState<RecipeListFilters>({ inStockSpirit: false, inStockMixer: false, inStockFruit: false, inStockOther: false });
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
                <option value="random">Random</option>
            </select>
            <button onClick={() => setSortAscending(!sortAscending)}>{sortAscending ? '↑' : '↓'}</button>
        </div>

        <div className={utils.vDivider} />

        <div>
          <label>In stock: </label>
          <label><input 
            type='checkbox'
            checked={filters.inStockSpirit}
            onChange={e => setFilters(prev => ({...prev, inStockSpirit: e.target.checked}))} />Spirit </label>
          <label><input 
            type='checkbox'
            checked={filters.inStockMixer}
            onChange={e => setFilters(prev => ({...prev, inStockMixer: e.target.checked}))} />Mixer </label>
          <label><input
            type='checkbox'
            checked={filters.inStockFruit}
            onChange={e => setFilters(prev => ({...prev, inStockFruit: e.target.checked}))} />Fruit </label>
          <label><input 
            type='checkbox'
            checked={filters.inStockOther}
            onChange={e => setFilters(prev => ({...prev, inStockOther: e.target.checked}))} />Other </label>
        </div>
      </div>
      
      {filteredSortedRecipes.length === 0 ? (
        <p className={styles.empty}>No recipes available.</p>
      ) : (<>
        <label className={styles.empty}> Displaying {filteredSortedRecipes.length} recipes</label>
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
      </>)}
    </section>
  );
}
