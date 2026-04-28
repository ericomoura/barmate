import type { Ingredient, IngredientFormData } from '../../../types';
import { IngredientListItem } from './IngredientListItem';
import styles from './IngredientList.module.css';
import { useState } from 'react';
import { IngredientFormPopup } from './IngredientFormPopup';

interface IngredientListProps {
  items: Ingredient[];
  onDelete: (id: string) => void;
  onEdit: (id: string, name: string, amount: number, category: string) => void;
  upsertIngredient: (ingData: IngredientFormData) => void;
}

export function IngredientList({ items, onDelete, onEdit, upsertIngredient }: IngredientListProps) {
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [addPopupIsOpen, setAddPopupIsOpen] = useState<boolean>(false);


  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h4 id="saved-ingredients-heading">Saved Ingredients</h4>
        <button onClick={() => setAddPopupIsOpen(true)}>+</button>
        <button onClick={() => setIsCollapsed(!isCollapsed)}> {isCollapsed ? '▼' : '▲'} </button>
      </div>

      <IngredientFormPopup 
        isOpen={addPopupIsOpen} 
        onClose={() => setAddPopupIsOpen(false)}
        upsertIngredient={upsertIngredient}
      />

      {!isCollapsed && (sorted.length === 0 ? (
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
      ))}
    </section>
  );
}
