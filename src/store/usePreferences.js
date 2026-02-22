import { useState, useEffect } from "react";
import { getPreferences, savePreferences } from "../utils/storage";

export const usePreferences = () => {
  const [preferences, setPreferences] = useState({
    cuisines: [],
    restrictions: [],
    allergies: [],
    calorieGoal: "",
    proteinGoal: "",
    carbGoal: "",
    fatGoal: "",
  });

  useEffect(() => {
    const saved = getPreferences();
    if (saved) setPreferences((prev) => ({ ...prev, ...saved }));
  }, []);

  const updatePreferences = (updated) => {
    const merged = { ...preferences, ...updated };
    setPreferences(merged);
    savePreferences(merged);
  };

  const toggleItem = (field, value) => {
    const current = preferences[field];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updatePreferences({ [field]: updated });
  };

  const addCustomItem = (field, value) => {
    const trimmed = value.trim();
    if (!trimmed || preferences[field].includes(trimmed)) return;
    updatePreferences({ [field]: [...preferences[field], trimmed] });
  };

  const removeItem = (field, value) => {
    updatePreferences({ [field]: preferences[field].filter((v) => v !== value) });
  };

  return {
    preferences,
    updatePreferences,
    toggleItem,
    addCustomItem,
    removeItem,
  };
};