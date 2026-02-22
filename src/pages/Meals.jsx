import { useState, useEffect } from "react";
import { getMealSuggestion } from "../utils/openai";
import { getPreferences, getSavedRecipes, saveRecipe } from "../utils/storage";

const Meals = ({ pantry, updateQuantity, toggleLow, addToGroceryList }) => {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userNotes, setUserNotes] = useState("");
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [justSaved, setJustSaved] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false);
  const [showMadeIt, setShowMadeIt] = useState(false);
  const [pantryEdits, setPantryEdits] = useState({});
  const [madeItConfirmed, setMadeItConfirmed] = useState(false);
  const [showGroceryPopup, setShowGroceryPopup] = useState(null);

  useEffect(() => {
    setSavedRecipes(getSavedRecipes());
  }, []);

  const fetchMeal = async () => {
    if (pantry.length === 0) {
      setError("Your pantry is empty. Add some ingredients first.");
      return;
    }
    setLoading(true);
    setError("");
    setMeal(null);
    setUserNotes("");
    setJustSaved(false);
    setAlreadySaved(false);
    setShowMadeIt(false);
    setMadeItConfirmed(false);
    setPantryEdits({});

    try {
      const preferences = getPreferences();
      const result = await getMealSuggestion(pantry, preferences, savedRecipes);
      setMeal(result);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!meal) return;
    const existing = savedRecipes.find((r) => r.name === meal.name);
    if (existing) { setAlreadySaved(true); return; }
    const recipeToSave = { ...meal, userNotes };
    saveRecipe(recipeToSave);
    setSavedRecipes(getSavedRecipes());
    setJustSaved(true);
  };

  const getMatchedPantryItems = () => {
    if (!meal) return [];
    return pantry.filter((pantryItem) =>
      meal.pantryItemsUsed.some((used) =>
        pantryItem.name.toLowerCase().includes(used.toLowerCase()) ||
        used.toLowerCase().includes(pantryItem.name.toLowerCase())
      )
    );
  };

  const handleMadeIt = () => {
    const matched = getMatchedPantryItems();
    const initial = {};
    matched.forEach((item) => { initial[item.id] = item.quantity; });
    setPantryEdits(initial);
    setShowMadeIt(true);
  };

  const handleQuantityEdit = (id, value, max) => {
    const clamped = Math.max(0, Math.min(max, Number(value)));
    setPantryEdits((prev) => ({ ...prev, [id]: clamped }));
  };

  const handleConfirmMadeIt = () => {
    const matched = getMatchedPantryItems();
    matched.forEach((item) => {
      const newQty = pantryEdits[item.id];
      if (newQty !== item.quantity) {
        updateQuantity(item.id, newQty);
        if (newQty === 0 && !item.low) {
          setShowGroceryPopup(item);
        }
      }
    });
    setShowMadeIt(false);
    setMadeItConfirmed(true);
  };

  const matchedItems = getMatchedPantryItems();

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

      {error && <p style={{ color: "#e63946", marginBottom: "1rem" }}>{error}</p>}
      {loading && <div style={{ color: "#888", fontStyle: "italic" }}>Thinking up something delicious...</div>}

      {meal && !loading && (
        <div style={{ border: "1px solid #e0e0e0", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ background: "#2d6a4f", color: "white", padding: "1.25rem 1.5rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.3rem" }}>{meal.name}</h3>
            <p style={{ margin: "0.25rem 0 0", opacity: 0.85, fontSize: "0.9rem" }}>Serves {meal.servings}</p>
          </div>

          <div style={{ padding: "1.5rem" }}>

            <section style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ marginBottom: "0.5rem", color: "#2d6a4f" }}>🛒 Pantry Items Used</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {meal.pantryItemsUsed.map((item, i) => (
                  <span key={i} style={{ background: "#e8f5e9", color: "#2d6a4f", borderRadius: "20px", padding: "0.2rem 0.75rem", fontSize: "0.85rem", fontWeight: "500" }}>
                    {item}
                  </span>
                ))}
              </div>
            </section>

            {meal.ingredients && meal.ingredients.length > 0 && (
              <section style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ marginBottom: "0.75rem", color: "#2d6a4f" }}>🧂 Ingredients</h4>
                <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
                  {meal.ingredients.map((ingredient, i) => (
                    <li key={i} style={{ marginBottom: "0.4rem", color: "#333", lineHeight: "1.5" }}>{ingredient}</li>
                  ))}
                </ul>
              </section>
            )}

            <section style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ marginBottom: "0.75rem", color: "#2d6a4f" }}>📊 Nutrition Per Serving</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                {[
                  { label: "Calories", value: `${meal.nutrition.calories} kcal` },
                  { label: "Protein", value: `${meal.nutrition.protein}g` },
                  { label: "Carbs", value: `${meal.nutrition.carbs}g` },
                  { label: "Fat", value: `${meal.nutrition.fat}g` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ textAlign: "center", background: "#f9f9f9", borderRadius: "8px", padding: "0.75rem 0.5rem" }}>
                    <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#333" }}>{value}</div>
                    <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.15rem" }}>{label}</div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ marginBottom: "0.75rem", color: "#2d6a4f" }}>👨‍🍳 Recipe Steps</h4>
              <ol style={{ paddingLeft: "1.25rem", margin: 0 }}>
                {meal.steps.map((step, i) => (
                  <li key={i} style={{ marginBottom: "0.6rem", lineHeight: "1.5", color: "#333" }}>{step}</li>
                ))}
              </ol>
            </section>

            {meal.notes && (
              <section style={{ marginBottom: "1.5rem", background: "#fffde7", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.9rem", color: "#555" }}>
                💡 {meal.notes}
              </section>
            )}

            <section style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ marginBottom: "0.5rem", color: "#2d6a4f" }}>📝 Your Notes</h4>
              <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: "0.5rem" }}>
                Made any modifications? Write them down before saving.
              </p>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="e.g. Used Greek yogurt instead of sour cream, added extra garlic..."
                rows={4}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc", fontSize: "0.9rem", resize: "vertical", boxSizing: "border-box", fontFamily: "sans-serif" }}
              />
            </section>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <button
                onClick={handleSave}
                disabled={justSaved}
                style={{ padding: "0.6rem 1.25rem", borderRadius: "6px", background: justSaved ? "#52b788" : "#2d6a4f", color: "white", border: "none", cursor: justSaved ? "default" : "pointer", fontWeight: "bold", fontSize: "0.95rem" }}
              >
                {justSaved ? "✓ Recipe Saved!" : "Save Recipe"}
              </button>
              {alreadySaved && <span style={{ color: "#e07b00", fontSize: "0.85rem" }}>This recipe is already saved.</span>}
            </div>

            {!madeItConfirmed ? (
              <div style={{ borderTop: "1px solid #eee", paddingTop: "1.5rem" }}>
                <p style={{ fontWeight: "600", marginBottom: "0.75rem", color: "#333" }}>
                  Did you make this meal?
                </p>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={handleMadeIt}
                    style={{ padding: "0.5rem 1.25rem", borderRadius: "6px", background: "#2d6a4f", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
                  >
                    Yes, I made it!
                  </button>
                  <button
                    onClick={() => setMadeItConfirmed(true)}
                    style={{ padding: "0.5rem 1.25rem", borderRadius: "6px", background: "#eee", color: "#333", border: "none", cursor: "pointer" }}
                  >
                    Not yet
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ borderTop: "1px solid #eee", paddingTop: "1rem", color: "#52b788", fontWeight: "600" }}>
                ✓ Pantry updated!
              </div>
            )}

            {showMadeIt && matchedItems.length > 0 && (
              <div style={{ marginTop: "1.5rem", background: "#f9f9f9", borderRadius: "10px", padding: "1.25rem" }}>
                <h4 style={{ marginBottom: "0.5rem", color: "#2d6a4f" }}>Update your pantry quantities</h4>
                <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: "1rem" }}>
                  Adjust how much of each ingredient you used. You can only reduce quantities.
                </p>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>
                      <th style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem", color: "#555" }}>Item</th>
                      <th style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem", color: "#555" }}>Current</th>
                      <th style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem", color: "#555" }}>Remaining</th>
                      <th style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem", color: "#555" }}>Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchedItems.map((item) => (
                      <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "0.5rem" }}>{item.name}</td>
                        <td style={{ padding: "0.5rem", color: "#888" }}>{item.quantity}</td>
                        <td style={{ padding: "0.5rem" }}>
                          <input
                            type="number"
                            min={0}
                            max={item.quantity}
                            value={pantryEdits[item.id] ?? item.quantity}
                            onChange={(e) => handleQuantityEdit(item.id, e.target.value, item.quantity)}
                            style={{ width: "65px", padding: "0.25rem", borderRadius: "4px", border: "1px solid #ccc" }}
                          />
                        </td>
                        <td style={{ padding: "0.5rem", color: "#888" }}>{item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={handleConfirmMadeIt}
                  style={{ marginTop: "1rem", padding: "0.5rem 1.25rem", borderRadius: "6px", background: "#2d6a4f", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
                >
                  Confirm & Update Pantry
                </button>
              </div>
            )}

            {showMadeIt && matchedItems.length === 0 && (
              <p style={{ marginTop: "1rem", color: "#888", fontSize: "0.9rem" }}>
                No matching pantry items found for this recipe's ingredients.
              </p>
            )}

          </div>
        </div>
      )}

      {showGroceryPopup && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "12px", padding: "2rem", maxWidth: "360px", width: "90%", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            <h3 style={{ marginBottom: "0.5rem" }}>Add to Grocery List?</h3>
            <p style={{ color: "#555", marginBottom: "1.5rem" }}>
              <strong>{showGroceryPopup.name}</strong> is now out. Do you want to add it to your grocery list?
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={() => { addToGroceryList(showGroceryPopup.name, showGroceryPopup.unit); toggleLow(showGroceryPopup.id); setShowGroceryPopup(null); }}
                style={{ padding: "0.5rem 1.25rem", borderRadius: "6px", background: "#2d6a4f", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
              >
                Yes, Add It
              </button>
              <button
                onClick={() => setShowGroceryPopup(null)}
                style={{ padding: "0.5rem 1.25rem", borderRadius: "6px", background: "#eee", color: "#333", border: "none", cursor: "pointer" }}
              >
                No Thanks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meals;