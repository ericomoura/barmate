import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_RECIPE_DATA, type Ingredient, type RecipeFormData } from "../../../types";
import styles from './RecipeFormPopup.module.css';

interface RecipeFormPopupProps {
  onClose: () => void;
  recipe?: RecipeFormData;
  ingredients: Ingredient[];
  upsertRecipe: (ing: RecipeFormData) => void;
}

export function RecipeFormPopup({ onClose, recipe, ingredients, upsertRecipe }: RecipeFormPopupProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (recipe !== undefined) {
      setCurrentRecipe(recipe)
      modalRef.current?.showModal()
    }
    else
      modalRef.current?.close()
  }, [recipe]);

  const [currentRecipe, setCurrentRecipe] = useState<RecipeFormData>(DEFAULT_RECIPE_DATA);  // Initializes with the current recipe's fields or defaults if it's a new recipe

  function submitRecipe(e: React.FormEvent) {
    e.preventDefault();
    upsertRecipe(currentRecipe);
    onClose();
  }

  const ingredientById = useMemo(
    () => new Map(ingredients.map(i => [i.id, i])),
    [ingredients]
  );
  const availableToAdd = ingredients.filter(i =>
    !currentRecipe?.items.some(recipeItem => recipeItem.ingredientId === i.id)
  );

  function addItem() {
    if (!newIngredientId) return;
    const exists = currentRecipe?.items.some(i => i.ingredientId === newIngredientId);
    if (exists) return;
    setCurrentRecipe({ ...currentRecipe, items: [...currentRecipe.items, { ingredientId: newIngredientId, amount: 0 }] });
    setNewIngredientId('');
  }
  function removeItem(index: number) {
    setCurrentRecipe({ ...currentRecipe, items: currentRecipe.items.filter((_, i) => i !== index) });
  }
  function updateRecipeItemAmount(ingId: string, newAmount: number) {
    if (newAmount < 0) return;
    setCurrentRecipe({ ...currentRecipe, items: currentRecipe.items.map(it => it.ingredientId === ingId ? { ...it, amount: newAmount } : it) });
  }

  const [newIngredientId, setNewIngredientId] = useState<string>('');


  return (
    <dialog className={styles.popup} ref={modalRef} onClose={onClose} onClick={(e) => { if (e.target === modalRef.current) onClose(); }}>
      <fieldset className={styles.fieldset}>
        <legend>Recipe</legend>
        <form onSubmit={submitRecipe}>
          <div>
            <label>Name: </label>
            <input
              type="text"
              value={currentRecipe.name}
              onChange={e => setCurrentRecipe({ ...currentRecipe, name: e.target.value })}
            />
          </div>

          <div>
            <div>Ingredients:</div>
            {currentRecipe?.items.length === 0 ? (
              <p className={styles.muted}>No ingredients yet.</p>
            ) : (
              <ul className={styles.discList}>
                {currentRecipe?.items.map((it, idx) => {
                  const ing = ingredientById.get(it.ingredientId);
                  const label = ing ? ing.name : '(deleted ingredient)';
                  return (
                    <li key={`${currentRecipe.id}-${it.ingredientId}-${idx}`} className={styles.ingredientRow}>
                      <span className={styles.ingredientName}>{label}</span>
                      <input
                        className={styles.ingAmountInput}
                        type="number"
                        min="0"
                        value={it.amount ?? 0}
                        onChange={e => updateRecipeItemAmount(it.ingredientId, e.target.valueAsNumber)}
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

          <div className={styles.formButtons}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </fieldset>
    </dialog>
  );
}