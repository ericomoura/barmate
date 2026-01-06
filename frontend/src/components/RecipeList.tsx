import { useMemo, useState } from 'react';
import type { Ingredient, Recipe, RecipeItem } from '../types';

interface RecipeListProps {
  items: Recipe[];
  ingredients: Ingredient[];
  onDelete: (id: string) => void;
  onEdit: (id: string, newNae: string, newItems: RecipeItem[]) => void;
}

export function RecipeList({ items, ingredients, onDelete, onEdit }: RecipeListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState<string>('');
  const [draftItems, setDraftItems] = useState<RecipeItem[]>([]);
  const [newIngredientId, setNewIngredientId] = useState<string>('');

  const ingredientById = useMemo(
    () => new Map(ingredients.map(i => [i.id, i])),
    [ingredients]
  );

  const sortedRecipes = [...items].sort((a, b) => a.name.localeCompare(b.name));

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
  function addItem() {
    if (!newIngredientId) return;
    const exists = draftItems.some(i => i.ingredientId === newIngredientId);
    if (exists) return;
    setDraftItems(prev => [...prev, { ingredientId: newIngredientId }]);
    setNewIngredientId('');
  }

  const availableToAdd = ingredients.filter(i =>
    !draftItems.some(di => di.ingredientId === i.id)
  );

  return (
    <section>
      <h2 id="recipes-heading">Recipes</h2>

      {sortedRecipes.length === 0 ? (
        <p style={{ color: '#888' }}>No recipes available.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {sortedRecipes.map(recipe => {
            const isEditing = editingId === recipe.id;
            return (
              <li key={recipe.id} style={{ padding: '10px 0', borderBottom: '1px solid #222' }}>
                {isEditing ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <label>Name:</label>
                      <input
                        id={`rname-${recipe.id}`}
                        type="text"
                        value={draftName}
                        onChange={e => setDraftName(e.target.value)}
                      />
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Ingredients</div>
                      {draftItems.length === 0 ? (
                        <p style={{ color: '#888' }}>No items yet.</p>
                      ) : (
                        <ul style={{ listStyle: 'disc', paddingLeft: 20, margin: 0 }}>
                          {draftItems.map((it, idx) => {
                            const ing = ingredientById.get(it.ingredientId);
                            const label = ing ? ing.name : '(missing ingredient)';
                            return (
                              <li key={`${recipe.id}-${it.ingredientId}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ minWidth: 140 }}>{label}</span>
                                <button type="button" onClick={() => removeItem(idx)}>Remove</button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
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

                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
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
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600 }}>{recipe.name}</span>
                      <span style={{ color: '#888' }}>({recipe.items.length} item{recipe.items.length === 1 ? '' : 's'})</span>
                    </div>

                    {recipe.items.length > 0 && (
                      <ul style={{ listStyle: 'disc', paddingLeft: 20, marginTop: 6 }}>
                        {recipe.items.map((item, idx) => {
                          const ing = ingredientById.get(item.ingredientId);
                          const label = ing ? ing.name : '(missing ingredient)';
                          return (
                            <li key={`${recipe.id}-${item.ingredientId}-${idx}`}>
                              <span>{label}</span>
                              {item.amount && <span style={{ color: '#aaa' }}> — {item.amount}</span>}
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    <div style={{ marginTop: 8 }}>
                      <button type="button" onClick={() => startEdit(recipe)}>Edit</button>
                      <button type="button" onClick={() => onDelete(recipe.id)}>Delete</button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
