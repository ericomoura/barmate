import { useState } from "react";
import type { Ingredient } from "../../../types";
import styles from "./IngredientListItem.module.css";

interface IngredientListItemProps {
  ingredient: Ingredient;
  onDelete: (id: string) => void;
  onEdit: (id: string, name: string, amount: number) => void;
}

export function IngredientListItem({ ingredient: ing, onDelete, onEdit }: IngredientListItemProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editAmount, setEditAmount] = useState<number>(0);

  function startEdit(ing: Ingredient) {
    setEditingId(ing.id);
    setEditName(ing.name);
    setEditAmount(ing.amount);
  }
  function cancelEdit() {
    setEditingId(null);
    setEditName('');
    setEditAmount(0);
  }
  function saveEdit() {
    const trimmed = editName.trim();
    if (!trimmed) return;

    onEdit(editingId!, trimmed, editAmount|0);
    setEditingId(null);
    setEditName('');
    setEditAmount(0);
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  }



  return (
    <li key={ing.id} className={styles.row}>
      {editingId === ing.id ? (
        <div className={styles.ingContainer}>
          <div className={styles.ingInfo}>
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.input}
              autoFocus
            />
            <input
              type="number"
              value={editAmount}
              onChange={e => setEditAmount(e.target.valueAsNumber)}
              onKeyDown={handleKeyDown}
              className={styles.input}
              autoFocus
            />
          </div>

          <div className={styles.ingButtons}>
            <button type="button" onClick={saveEdit} disabled={!editName.trim()}>Save</button>
            <button type="button" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className={styles.ingContainer}>
          <div className={styles.ingInfo}>
            <span className={styles.name}>{ing.name}</span>
            <span className={styles.amount}>{ing.amount} oz.</span>
          </div>

          <div className={styles.ingButtons}>
            <button type="button" onClick={() => startEdit(ing)}>Edit</button>
            <button type="button" onClick={() => onDelete(ing.id)}>Delete</button>
          </div>
        </div>
      )}
    </li>
  );
}
