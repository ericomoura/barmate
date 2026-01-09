import { useState } from 'react';
import type { Ingredient, RecipeItem } from '../../../types';
import styles from './RecipeForm.module.css';

interface RecipeFormProps {
  ingredients: Ingredient[];
  onAdd: (newRecipe: { name: string; items: RecipeItem[] }) => void;
}

export function RecipeForm({ ingredients, onAdd }: RecipeFormProps) {
  const [name, setName] = useState<string>('');
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = name.trim();
    const selectedIds = Object.keys(selected).filter(id => selected[id]);

    if (!trimmed || selectedIds.length === 0) {
      return;
    }

    const items: RecipeItem[] = selectedIds.map(ingredientId => ({ ingredientId }));

    onAdd({ name: trimmed, items });

    setName('');
    setSelected({});
  }

  const canSubmit = name.trim().length > 0 && Object.values(selected).some(Boolean);

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.rowCenter}>
        <label>New recipe name:</label>
        <input
          id="recipe-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type="submit" disabled={!canSubmit}>Add</button>
      </div>

      <fieldset className={styles.fieldset}>
        <legend>Select ingredients</legend>
        <ul className={styles.chips}>
          {ingredients.map(ing => (
            <li key={ing.id} className={styles.chipItem}>
              <label>
                <input
                  type="checkbox"
                  checked={!!selected[ing.id]}
                  onChange={() => toggle(ing.id)}
                />
                {ing.name}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
    </form>
  );
}
