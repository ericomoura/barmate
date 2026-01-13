import type { Ingredient } from '../../../types';
import { IngredientListItem } from './IngredientListItem';
import styles from './IngredientList.module.css';

interface IngredientListProps {
  items: Ingredient[];
  onDelete: (id: string) => void;
  onEdit: (id: string, name: string, amount: number) => void;
}

export function IngredientList({ items, onDelete, onEdit }: IngredientListProps) {
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className={styles.section}>
      <h4 id="saved-ingredients-heading">Saved Ingredients</h4>

      {sorted.length === 0 ? (
        <p className={styles.empty}>No ingredients yet. Add one above.</p>
      ) : (
        <ul className={styles.list}>
          {sorted.map(ingredient => (
            <IngredientListItem
              key={ingredient.id}
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
