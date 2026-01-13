import { useMemo, useState } from "react";
import type { Ingredient, Recipe, RecipeItem } from "../../../types";
import styles from "./RecipeListItem.module.css";

interface RecipeListItemProps {
  recipe: Recipe;
  ingredients: Ingredient[];
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string, newItems: RecipeItem[]) => void;
}

export function RecipeListItem({ recipe, ingredients, onDelete, onEdit }: RecipeListItemProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState<string>('');
  const [draftItems, setDraftItems] = useState<RecipeItem[]>([]);
  const [newIngredientId, setNewIngredientId] = useState<string>('');

  function startEdit(recipe: Recipe) {
    setEditingId(recipe.id);
    setDraftName(recipe.name);
    setDraftItems(recipe.items.map(i => ({ ingredientId: i.ingredientId, amount: i.amount })));
    setNewIngredientId('');
  }
  function cancelEdit() {
    setEditingId(null);
    setDraftName('');
    setDraftItems([]);
    setNewIngredientId('');
  }
  function saveEdit() {
    const trimmed = draftName.trim();
    if (!editingId || !trimmed || draftItems.length === 0) return;
    onEdit(editingId, trimmed, draftItems);
    cancelEdit();
  }
  function removeItem(index: number) {
    setDraftItems(prev => prev.filter((_, i) => i !== index));
  }
  function updateItemAmount(ingId: string, newAmount: number) {
    if (newAmount < 0) return;
    setDraftItems(prev => prev.map(it => it.ingredientId === ingId ? { ...it, amount: newAmount } : it));
  }
  function addItem() {
    if (!newIngredientId) return;
    const exists = draftItems.some(i => i.ingredientId === newIngredientId);
    if (exists) return;
    setDraftItems(prev => [...prev, { ingredientId: newIngredientId, amount: 0 }]);
    setNewIngredientId('');
  }

  const availableToAdd = ingredients.filter(i =>
    !draftItems.some(di => di.ingredientId === i.id)
  );
  const isEditing = editingId === recipe.id;
  const ingredientById = useMemo(
    () => new Map(ingredients.map(i => [i.id, i])),
    [ingredients]
  );

  return (
    <li key={recipe.id}>
      {isEditing ? (
        <div className={styles.card}>
          <div className={styles.row}>
            <label>Name:</label>
            <input
              id={`rname-${recipe.id}`}
              type="text"
              value={draftName}
              onChange={e => setDraftName(e.target.value)}
              autoFocus
            />
          </div>

          <div className={styles.section}>
            <div className={styles.title}>Ingredients</div>
            {draftItems.length === 0 ? (
              <p className={styles.muted}>No items yet.</p>
            ) : (
              <ul className={styles.discList}>
                {draftItems.map((it, idx) => {
                  const ing = ingredientById.get(it.ingredientId);
                  const label = ing ? ing.name : '(deleted ingredient)';
                  return (
                    <li key={`${recipe.id}-${it.ingredientId}-${idx}`} className={styles.ingredientRow}>
                      <span className={styles.ingredientName}>{label}</span>
                      <input
                        type="number"
                        min="0"
                        value={it.amount ?? 0}
                        onChange={e => updateItemAmount(it.ingredientId, e.target.valueAsNumber)}
                      />
                      <button type="button" onClick={() => removeItem(idx)}>Remove</button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className={styles.controls}>
            <select
              value={newIngredientId}
              onChange={e => setNewIngredientId(e.target.value)}
            >
              <option value="">Select ingredient…</option>
              {availableToAdd.map(ing => (
                <option key={ing.id} value={ing.id}>
                  {ing.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={addItem} disabled={!newIngredientId}>
              Add item
            </button>
          </div>

          <div className={styles.controlsMarginLarge}>
            <button
              type="button"
              onClick={saveEdit}
              disabled={!draftName.trim() || draftItems.length === 0}
            >
              Save
            </button>
            <button type="button" onClick={cancelEdit}>Cancel</button>
            <button type="button" onClick={() => onDelete(recipe.id)}>Delete</button>
          </div>
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.recipeName}>{recipe.name}</span>
            <span className={styles.muted}>({recipe.items.length} item{recipe.items.length === 1 ? '' : 's'})</span>
          </div>

          {recipe.items.length > 0 && (
            <ul className={styles.discListCompact}>
              {recipe.items.map((item, idx) => {
                const ing = ingredientById.get(item.ingredientId);
                const label = ing ? ing.name : '(deleted ingredient)';
                  return (
                    <li key={`${recipe.id}-${item.ingredientId}-${idx}`}>
                      <span>{label}</span>
                      <span className={styles.subtle}> ({item.amount} oz.)</span>
                    </li>
                  );
              })}
            </ul>
          )}

          <div className={styles.controls}>
            <button type="button" onClick={() => startEdit(recipe)}>Edit</button>
            <button type="button" onClick={() => onDelete(recipe.id)}>Delete</button>
          </div>
        </div>
      )}
    </li>
  )
}
