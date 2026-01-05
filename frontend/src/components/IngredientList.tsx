import type { Ingredient } from '../types';

interface IngredientListProps {
  items: Ingredient[];
  onDelete: (id: string) => void;
}

export function IngredientList({ items, onDelete }: IngredientListProps) {
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));

  if (sorted.length === 0) {
    return (
      <section aria-labelledby="ingredients-heading">
        <h2 id="ingredients-heading">Ingredients</h2>
        <p style={{ color: '#888' }}>No ingredients yet. Add your first one above.</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="ingredients-heading">
      <h2 id="ingredients-heading">Ingredients</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {sorted.map((ing) => (
          <li
            key={ing.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 0',
              borderBottom: '1px solid #222',
            }}
          >
            <span style={{ flex: 1 }}>{ing.name}</span>
            <button
              type="button"
              onClick={() => onDelete(ing.id)}
              aria-label={`Delete ingredient ${ing.name}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
