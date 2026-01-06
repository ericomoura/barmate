import { useState } from "react";
import type { Ingredient } from "../types";

interface IngredientListItemProps {
  ingredient: Ingredient;
  onDelete: (id: string) => void;
  onEdit: (id: string, name: string) => void;
}

export function IngredientListItem({ ingredient: ing, onDelete, onEdit }: IngredientListItemProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');

  function startEdit(ing: Ingredient) {
    setEditingId(ing.id);
    setEditName(ing.name);
  }
  function cancelEdit() {
    setEditingId(null);
    setEditName('');
  }
  function saveEdit() {
    const trimmed = editName.trim();
    if (!trimmed) return;
    onEdit(editingId!, trimmed);
    setEditingId(null);
    setEditName('');
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  }



  return (
    <li key={ing.id} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: '4px'
    }}>
      {editingId === ing.id ? (
        <>
          <input
            type="text"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1 }}
            autoFocus
          />
          <button type="button" onClick={saveEdit} disabled={!editName.trim()}>Save</button>
          <button type="button" onClick={cancelEdit}>Cancel</button>
        </>
      ) : (
        <>
          <span style={{ flex: 1 }}>{ing.name}</span>
          <button type="button" onClick={() => startEdit(ing)}>Edit</button>
          <button type="button" onClick={() => onDelete(ing.id)}>Delete</button>
        </>
      )}
    </li>
  );
}