const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY;
const BASE_URL = "https://api.nal.usda.gov/fdc/v1";

// USDA nutrient IDs - these are fixed and reliable
// 1008 = Energy (kcal), 1003 = Protein, 1005 = Carbohydrate by difference, 1004 = Total lipid (fat)
const NUTRIENT_IDS = {
  calories: 1008,
  protein: 1003,
  carbs: 1005,
  fat: 1004,
};

export const fetchIngredientNutrition = async (ingredientName) => {
  if (!USDA_API_KEY) return null;

  try {
    // Append "raw" to bias toward uncooked ingredient data
    const query = `${ingredientName} raw`;

    const response = await fetch(
      `${BASE_URL}/foods/search?query=${encodeURIComponent(query)}&dataType=Foundation,SR%20Legacy&pageSize=5&api_key=${USDA_API_KEY}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    let foods = data.foods || [];

    // Fallback: broader search without raw qualifier
    if (foods.length === 0) {
      const fallback = await fetch(
        `${BASE_URL}/foods/search?query=${encodeURIComponent(ingredientName)}&dataType=Foundation,SR%20Legacy&pageSize=5&api_key=${USDA_API_KEY}`
      );
      if (!fallback.ok) return null;
      const fallbackData = await fallback.json();
      foods = fallbackData.foods || [];
    }

    if (foods.length === 0) return null;

    // Pick the best match — prefer items whose description closely matches the ingredient name
    const nameLower = ingredientName.toLowerCase();
    const best = foods.find((f) =>
      f.description?.toLowerCase().includes(nameLower)
    ) || foods[0];

    return extractNutrients(best);
  } catch {
    return null;
  }
};

const extractNutrients = (food) => {
  const nutrients = food.foodNutrients || [];

  // Use exact nutrient IDs for precision
  const findById = (id) => {
    const match = nutrients.find((n) => n.nutrientId === id);
    return match ? Math.round((match.value || 0) * 10) / 10 : 0;
  };

  // Some USDA responses use nutrientNumber (string) instead of nutrientId
  const findByNumber = (id) => {
    const match = nutrients.find(
      (n) => String(n.nutrientNumber) === String(id)
    );
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