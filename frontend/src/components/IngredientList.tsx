import type { Ingredient } from '../types';
import { IngredientListItem } from './IngredientListItem';

interface IngredientListProps {
  items: Ingredient[];
  onDelete: (id: string) => void;
  onEdit: (id: string, name: string) => void;
}

export function IngredientList({ items, onDelete, onEdit }: IngredientListProps) {
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section>
      <h2 id="ingredients-heading">Ingredients</h2>
      {sorted.length === 0 ?
        (
          <p style={{ color: '#888' }}>No ingredients yet. Add your first one above.</p>
        )
        :
        (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {sorted.map(ingredient => (
              <IngredientListItem
                ingredient={ingredient}
                onDelete={onDelete}
                onEdit={onEdit} />
            ))}
          </ul>
        )
      }
    </section>
  );
}
