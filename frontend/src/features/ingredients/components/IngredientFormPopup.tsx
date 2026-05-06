import { useEffect, useRef, useState } from "react";
import { DEFAULT_ING_DATA, type IngredientFormData } from "../../../types";
import styles from './IngredientFormPopup.module.css';

interface IngredientFormPopupProps {
  onClose: () => void;
  ing?: IngredientFormData;
  upsertIngredient: (ing: IngredientFormData) => void;
}

export function IngredientFormPopup({ onClose, ing, upsertIngredient }: IngredientFormPopupProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (ing !== undefined) {
      setCurrentIng(ing)
      modalRef.current?.showModal()
    }
    else
      modalRef.current?.close()
  }, [ing]);

  const [currentIng, setCurrentIng] = useState<IngredientFormData>(DEFAULT_ING_DATA);  // Initializes with the current ingredient's fields or defaults if it's a new ingredient

  function submitIng(e: React.FormEvent) {
    e.preventDefault();
    upsertIngredient(currentIng);
    onClose();
  }


  return (
    <dialog className={styles.popup} ref={modalRef} onClose={onClose} onClick={(e) => { if (e.target === modalRef.current) onClose(); }}>
      <fieldset className={styles.fieldset}>
        <legend>Ingredient</legend>
        <form onSubmit={submitIng}>
          <div>
            <label>Name: </label>
            <input
              type="text"
              value={currentIng.name}
              onChange={e => setCurrentIng({ ...currentIng, name: e.target.value })}
            />
          </div>
          <div>
            <label>Category: </label>
            <select
              value={currentIng.category}
              onChange={e => setCurrentIng({ ...currentIng, category: e.target.value })}>
              <option value="Other">Other</option>
              <option value="Spirit">Spirit</option>
              <option value="Mixer">Mixer</option>
              <option value="Fruit">Fruit</option>
            </select>
          </div>
          <div>
            <label>Amount: </label>
            <input
              type="number"
              value={currentIng.amount}
              onChange={e => setCurrentIng({ ...currentIng, amount: e.target.valueAsNumber })}
            />
            <label> oz.</label>
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