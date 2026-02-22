import { useState, useEffect } from "react";
import {
  getPantry,
  savePantry,
  getGroceryList,
  saveGroceryList,
} from "../utils/storage";
import { fetchIngredientNutrition } from "../utils/foodFacts";

export const usePantry = () => {
  const [pantry, setPantry] = useState([]);
  const [groceryList, setGroceryList] = useState([]);

  useEffect(() => {
    setPantry(getPantry());
    setGroceryList(getGroceryList());
  }, []);

  const addItem = async (name, quantity, unit) => {
    const existing = pantry.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    let updated;
    if (existing) {
      updated = pantry.map((item) =>
        item.name.toLowerCase() === name.toLowerCase()
          ? { ...item, quantity, unit }
          : item
      );
    } else {
      // Fetch nutrition data from Open Food Facts
      const nutrition = await fetchIngredientNutrition(name);

      const newItem = {
        id: crypto.randomUUID(),
        name,
        quantity,
        unit,
        nutrition: nutrition || null,
        addedAt: new Date().toISOString(),
      };
      updated = [...pantry, newItem];
    }

    setPantry(updated);
    savePantry(updated);
  };

  const removeItem = (id) => {
    const updated = pantry.filter((item) => item.id !== id);
    setPantry(updated);
    savePantry(updated);
  };

  const updateQuantity = (id, quantity) => {
    const updated = pantry.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setPantry(updated);
    savePantry(updated);
  };

  const toggleLow = (id) => {
    const updated = pantry.map((i) =>
      i.id === id ? { ...i, low: !i.low } : i
    );
    setPantry(updated);
    savePantry(updated);
  };

  const addToGroceryList = (name, unit = "") => {
    const already = groceryList.find(
      (g) => g.name.toLowerCase() === name.toLowerCase()
    );
    if (already) return;

    const updated = [
      ...groceryList,
      {
        id: crypto.randomUUID(),
        name,
        unit,
        checked: false,
        addedAt: new Date().toISOString(),
      },
    ];
    setGroceryList(updated);
    saveGroceryList(updated);
  };

  const toggleGroceryItem = (id) => {
    const updated = groceryList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setGroceryList(updated);
    saveGroceryList(updated);
  };

  const removeGroceryItem = (id) => {
    const updated = groceryList.filter((item) => item.id !== id);
    setGroceryList(updated);
    saveGroceryList(updated);
  };

  const clearCheckedGroceries = () => {
    const updated = groceryList.filter((item) => !item.checked);
    setGroceryList(updated);
    saveGroceryList(updated);
  };

  return {
    pantry,
    groceryList,
    addItem,
    removeItem,
    updateQuantity,
    toggleLow,
    addToGroceryList,
    toggleGroceryItem,
    removeGroceryItem,
    clearCheckedGroceries,
  };
};