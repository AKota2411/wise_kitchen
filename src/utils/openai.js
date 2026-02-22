const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const getMealSuggestion = async (pantry, preferences) => {
  const pantryList = pantry
    .map((item) => `${item.name} (${item.quantity} ${item.unit})`)
    .join(", ");

  const cuisines = preferences.cuisines.length
    ? preferences.cuisines.join(", ")
    : "any";

  const restrictions = preferences.restrictions.length
    ? preferences.restrictions.join(", ")
    : "none";

  const allergies = preferences.allergies.length
    ? preferences.allergies.join(", ")
    : "none";

  const goals = `
    - Calories: ${preferences.calorieGoal || "not specified"}
    - Protein: ${preferences.proteinGoal || "not specified"}g
    - Carbs: ${preferences.carbGoal || "not specified"}g
    - Fat: ${preferences.fatGoal || "not specified"}g
  `.trim();

  const prompt = `
You are a helpful personal chef AI. Based on the user's pantry and preferences, suggest one meal they can make.

Pantry ingredients available:
${pantryList || "No ingredients listed"}

User preferences:
- Favorite cuisines: ${cuisines}
- Dietary restrictions: ${restrictions}
- Allergies: ${allergies}
- Daily nutritional goals:
${goals}

Respond ONLY with a valid JSON object in this exact format, no extra text:
{
  "name": "Meal name",
  "servings": 2,
  "pantryItemsUsed": ["item1", "item2"],
  "steps": [
    "Step 1 description",
    "Step 2 description"
  ],
  "nutrition": {
    "calories": 450,
    "protein": 35,
    "carbs": 40,
    "fat": 12
  },
  "notes": "Optional short note about the meal or substitutions"
}
`.trim();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch meal suggestion. Check your API key.");
  }

  const data = await response.json();
  const raw = data.choices[0].message.content;

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("AI returned an unexpected format. Please try again.");
  }
};