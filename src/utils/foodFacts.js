const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY;
const BASE_URL = "https://api.nal.usda.gov/fdc/v1";

const NUTRIENT_IDS = {
  calories: 1008,
  protein: 1003,
  carbs: 1005,
  fat: 1004,
};

export const fetchIngredientNutrition = async (ingredientName) => {
  console.log("[foodFacts] fetching for:", ingredientName);
  console.log("[foodFacts] API key present:", !!USDA_API_KEY);

  if (!USDA_API_KEY) {
    console.warn("[foodFacts] No USDA API key found — skipping nutrition lookup");
    return null;
  }

  try {
    const query = `${ingredientName} raw`;
    const url = `${BASE_URL}/foods/search?query=${encodeURIComponent(query)}&dataType=Foundation,SR%20Legacy&pageSize=5&api_key=${USDA_API_KEY}`;
    console.log("[foodFacts] requesting:", url.replace(USDA_API_KEY, "KEY_HIDDEN"));

    const response = await fetch(url);
    console.log("[foodFacts] response status:", response.status);

    if (!response.ok) return null;

    const data = await response.json();
    const foods = data.foods || [];
    console.log("[foodFacts] results found:", foods.length);

    if (foods.length === 0) {
      // Fallback without raw qualifier
      const fallback = await fetch(
        `${BASE_URL}/foods/search?query=${encodeURIComponent(ingredientName)}&dataType=Foundation,SR%20Legacy&pageSize=5&api_key=${USDA_API_KEY}`
      );
      if (!fallback.ok) return null;
      const fallbackData = await fallback.json();
      const fallbackFoods = fallbackData.foods || [];
      console.log("[foodFacts] fallback results:", fallbackFoods.length);
      if (fallbackFoods.length === 0) return null;
      return extractNutrients(fallbackFoods[0]);
    }

    const nameLower = ingredientName.toLowerCase();
    const best = foods.find((f) => f.description?.toLowerCase().includes(nameLower)) || foods[0];
    console.log("[foodFacts] best match:", best.description);

    const result = extractNutrients(best);
    console.log("[foodFacts] extracted nutrition:", result);
    return result;
  } catch (err) {
    console.error("[foodFacts] error:", err);
    return null;
  }
};

const extractNutrients = (food) => {
  const nutrients = food.foodNutrients || [];

  const findById = (id) => {
    const match = nutrients.find((n) => n.nutrientId === id);
    return match ? Math.round((match.value || 0) * 10) / 10 : 0;
  };

  const findByNumber = (id) => {
    const match = nutrients.find((n) => String(n.nutrientNumber) === String(id));
    return match ? Math.round((match.value || 0) * 10) / 10 : 0;
  };

  const get = (id) => findById(id) || findByNumber(id);

  return {
    per100g: {
      calories: Math.round(get(NUTRIENT_IDS.calories)),
      protein: get(NUTRIENT_IDS.protein),
      carbs: get(NUTRIENT_IDS.carbs),
      fat: get(NUTRIENT_IDS.fat),
    },
    source: food.description || "",
  };
};