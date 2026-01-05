import './App.css'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Ingredient } from './types'
import { KEYS } from './storage/localStorage'
import { IngredientForm } from './components/IngredientForm'
import { IngredientList } from './components/IngredientList'

function App() {
  const [ingredients, setIngredients] = useLocalStorage<Ingredient[]>(KEYS.ingredients, []);

  function addIngredient(name: string) {
    setIngredients((prev) => [{ id: crypto.randomUUID(), name }, ...prev]);
  }

  function deleteIngredient(id: string) {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <main style={{ padding: 16 }}>
      <h1>Barmate</h1>
      <IngredientForm onAdd={addIngredient} />
      <IngredientList items={ingredients} onDelete={deleteIngredient} />
    </main>
  );
}

export default App
