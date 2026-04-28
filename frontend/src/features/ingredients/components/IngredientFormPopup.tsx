import { useEffect, useRef, useState } from "react";
import type { Ingredient, IngredientFormData } from "../../../types";
import styles from './IngredientFormPopup.module.css';

interface IngredientFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  ing?: Ingredient;
  upsertIngredient: (ing: IngredientFormData) => void;
}

export function IngredientFormPopup({ isOpen, onClose, ing, upsertIngredient }: IngredientFormPopupProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (isOpen)
      modalRef.current?.showModal()
    else
      modalRef.current?.close()
  }, [isOpen]);

  const [currentIng, setCurrentIng] = useState<IngredientFormData>(ing ?? {name: '', amount: 0, category: 'Other'});  // Initializes with the current ingredient's fields or defaults if it's a new ingredient

  function submitIng() {
    upsertIngredient(currentIng);
  }


  return (
    <dialog ref={modalRef} onClose={onClose}>
      <form onSubmit={submitIng}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
          <label>Name: </label>
          <input
            type="text"
            value={currentIng.name}
            onChange={e => setCurrentIng({...currentIng, name: e.target.value})}
            className={styles.input}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
          <label>Category: </label>
          <select
            value={currentIng.category}
            onChange={e => setCurrentIng({...currentIng, category: e.target.value})}>
            <option value="Other">Other</option>
            <option value="Spirit">Spirit</option>
            <option value="Mixer">Mixer</option>
            <option value="Fruit">Fruit</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
          <label>Amount: </label>
          <input
            type="number"
            value={currentIng.amount}
            onChange={e => setCurrentIng({...currentIng, amount: e.target.valueAsNumber})}
            className={styles.input}
          />
          <label> oz.</label>
        </div>

        <div className={styles.ingButtons}>
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
      </form>
    </dialog >
  );
}