import { useState, useEffect } from "react";
import { getPantry, savePantry, getGroceryList, saveGroceryList } from "../utils/storage";
import { fetchIngredientNutrition } from "../utils/foodFacts";

export const usePantry = (uid) => {
  const [pantry, setPantry] = useState([]);
  const [groceryList, setGroceryList] = useState([]);
  const [nutritionLoading, setNutritionLoading] = useState(false);

  useEffect(() => {
    if (!uid) return;
    setPantry(getPantry(uid));
    setGroceryList(getGroceryList(uid));
  }, [uid]);

  const addItem = (name, quantity, unit) => {
    const existing = pantry.find((item) => item.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      const updated = pantry.map((item) =>
        item.name.toLowerCase() === name.toLowerCase() ? { ...item, quantity, unit } : item
      );
      setPantry(updated);
      savePantry(uid, updated);
    } else {
      const id = crypto.randomUUID();
      const newItem = { id, name, quantity, unit, nutrition: null, addedAt: new Date().toISOString() };
      const withNew = [...pantry, newItem];
      setPantry(withNew);
      savePantry(uid, withNew);

      // Fetch nutrition in background
      setNutritionLoading(true);
      fetchIngredientNutrition(name).then((nutrition) => {
        setNutritionLoading(false);
        if (!nutrition) return;
        setPantry((current) => {
          const enriched = current.map((item) => item.id === id ? { ...item, nutrition } : item);
          savePantry(uid, enriched);
          return enriched;
        });
      });
    }
  };

  const removeItem = (id) => {
    const updated = pantry.filter((item) => item.id !== id);
    setPantry(updated);
    savePantry(uid, updated);
  };

  const updateQuantity = (id, quantity) => {
    const updated = pantry.map((item) => item.id === id ? { ...item, quantity } : item);
    setPantry(updated);
    savePantry(uid, updated);
  };

  const toggleLow = (id) => {
    const updated = pantry.map((i) => i.id === id ? { ...i, low: !i.low } : i);
    setPantry(updated);
    savePantry(uid, updated);
  };

  const addToGroceryList = (name, unit = "") => {
    if (groceryList.find((g) => g.name.toLowerCase() === name.toLowerCase())) return;
    const updated = [...groceryList, { id: crypto.randomUUID(), name, unit, checked: false, addedAt: new Date().toISOString() }];
    setGroceryList(updated);
    saveGroceryList(uid, updated);
  };

  const toggleGroceryItem = (id) => {
    const updated = groceryList.map((item) => item.id === id ? { ...item, checked: !item.checked } : item);
    setGroceryList(updated);
    saveGroceryList(uid, updated);
  };

  const removeGroceryItem = (id) => {
    const updated = groceryList.filter((item) => item.id !== id);
    setGroceryList(updated);
    saveGroceryList(uid, updated);
  };

  const clearCheckedGroceries = () => {
    const updated = groceryList.filter((item) => !item.checked);
    setGroceryList(updated);
    saveGroceryList(uid, updated);
  };

  return { pantry, groceryList, nutritionLoading, addItem, removeItem, updateQuantity, toggleLow, addToGroceryList, toggleGroceryItem, removeGroceryItem, clearCheckedGroceries };
};