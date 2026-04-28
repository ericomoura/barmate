import type { Ingredient } from "../../../types";
import styles from "./IngredientListItem.module.css";

interface IngredientListItemProps {
  ingredient: Ingredient;
  onDelete: (id: string) => void;
  editIng: (ing: Ingredient) => void;
}

export function IngredientListItem({ ingredient: ing, onDelete, editIng }: IngredientListItemProps) {


  return (
    <li key={ing.id} className={styles.row}>
      <div className={styles.ingContainer}>
        <div className={styles.ingInfo}>
          <div>
            <span className={styles.name}>{ing.name} </span>
            {ing.category && <span className={styles.amount}> - {ing.category}</span>}
          </div>
          <span className={styles.amount}>{ing.amount} oz.</span>
        </div>

        <div className={styles.ingButtons}>
          <button type="button" onClick={() => editIng(ing)}>Edit</button>
          <button type="button" onClick={() => onDelete(ing.id)}>Delete</button>
        </div>
      </div>
    </li>
  );
}
