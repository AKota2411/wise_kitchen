// Keys are scoped per user UID so each account has isolated data
const keys = (uid) => ({
  pantry: `wk_pantry_${uid}`,
  groceryList: `wk_grocery_list_${uid}`,
  preferences: `wk_preferences_${uid}`,
  savedRecipes: `wk_saved_recipes_${uid}`,
});

const get = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
};

const set = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (e) { console.error("Storage error:", e); }
};

// Pantry
export const getPantry = (uid) => get(keys(uid).pantry) || [];
export const savePantry = (uid, items) => set(keys(uid).pantry, items);

// Grocery List
export const getGroceryList = (uid) => get(keys(uid).groceryList) || [];
export const saveGroceryList = (uid, items) => set(keys(uid).groceryList, items);

// Preferences
export const getPreferences = (uid) =>
  get(keys(uid).preferences) || {
    cuisines: [], restrictions: [], allergies: [],
    calorieGoal: null, proteinGoal: null, carbGoal: null, fatGoal: null,
  };
export const savePreferences = (uid, prefs) => set(keys(uid).preferences, prefs);

// Saved Recipes
export const getSavedRecipes = (uid) => get(keys(uid).savedRecipes) || [];
export const saveRecipe = (uid, recipe) => {
  const current = getSavedRecipes(uid);
  if (current.find((r) => r.name === recipe.name)) return;
  set(keys(uid).savedRecipes, [...current, { ...recipe, savedAt: new Date().toISOString() }]);
};
export const deleteRecipe = (uid, name) => {
  set(keys(uid).savedRecipes, getSavedRecipes(uid).filter((r) => r.name !== name));
};
export const updateRecipeNotes = (uid, name, notes) => {
  set(keys(uid).savedRecipes, getSavedRecipes(uid).map((r) => r.name === name ? { ...r, userNotes: notes } : r));
};