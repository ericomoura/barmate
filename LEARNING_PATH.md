# Barmate Learning Path (React + TypeScript + Vite, GitHub Pages)

This path is designed for incremental learning and steady progress. Each milestone states goals, concepts, tasks, and a deliverable. The app is a static SPA deployed to GitHub Pages, with persistence via localStorage.

Repository layout
- Use a dedicated frontend folder inside this repo to keep the root clean:
  - `frontend/` (Vite React TS project)
  - `LEARNING_PATH.md` (this guide)
  - `README.md` (root)

Deployment target
- GitHub Pages via gh-pages npm package (local publish to gh-pages branch)

Prerequisites
- Node LTS (>=18), npm
- Git configured with access to this repo

Conventions
- Use TypeScript strict mode where reasonable
- Keep components small and focused
- Favor explicit types on public module boundaries

## Milestone 0 — Initialize project scaffold
- **Goal**: Create a React + TS app with Vite in ./frontend and run it locally.
- **Concepts**:
  - Vite dev server, HMR
  - NPM scripts and project structure
- **Tasks**:
  1) In repo root, scaffold and run:
     ```bash
     npm create vite@latest frontend -- --template react-ts
     cd frontend
     npm install
     npm run dev
     ```
  2) Explore generated files: `index.html`, `src/main.tsx`, `src/App.tsx`, `vite.config.ts`
- **Deliverable**:
  - Running app at http://localhost:5173 with the Vite/React starter page

## Milestone 1 — Configure Pages deployment (gh-pages)
- **Goal**: Prepare the project for GitHub Pages deployment.
- **Concepts**:
  - Vite base path for subpath deployments
  - gh-pages package workflow
- **Tasks**:
  1) Set Vite base to the repository name (barmate) in `frontend/vite.config.ts`:
     ```ts
     import { defineConfig } from 'vite'
     import react from '@vitejs/plugin-react'

     export default defineConfig({
       base: '/barmate/',
       plugins: [react()],
     })
     ```
  2) Install and configure gh-pages from `frontend/`:
     ```bash
     npm i -D gh-pages
     ```
     Add scripts to `frontend/package.json`:
     ```json
     {
       "scripts": {
         "predeploy": "npm run build",
         "deploy": "gh-pages -d dist"
       }
     }
     ```
  3) Test a build locally:
     ```bash
     npm run build
     npm run preview
     ```
- **Deliverable**:
  - Dist folder builds successfully; deploy script ready to push when desired

## Milestone 2 — Domain modeling
- **Goal**: Define the core types for Ingredients and Recipes.
- **Concepts**:
  - Interfaces for object contracts
  - Readonly ids to prevent mutation
- **Tasks**:
  1) Create `src/types.ts`:
     ```ts
     export interface Ingredient {
       readonly id: string;
       name: string;
     }

     export interface RecipeItem {
       ingredientId: string;
       amount?: string; // free-form: "50 ml", "1/2 oz", "dash"
     }

     export interface Recipe {
       readonly id: string;
       name: string;
       items: RecipeItem[];
     }
     ```
- **Deliverable**:
  - Centralized, reusable types matching the app's decisions

## Milestone 3 — Local storage helpers + hook
- **Goal**: Persist arrays of Ingredient and Recipe to localStorage with a small API and a generic hook.
- **Concepts**:
  - JSON serialization with defensive parsing
  - Encapsulating persistence behind helpers
  - Generic hook for reusable state persistence
- **Tasks**:
  1) Create `src/storage/localStorage.ts`:
     ```ts
     import type { Ingredient, Recipe } from '../types';

     export const KEYS = {
       ingredients: 'barmate.ingredients',
       recipes: 'barmate.recipes',
     } as const;

     function loadArray<T>(key: string): T[] {
       try {
         const raw = localStorage.getItem(key);
         return raw ? (JSON.parse(raw) as T[]) : [];
       } catch {
         return [];
       }
     }

     function saveArray<T>(key: string, list: T[]): void {
       try {
         localStorage.setItem(key, JSON.stringify(list));
       } catch (e) {
         console.error('localStorage save failed', e);
       }
     }

     export function loadIngredients(): Ingredient[] {
       return loadArray<Ingredient>(KEYS.ingredients);
     }

     export function saveIngredients(list: Ingredient[]): void {
       saveArray(KEYS.ingredients, list);
     }

     export function loadRecipes(): Recipe[] {
       return loadArray<Recipe>(KEYS.recipes);
     }

     export function saveRecipes(list: Recipe[]): void {
       saveArray(KEYS.recipes, list);
     }
     ```
  2) Create `src/hooks/useLocalStorage.ts`:
     ```ts
     import { useEffect, useState } from 'react';

     export function useLocalStorage<T>(key: string, initial: T): [T, (next: T) => void] {
       const [value, setValue] = useState<T>(() => {
         try {
           const raw = localStorage.getItem(key);
           return raw ? (JSON.parse(raw) as T) : initial;
         } catch {
           return initial;
         }
       });

       useEffect(() => {
         try {
           localStorage.setItem(key, JSON.stringify(value));
         } catch (e) {
           console.error('localStorage persist failed', e);
         }
       }, [key, value]);

       return [value, setValue];
     }
     ```
