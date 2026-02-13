import { useState } from "react";
import type { Ingredient } from "../../../types";
import styles from "./IngredientListItem.module.css";

interface IngredientListItemProps {
  ingredient: Ingredient;
  onDelete: (id: string) => void;
  onEdit: (id: string, name: string, amount: number, category?: string) => void;
}

export function IngredientListItem({ ingredient: ing, onDelete, onEdit }: IngredientListItemProps) {
  function startEdit(ing: Ingredient) {
    setEditingId(ing.id);
    setEditName(ing.name);
    setEditAmount(ing.amount);
    setEditCategory(ing.category || '');
  }
  function cancelEdit() {
    setEditingId(null);
    setEditName('');
    setEditAmount(0);
    setEditCategory('');
  }
  function saveEdit() {
    const trimmed = editName.trim();
    if (!trimmed) return;
    
    onEdit(editingId!, trimmed, editAmount|0, editCategory.trim() || undefined);
    setEditingId(null);
    setEditName('');
    setEditAmount(0);
    setEditCategory('');
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  }


  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editCategory, setEditCategory] = useState<string>('');



  return (
    <li key={ing.id} className={styles.row}>
      {editingId === ing.id ? (
        <div className={styles.ingContainer}>
          <div className={styles.ingInfo}>
            <div style={{display: 'flex', flexDirection: 'row', gap: 8}}>
              <label>Name: </label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                className={styles.input}
              />
            </div>
            <div style={{display: 'flex', flexDirection: 'row', gap: 8}}>
              <label>Category: </label>
              <select 
                value={editCategory}
                onChange={e => setEditCategory(e.target.value)}>
                  <option value="Other">Other</option>
                  <option value="Mixer">Mixer</option>
                  <option value="Spirit">Spirit</option>
                  <option value="Fruit">Fruit</option>
              </select>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', gap: 8}}>
              <label>Amount: </label>
              <input
                type="number"
                value={editAmount}
                onChange={e => setEditAmount(e.target.valueAsNumber)}
                onKeyDown={handleKeyDown}
                className={styles.input}
                autoFocus
              />
              <label> oz.</label>
            </div>
          </div>

          <div className={styles.ingButtons}>
            <button type="button" onClick={saveEdit} disabled={!editName.trim()}>Save</button>
            <button type="button" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className={styles.ingContainer}>
          <div className={styles.ingInfo}>
            <div>
              <span className={styles.name}>{ing.name} </span>
              {ing.category && <span className={styles.amount}> - {ing.category}</span>}
            </div>
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
