const KEYS = {
  pantry: "wk_pantry",
  groceryList: "wk_grocery_list",
  preferences: "wk_preferences",
  savedRecipes: "wk_saved_recipes",
};

// Generic helpers
const get = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const set = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
};

// Pantry
export const getPantry = () => get(KEYS.pantry) || [];
export const savePantry = (items) => set(KEYS.pantry, items);

// Grocery List
export const getGroceryList = () => get(KEYS.groceryList) || [];
export const saveGroceryList = (items) => set(KEYS.groceryList, items);

// User Preferences
export const getPreferences = () =>
  get(KEYS.preferences) || {
    cuisines: [],
    restrictions: [],
    allergies: [],
    calorieGoal: null,
    proteinGoal: null,
  };
export const savePreferences = (prefs) => set(KEYS.preferences, prefs);

// Saved Recipes
export const getSavedRecipes = () => get(KEYS.savedRecipes) || [];
export const saveRecipe = (recipe) => {
  const current = getSavedRecipes();
  const already = current.find((r) => r.name === recipe.name);
  if (already) return;
  set(KEYS.savedRecipes, [...current, { ...recipe, savedAt: new Date().toISOString() }]);
};
export const deleteRecipe = (name) => {
  const updated = getSavedRecipes().filter((r) => r.name !== name);
  set(KEYS.savedRecipes, updated);
};
export const updateRecipeNotes = (name, notes) => {
  const updated = getSavedRecipes().map((r) =>
    r.name === name ? { ...r, userNotes: notes } : r
  );
  set(KEYS.savedRecipes, updated);
};