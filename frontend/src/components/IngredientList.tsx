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
    <section style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 id="ingredients-heading">Ingredients</h2>
      
      {sorted.length === 0 ? (
        <p style={{ color: '#888' }}>No ingredients yet. Add one above.</p>
      ) : (
        <ul style={{
          padding: 0,
          margin: 0,
          width: '100%',
          maxWidth: '400px'
        }}>
          {sorted.map(ingredient => (
            <IngredientListItem
              ingredient={ingredient}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
