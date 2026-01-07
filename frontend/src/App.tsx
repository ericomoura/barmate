import { IngredientForm } from './components/IngredientForm'
import { IngredientList } from './components/IngredientList'
import { RecipeForm } from './components/RecipeForm'
import { RecipeList } from './components/RecipeList'
import { useLocalStorage } from './hooks/useLocalStorage'
import { KEYS } from './storage/localStorage'
import type { Ingredient, Recipe, RecipeItem } from './types'

function App() {
  const [ingredients, setIngredients] = useLocalStorage<Ingredient[]>(KEYS.ingredients, []);
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>(KEYS.recipes, []);

  function addIngredient(name: string) {
    setIngredients((prev) => [{ id: crypto.randomUUID(), name }, ...prev]);
  }
  function deleteIngredient(id: string) {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }
  function editIngredient(id: string, nextName: string) {
    const trimmed = nextName.trim();
    if (!trimmed) return;
    setIngredients(prev =>
      prev.map(i => (i.id === id ? { ...i, name: trimmed } : i))
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
      <header style={{ textAlign: 'center' }}>
        <h1>Barmate</h1>
      </header>

      <main>
        <div style={{ display: 'flex', width: '100vw' }}>
          <section style={{ display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center' }}>
            <h2 id="ingredients-heading">Ingredients</h2>
            <IngredientForm onAdd={addIngredient} />
            <IngredientList items={ingredients} onDelete={deleteIngredient} onEdit={editIngredient} />
          </section>

          <div style={{ borderLeft: '1px solid #ccc' }} />
          
          <section style={{ display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center' }}>
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
