import { useState } from "react";
import { getMealSuggestion } from "../utils/openai";
import { getPreferences } from "../utils/storage";

const Meals = ({ pantry }) => {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMeal = async () => {
    if (pantry.length === 0) {
      setError("Your pantry is empty. Add some ingredients first.");
      return;
    }

    setLoading(true);
    setError("");
    setMeal(null);

    try {
      const preferences = getPreferences();
      const result = await getMealSuggestion(pantry, preferences);
      setMeal(result);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "700px", margin: "0 auto" }}>
      <h2>Meal Suggestions</h2>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        Based on what's in your pantry and your preferences, we'll suggest a meal you can make right now.
      </p>

      <button
        onClick={fetchMeal}
        disabled={loading}
        style={{
          padding: "0.65rem 1.5rem",
          borderRadius: "6px",
          background: loading ? "#aaa" : "#2d6a4f",
          color: "white",
          border: "none",
          cursor: loading ? "default" : "pointer",
          fontWeight: "bold",
          fontSize: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {loading ? "Finding a meal..." : meal ? "🔄 Suggest Another" : "✨ Suggest a Meal"}
      </button>

      {error && (
        <p style={{ color: "#e63946", marginBottom: "1rem" }}>{error}</p>
      )}

      {loading && (
        <div style={{ color: "#888", fontStyle: "italic" }}>
          Thinking up something delicious...
        </div>
      )}

      {meal && !loading && (
        <div style={{
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          {/* Header */}
          <div style={{
            background: "#2d6a4f",
            color: "white",
            padding: "1.25rem 1.5rem",
          }}>
            <h3 style={{ margin: 0, fontSize: "1.3rem" }}>{meal.name}</h3>
            <p style={{ margin: "0.25rem 0 0", opacity: 0.85, fontSize: "0.9rem" }}>
              Serves {meal.servings}
            </p>
          </div>

          <div style={{ padding: "1.5rem" }}>

            {/* Pantry Items Used */}
            <section style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ marginBottom: "0.5rem", color: "#2d6a4f" }}>🛒 Pantry Items Used</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {meal.pantryItemsUsed.map((item, i) => (
                  <span key={i} style={{
                    background: "#e8f5e9",
                    color: "#2d6a4f",
                    borderRadius: "20px",
                    padding: "0.2rem 0.75rem",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            </section>

            {/* Nutrition */}
            <section style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ marginBottom: "0.75rem", color: "#2d6a4f" }}>📊 Nutrition Per Serving</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                {[
                  { label: "Calories", value: `${meal.nutrition.calories} kcal` },
                  { label: "Protein", value: `${meal.nutrition.protein}g` },
                  { label: "Carbs", value: `${meal.nutrition.carbs}g` },
                  { label: "Fat", value: `${meal.nutrition.fat}g` },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    textAlign: "center",
                    background: "#f9f9f9",
                    borderRadius: "8px",
                    padding: "0.75rem 0.5rem",
                  }}>
                    <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#333" }}>{value}</div>
                    <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.15rem" }}>{label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recipe Steps */}
            <section style={{ marginBottom: meal.notes ? "1.5rem" : 0 }}>
              <h4 style={{ marginBottom: "0.75rem", color: "#2d6a4f" }}>👨‍🍳 Recipe Steps</h4>
              <ol style={{ paddingLeft: "1.25rem", margin: 0 }}>
                {meal.steps.map((step, i) => (
                  <li key={i} style={{ marginBottom: "0.6rem", lineHeight: "1.5", color: "#333" }}>
                    {step}
                  </li>
                ))}
              </ol>
            </section>

            {/* Notes */}
            {meal.notes && (
              <section style={{
                marginTop: "1rem",
                background: "#fffde7",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                fontSize: "0.9rem",
                color: "#555",
              }}>
                💡 {meal.notes}
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Meals;