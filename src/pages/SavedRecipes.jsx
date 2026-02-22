import { useState, useEffect } from "react";
import { getSavedRecipes, deleteRecipe, updateRecipeNotes } from "../utils/storage";
import { S, colors } from "../styles";

const SavedRecipes = ({ uid, pantry, updateQuantity, toggleLow, addToGroceryList }) => {
  const [recipes, setRecipes] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [editingNotes, setEditingNotes] = useState({});
  const [showMadeIt, setShowMadeIt] = useState({});
  const [pantryEdits, setPantryEdits] = useState({});
  const [madeItConfirmed, setMadeItConfirmed] = useState({});
  const [showGroceryPopup, setShowGroceryPopup] = useState(null);

  useEffect(() => { setRecipes(getSavedRecipes(uid)); }, [uid]);

  const handleDelete = (name) => { deleteRecipe(uid, name); setRecipes(getSavedRecipes(uid)); if (expanded === name) setExpanded(null); };
  const handleSaveNotes = (name) => { updateRecipeNotes(uid, name, editingNotes[name]); setRecipes(getSavedRecipes(uid)); };

  const toggleExpand = (name) => {
    if (expanded === name) { setExpanded(null); return; }
    setExpanded(name);
    const r = recipes.find((r) => r.name === name);
    if (r?.userNotes !== undefined) setEditingNotes((p) => ({ ...p, [name]: r.userNotes }));
  };

  const getMatchedPantryItems = (recipe) => {
    if (!recipe || !pantry) return [];
    return pantry.filter((p) =>
      recipe.pantryItemsUsed.some((u) => p.name.toLowerCase().includes(u.toLowerCase()) || u.toLowerCase().includes(p.name.toLowerCase()))
    );
  };

  const handleMadeIt = (recipe) => {
    const matched = getMatchedPantryItems(recipe);
    const init = {};
    matched.forEach((i) => { init[i.id] = i.quantity; });
    setPantryEdits((p) => ({ ...p, [recipe.name]: init }));
    setShowMadeIt((p) => ({ ...p, [recipe.name]: true }));
    setMadeItConfirmed((p) => ({ ...p, [recipe.name]: false }));
  };

  const handleConfirmMadeIt = (recipe) => {
    getMatchedPantryItems(recipe).forEach((item) => {
      const newQty = pantryEdits[recipe.name]?.[item.id];
      if (newQty !== undefined && newQty !== item.quantity) {
        updateQuantity(item.id, newQty);
        if (newQty === 0 && !item.low) setShowGroceryPopup(item);
      }
    });
    setShowMadeIt((p) => ({ ...p, [recipe.name]: false }));
    setMadeItConfirmed((p) => ({ ...p, [recipe.name]: true }));
  };

  return (
    <div style={S.page}>
      <h2 style={{ color: colors.textPrimary, marginBottom: "0.25rem" }}>Saved Recipes</h2>
      <p style={{ color: colors.textMuted, marginBottom: "1.5rem", fontSize: "0.9rem" }}>Your saved meals with personal notes.</p>

      {recipes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: colors.textMuted }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📖</div>
          <p>No saved recipes yet. Suggest a meal and save it to see it here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {recipes.map((recipe) => {
            const matchedItems = getMatchedPantryItems(recipe);
            const isOpen = expanded === recipe.name;

            return (
              <div key={recipe.name} style={S.card}>
                {/* Header */}
                <div onClick={() => toggleExpand(recipe.name)} style={isOpen ? S.cardHeaderActive : S.cardHeaderAlt}>
                  <div>
                    <strong style={{ fontSize: "1rem" }}>{recipe.name}</strong>
                    <span style={{ marginLeft: "0.75rem", fontSize: "0.78rem", opacity: 0.65 }}>Serves {recipe.servings}</span>
                  </div>
                  <span style={{ fontSize: "0.82rem", opacity: 0.8 }}>{isOpen ? "▲ Collapse" : "▼ Expand"}</span>
                </div>

                {isOpen && (
                  <div style={S.cardBody}>
                    {/* Pantry tags */}
                    <div style={S.section}>
                      <h4 style={S.sectionTitle}>🛒 Pantry Items Used</h4>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                        {recipe.pantryItemsUsed.map((item, i) => <span key={i} style={S.tag}>{item}</span>)}
                      </div>
                    </div>

                    {/* Ingredients */}
                    {recipe.ingredients?.length > 0 && (
                      <div style={S.section}>
                        <h4 style={S.sectionTitle}>🧂 Ingredients</h4>
                        <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
                          {recipe.ingredients.map((ing, i) => <li key={i} style={{ marginBottom: "0.35rem", color: colors.textSecondary, lineHeight: 1.5 }}>{ing}</li>)}
                        </ul>
                      </div>
                    )}

                    {/* Nutrition */}
                    <div style={S.section}>
                      <h4 style={S.sectionTitle}>📊 Nutrition Per Serving</h4>
                      <div style={S.nutritionGrid}>
                        {[["Calories", `${recipe.nutrition.calories} kcal`], ["Protein", `${recipe.nutrition.protein}g`], ["Carbs", `${recipe.nutrition.carbs}g`], ["Fat", `${recipe.nutrition.fat}g`]].map(([label, value]) => (
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
                        {recipe.steps.map((step, i) => <li key={i} style={{ marginBottom: "0.5rem", color: colors.textSecondary, lineHeight: 1.55 }}>{step}</li>)}
                      </ol>
                    </div>

                    {/* AI notes */}
                    {recipe.notes && <div style={{ ...S.aiNotes, ...S.section }}>💡 {recipe.notes}</div>}

                    {/* Personal notes */}
                    <div style={S.section}>
                      <h4 style={S.sectionTitle}>📝 Your Notes</h4>
                      <textarea value={editingNotes[recipe.name] ?? recipe.userNotes ?? ""} onChange={(e) => setEditingNotes((p) => ({ ...p, [recipe.name]: e.target.value }))} placeholder="Add or edit your personal notes..." rows={3} style={S.textarea} />
                      <button onClick={() => handleSaveNotes(recipe.name)} style={{ ...S.btnPrimary, marginTop: "0.5rem", fontSize: "0.85rem" }}>Save Notes</button>
                    </div>

                    {/* Made it? */}
                    <div style={S.divider}>
                      {!madeItConfirmed[recipe.name] ? (
                        <>
                          <p style={{ fontWeight: "600", marginBottom: "0.75rem", color: colors.textPrimary }}>Did you make this meal?</p>
                          <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button onClick={() => handleMadeIt(recipe)} style={S.btnPrimary}>Yes, I made it!</button>
                            <button onClick={() => setMadeItConfirmed((p) => ({ ...p, [recipe.name]: true }))} style={S.btnSecondary}>Not yet</button>
                          </div>
                        </>
                      ) : (
                        <p style={{ color: colors.success, fontWeight: "600" }}>✓ Pantry updated!</p>
                      )}
                    </div>

                    {/* Quantity editor */}
                    {showMadeIt[recipe.name] && matchedItems.length > 0 && (
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
                                <td style={S.td}><input type="number" min={0} max={item.quantity} value={pantryEdits[recipe.name]?.[item.id] ?? item.quantity} onChange={(e) => setPantryEdits((p) => ({ ...p, [recipe.name]: { ...p[recipe.name], [item.id]: Math.max(0, Math.min(item.quantity, Number(e.target.value))) } }))} style={{ ...S.input, width: "65px", padding: "0.25rem 0.4rem" }} /></td>
                                <td style={{ ...S.td, color: colors.textMuted }}>{item.unit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button onClick={() => handleConfirmMadeIt(recipe)} style={{ ...S.btnPrimary, marginTop: "1rem" }}>Confirm & Update Pantry</button>
                      </div>
                    )}

                    {/* Delete */}
                    <div style={{ marginTop: "1.5rem" }}>
                      <button onClick={() => handleDelete(recipe.name)} style={S.btnDanger}>Delete Recipe</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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

export default SavedRecipes;