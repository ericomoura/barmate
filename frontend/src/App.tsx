import styles from './App.module.css'
import { IngredientList } from './features/ingredients/components/IngredientList'
import { RecipeForm } from './features/recipes/components/RecipeForm'
import { RecipeList } from './features/recipes/components/RecipeList'
import { useLocalStorage } from './shared/hooks/useLocalStorage'
import { KEYS } from './shared/storage/localStorage'
import utils from './styles/utilities.module.css'
import type { Ingredient, IngredientFormData, Recipe, RecipeItem } from './types'

function App() {
  const [ingredients, setIngredients] = useLocalStorage<Ingredient[]>(KEYS.ingredients, []);
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>(KEYS.recipes, []);

  function upsertIngredient(ingData: IngredientFormData): void {
    if (ingData.id && ingData.name) {  // Existing ingredient
      setIngredients(prev =>
        prev.map(i =>
        (i.id === ingData.id ?
          { ...i, name: ingData.name, amount: ingData.amount, category: ingData.category }
          :
          i
        )
        )
      );
    }
    else {  // New ingredient
      setIngredients((prev) => [{ id: crypto.randomUUID(), name: ingData.name, amount: ingData.amount, category: ingData.category }, ...prev]);
    }
  }

  function deleteIngredient(id: string) {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
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
            <IngredientList
              items={ingredients}
              onDelete={deleteIngredient}
              upsertIngredient={upsertIngredient}
            />
          </section>

          <div className={utils.vDivider} />

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
