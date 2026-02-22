const KEYS = {
    pantry: "wk_pantry",
    groceryList: "wk_grocery_list",
    preferences: "wk_preferences",
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