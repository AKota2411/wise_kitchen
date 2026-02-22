import { useState, useEffect } from "react";
import { getMealSuggestion } from "../utils/openai";
import { getPreferences, getSavedRecipes, saveRecipe } from "../utils/storage";
import { S, colors } from "../styles";

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

  useEffect(() => { setSavedRecipes(getSavedRecipes()); }, []);

  const fetchMeal = async () => {
    if (pantry.length === 0) { setError("Your pantry is empty. Add some ingredients first."); return; }
    setLoading(true); setError(""); setMeal(null); setUserNotes("");
    setJustSaved(false); setAlreadySaved(false); setShowMadeIt(false);
    setMadeItConfirmed(false); setPantryEdits({});
    try {
      const result = await getMealSuggestion(pantry, getPreferences(), savedRecipes);
      setMeal(result);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const handleSave = () => {
    if (!meal) return;
    if (savedRecipes.find((r) => r.name === meal.name)) { setAlreadySaved(true); return; }
    saveRecipe({ ...meal, userNotes });
    setSavedRecipes(getSavedRecipes());
    setJustSaved(true);
  };

  const getMatchedPantryItems = () => {
    if (!meal) return [];
    return pantry.filter((p) =>
      meal.pantryItemsUsed.some((u) => p.name.toLowerCase().includes(u.toLowerCase()) || u.toLowerCase().includes(p.name.toLowerCase()))
    );
  };

  const handleMadeIt = () => {
    const matched = getMatchedPantryItems();
    const init = {};
    matched.forEach((i) => { init[i.id] = i.quantity; });
    setPantryEdits(init);
    setShowMadeIt(true);
  };

  const handleConfirmMadeIt = () => {
    getMatchedPantryItems().forEach((item) => {
      const newQty = pantryEdits[item.id];
      if (newQty !== item.quantity) {
        updateQuantity(item.id, newQty);
        if (newQty === 0 && !item.low) setShowGroceryPopup(item);
      }
    });
    setShowMadeIt(false);
    setMadeItConfirmed(true);
  };

  const matchedItems = getMatchedPantryItems();

  return (
    <div style={S.page}>
      <h2 style={{ color: colors.textPrimary, marginBottom: "0.25rem" }}>Meal Suggestions</h2>
      <p style={{ color: colors.textMuted, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        We'll suggest a meal based on what's in your pantry and your preferences.
      </p>

      <button onClick={fetchMeal} disabled={loading} style={loading ? S.btnDisabled : S.btnPrimaryLarge}>
        {loading ? "Finding a meal..." : meal ? "🔄 Suggest Another" : "✨ Suggest a Meal"}
      </button>

      {error && <p style={{ ...S.errorText, marginTop: "1rem" }}>{error}</p>}
      {loading && <p style={{ color: colors.textMuted, fontStyle: "italic", marginTop: "1rem" }}>Thinking up something delicious...</p>}

      {meal && !loading && (
        <div style={{ ...S.card, marginTop: "1.5rem" }}>
          {/* Header */}
          <div style={S.cardHeader}>
            <h3 style={{ margin: 0, fontSize: "1.3rem" }}>{meal.name}</h3>
            <p style={{ margin: "0.2rem 0 0", opacity: 0.8, fontSize: "0.88rem" }}>Serves {meal.servings}</p>
          </div>

          <div style={S.cardBody}>
            {/* Pantry items used */}
            <div style={S.section}>
              <h4 style={S.sectionTitle}>🛒 Pantry Items Used</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {meal.pantryItemsUsed.map((item, i) => <span key={i} style={S.tag}>{item}</span>)}
              </div>
            </div>

            {/* Ingredients */}
            {meal.ingredients?.length > 0 && (
              <div style={S.section}>
                <h4 style={S.sectionTitle}>🧂 Ingredients</h4>
                <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
                  {meal.ingredients.map((ing, i) => <li key={i} style={{ marginBottom: "0.35rem", color: colors.textSecondary, lineHeight: 1.5 }}>{ing}</li>)}
                </ul>
              </div>
            )}

            {/* Nutrition */}
            <div style={S.section}>
              <h4 style={S.sectionTitle}>📊 Nutrition Per Serving</h4>
              <div style={S.nutritionGrid}>
                {[["Calories", `${meal.nutrition.calories} kcal`], ["Protein", `${meal.nutrition.protein}g`], ["Carbs", `${meal.nutrition.carbs}g`], ["Fat", `${meal.nutrition.fat}g`]].map(([label, value]) => (
                  <div key={label} style={S.nutritionCell}>
                    <div style={{ fontWeight: "700", color: colors.textPrimary }}>{value}</div>
                    <div style={{ fontSize: "0.72rem", color: colors.textMuted, marginTop: "0.1rem" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div style={S.section}>
              <h4 style={S.sectionTitle}>👨‍🍳 Recipe Steps</h4>
              <ol style={{ paddingLeft: "1.25rem", margin: 0 }}>
                {meal.steps.map((step, i) => <li key={i} style={{ marginBottom: "0.5rem", color: colors.textSecondary, lineHeight: 1.55 }}>{step}</li>)}
              </ol>
            </div>

            {/* AI notes */}
            {meal.notes && <div style={{ ...S.aiNotes, ...S.section }}>💡 {meal.notes}</div>}

            {/* Personal notes */}
            <div style={S.section}>
              <h4 style={S.sectionTitle}>📝 Your Notes</h4>
              <p style={S.mutedText}>Made modifications? Write them down before saving.</p>
              <textarea value={userNotes} onChange={(e) => setUserNotes(e.target.value)} placeholder="e.g. Used Greek yogurt instead of sour cream..." rows={3} style={S.textarea} />
            </div>

            {/* Save */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <button onClick={handleSave} disabled={justSaved} style={justSaved ? { ...S.btnPrimary, background: colors.primaryLight, cursor: "default" } : S.btnPrimary}>
                {justSaved ? "✓ Recipe Saved!" : "Save Recipe"}
              </button>
              {alreadySaved && <span style={{ color: colors.warning, fontSize: "0.85rem" }}>Already saved.</span>}
            </div>

            {/* Made it? */}
            <div style={S.divider}>
              {!madeItConfirmed ? (
                <>
                  <p style={{ fontWeight: "600", marginBottom: "0.75rem", color: colors.textPrimary }}>Did you make this meal?</p>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button onClick={handleMadeIt} style={S.btnPrimary}>Yes, I made it!</button>
                    <button onClick={() => setMadeItConfirmed(true)} style={S.btnSecondary}>Not yet</button>
                  </div>
                </>
              ) : (
                <p style={{ color: colors.success, fontWeight: "600" }}>✓ Pantry updated!</p>
              )}
            </div>

            {/* Quantity editor */}
            {showMadeIt && matchedItems.length > 0 && (
              <div style={{ background: colors.bgCardAlt, borderRadius: "12px", padding: "1.25rem", marginTop: "1.25rem", border: `1px solid ${colors.primaryXLight}` }}>
                <h4 style={{ ...S.sectionTitle, marginBottom: "0.4rem" }}>Update pantry quantities</h4>
                <p style={S.mutedText}>You can only reduce quantities.</p>
                <table style={S.table}>
                  <thead><tr><th style={S.th}>Item</th><th style={S.th}>Current</th><th style={S.th}>Remaining</th><th style={S.th}>Unit</th></tr></thead>
                  <tbody>
                    {matchedItems.map((item) => (
                      <tr key={item.id}>
                        <td style={S.td}>{item.name}</td>
                        <td style={{ ...S.td, color: colors.textMuted }}>{item.quantity}</td>
                        <td style={S.td}><input type="number" min={0} max={item.quantity} value={pantryEdits[item.id] ?? item.quantity} onChange={(e) => setPantryEdits((p) => ({ ...p, [item.id]: Math.max(0, Math.min(item.quantity, Number(e.target.value))) }))} style={{ ...S.input, width: "65px", padding: "0.25rem 0.4rem" }} /></td>
                        <td style={{ ...S.td, color: colors.textMuted }}>{item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={handleConfirmMadeIt} style={{ ...S.btnPrimary, marginTop: "1rem" }}>Confirm & Update Pantry</button>
              </div>
            )}
            {showMadeIt && matchedItems.length === 0 && <p style={{ ...S.mutedText, marginTop: "1rem" }}>No matching pantry items found.</p>}
          </div>
        </div>
      )}

      {/* Grocery popup */}
      {showGroceryPopup && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🛒</div>
            <h3 style={{ marginBottom: "0.5rem", color: colors.textPrimary }}>Add to Grocery List?</h3>
            <p style={{ color: colors.textSecondary, marginBottom: "1.5rem" }}><strong>{showGroceryPopup.name}</strong> is now out.</p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button onClick={() => { addToGroceryList(showGroceryPopup.name, showGroceryPopup.unit); toggleLow(showGroceryPopup.id); setShowGroceryPopup(null); }} style={S.btnPrimary}>Yes, Add It</button>
              <button onClick={() => setShowGroceryPopup(null)} style={S.btnSecondary}>No Thanks</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meals;