- **Deliverable**:
  - Working helpers and a generic hook; components can use them without duplicating JSON or try/catch logic.
- **Notes**:
  - Keep id generation in UI logic (e.g., when adding entities).
  - Amount remains string by design (free-form inputs like "dash", "1/2 oz" supported).
  - Add clear/export/import helpers later if desired.

## Milestone 4 — Ingredients: Add/List/Delete (first UI)
- **Goal**: Implement CRUD basics for Ingredients, except edit.
- **Concepts**:
  - Controlled inputs, form handling
  - Lists and keys, empty state
  - Minimal validation (non-empty name)
- **Tasks**:
  1) Components:
     - `src/components/IngredientForm.tsx` (name input, add)
     - `src/components/IngredientList.tsx` (render list, delete button)
  2) App state in `src/App.tsx`:
     - Use `useLocalStorage` for ingredients
     - Functions `addIngredient`, `deleteIngredient`
  3) Rendering:
     - Show form above list
     - Empty state message when list is empty
- **Deliverable**:
  - Ingredient list that persists via localStorage

## Milestone 5 — Ingredients: Edit + polish
- **Goal**: Add update capability and basic UX polish.
- **Concepts**:
  - Conditional rendering (edit mode)
  - Inline vs modal edit
- **Tasks**:
  1) Edit button in IngredientList items toggles an inline form
  2) Save updates and persist
  3) Optional: sort by name; focus management; basic CSS
- **Deliverable**:
  - Full CRUD for Ingredients with simple, clean UI

## Milestone 6 — Recipes: Create
- **Goal**: Create recipes by referencing existing ingredients.
- **Concepts**:
  - Cross-entity references
  - Select/multi-select UX
  - Derived data (display ingredient names from ids)
- **Tasks**:
  1) Components:
     - `src/components/RecipeForm.tsx` (name + ingredient selection + optional amounts)
     - `src/components/RecipeList.tsx` (render recipes; expand to show items)
  2) App state:
     - Use `useLocalStorage` for recipes
     - Validate that at least one ingredient is selected
  3) Rendering:
     - Show names for referenced ingredients
- **Deliverable**:
  - Ability to create and view recipes linked to ingredients

## Milestone 7 — Recipes: Delete/Edit + polish
- **Goal**: Manage lifecycle of recipes with basic UX.
- **Concepts**:
  - Editing nested arrays
  - Confirm delete patterns
- **Tasks**:
  1) Delete recipe with confirmation
  2) Optional: edit recipe name, items, amounts
  3) Optional: search/filter by name or ingredient
- **Deliverable**:
  - Full CRUD for Recipes with simple navigation patterns

## Milestone 8 — Optional quality-of-life features
- **Goal**: Add small features that improve usability and resilience.
- **Options**:
  - Import/export JSON for backup
  - Basic validations with messages
  - Better styling (CSS variables; light/dark mode)
  - Unit tests for storage helpers and hooks (Vitest)
  - React Router with two routes: `/ingredients` and `/recipes`
  - Context + `useReducer` if state grows complex

## Milestone 9 — Deploy to GitHub Pages
- **Goal**: Publish the app via gh-pages.
- **Concepts**:
  - Local build and publish to gh-pages branch
  - Vite base path correctness
- **Tasks**:
  1) From `frontend/`:
     ```bash
     npm run build
     npm run deploy
     ```
  2) Verify Pages is enabled for the repo and pointing to the `gh-pages` branch
  3) Open the GitHub Pages URL to confirm assets load (base `/barmate/` is correct)
- **Deliverable**:
  - Live URL serving the SPA

## Appendix — Notes and tips
- **Simple id helper** (optional):
  ```ts
  export function genId(prefix = ''): string {
    const core =
      typeof crypto?.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    return prefix ? `${prefix}_${core}` : core;
  }
  ```
- Avoid premature abstraction; refactor when duplication becomes clear
- Keep types strict around persistence boundaries
- Use memoization (`useMemo`) only after identifying real performance issues
