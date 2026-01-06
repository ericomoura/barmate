import { useState } from 'react';
import type { Ingredient, RecipeItem } from '../types';

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label>Recipe name:</label>
        <input
          id="recipe-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus={true}
        />
        <button type="submit" disabled={!canSubmit}>Add</button>
      </div>

      <fieldset style={{ marginTop: 12 }}>
        <legend>Select ingredients</legend>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {ingredients.map(ing => (
            <li key={ing.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
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
