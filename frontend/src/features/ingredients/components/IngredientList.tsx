import { useState } from 'react';
import { DEFAULT_ING_DATA, type Ingredient, type IngredientFormData } from '../../../types';
import { IngredientFormPopup } from './IngredientFormPopup';
import styles from './IngredientList.module.css';
import { IngredientListItem } from './IngredientListItem';

interface IngredientListProps {
  items: Ingredient[];
  onDelete: (id: string) => void;
  upsertIngredient: (ingData: IngredientFormData) => void;
}

export function IngredientList({ items, onDelete, upsertIngredient }: IngredientListProps) {
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [formIng, setFormIng] = useState<IngredientFormData | undefined>(undefined);


  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 id="saved-ingredients-heading">Ingredients</h2>
        <button onClick={() => setFormIng(DEFAULT_ING_DATA)}>+</button>
        <button onClick={() => setIsCollapsed(!isCollapsed)}> {isCollapsed ? '▼' : '▲'} </button>
      </div>

      <IngredientFormPopup
        ing={formIng}
        onClose={() => setFormIng(undefined)}
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
              editIng={setFormIng}
            />
          ))}
        </ul>
      ))}
    </section>
  );
}
