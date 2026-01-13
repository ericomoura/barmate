import { IngredientForm } from './features/ingredients/components/IngredientForm'
import { IngredientList } from './features/ingredients/components/IngredientList'
import { RecipeForm } from './features/recipes/components/RecipeForm'
import { RecipeList } from './features/recipes/components/RecipeList'
import { useLocalStorage } from './shared/hooks/useLocalStorage'
import { KEYS } from './shared/storage/localStorage'
import type { Ingredient, Recipe, RecipeItem } from './types'
import styles from './App.module.css'

function App() {
  const [ingredients, setIngredients] = useLocalStorage<Ingredient[]>(KEYS.ingredients, []);
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>(KEYS.recipes, []);

  function addIngredient(name: string) {
    setIngredients((prev) => [{ id: crypto.randomUUID(), name, amount: 0 }, ...prev]);
  }
  function deleteIngredient(id: string) {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }
  function editIngredient(id: string, nextName: string, nextAmount: number) {
    const trimmed = nextName.trim();
    if (!trimmed) return;
    setIngredients(prev =>
      prev.map(i => (i.id === id ? { ...i, name: trimmed, amount: nextAmount } : i))
    );
  }

  function addRecipe(name: string, items: RecipeItem[]) {
    const trimmed = name.trim();
    if (!trimmed || items.length === 0) return;
    setRecipes(prev => [
      { id: crypto.randomUUID(), name: trimmed, items },
      ...prev,
    ]);
  }
  function deleteRecipe(id: string) {
    setRecipes(prev => prev.filter(r => r.id !== id));
  }
  function editRecipe(id: string, name: string, items: RecipeItem[]) {
    const trimmed = name.trim();
    if (!trimmed || items.length === 0) return;
    setRecipes(prev =>
      prev.map(r => (r.id === id ? { ...r, name: trimmed, items } : r))
    );
  }



  return (
    <>
      <header className={styles.header}>
        <h1>Barmate</h1>
      </header>

      <main>
        <div className={styles.layout}>
          <section className={styles.leftCol}>
            <h2 id="ingredients-heading">Ingredients</h2>
            <IngredientForm onAdd={addIngredient} />
            <IngredientList items={ingredients} onDelete={deleteIngredient} onEdit={editIngredient} />
          </section>

          <div className={styles.divider} />
          
          <section className={styles.rightCol}>
            <h2 id="recipes-heading">Recipes</h2>
            <RecipeForm ingredients={ingredients} onAdd={({ name, items }) => addRecipe(name, items)} />
            <RecipeList items={recipes} ingredients={ingredients} onDelete={deleteRecipe} onEdit={editRecipe} />
          </section>

        </div>
      </main>
    </>
  );
}

export default App
