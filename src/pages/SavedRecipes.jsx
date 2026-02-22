import { useState, useEffect } from "react";
import { getSavedRecipes, deleteRecipe, updateRecipeNotes } from "../utils/storage";

const SavedRecipes = ({ pantry, updateQuantity, toggleLow, addToGroceryList }) => {
  const [recipes, setRecipes] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [editingNotes, setEditingNotes] = useState({});
  const [showMadeIt, setShowMadeIt] = useState({});
  const [pantryEdits, setPantryEdits] = useState({});
  const [madeItConfirmed, setMadeItConfirmed] = useState({});
  const [showGroceryPopup, setShowGroceryPopup] = useState(null);

  useEffect(() => {
    setRecipes(getSavedRecipes());
  }, []);

  const handleDelete = (name) => {
    deleteRecipe(name);
    setRecipes(getSavedRecipes());
    if (expanded === name) setExpanded(null);
  };

  const handleNotesChange = (name, value) => {
    setEditingNotes((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNotes = (name) => {
    updateRecipeNotes(name, editingNotes[name]);
    setRecipes(getSavedRecipes());
  };

  const toggleExpand = (name) => {
    if (expanded === name) {
      setExpanded(null);
    } else {
      setExpanded(name);
      const recipe = recipes.find((r) => r.name === name);
      if (recipe && recipe.userNotes !== undefined) {
        setEditingNotes((prev) => ({ ...prev, [name]: recipe.userNotes }));
      }
    }
  };

  const getMatchedPantryItems = (recipe) => {
    if (!recipe || !pantry) return [];
    return pantry.filter((pantryItem) =>
      recipe.pantryItemsUsed.some((used) =>
        pantryItem.name.toLowerCase().includes(used.toLowerCase()) ||
        used.toLowerCase().includes(pantryItem.name.toLowerCase())
      )
    );
  };

  const handleMadeIt = (recipe) => {
    const matched = getMatchedPantryItems(recipe);
    const initial = {};
    matched.forEach((item) => { initial[item.id] = item.quantity; });
    setPantryEdits((prev) => ({ ...prev, [recipe.name]: initial }));
    setShowMadeIt((prev) => ({ ...prev, [recipe.name]: true }));
    setMadeItConfirmed((prev) => ({ ...prev, [recipe.name]: false }));
  };

  const handleQuantityEdit = (recipeName, id, value, max) => {
    const clamped = Math.max(0, Math.min(max, Number(value)));
    setPantryEdits((prev) => ({
      ...prev,
      [recipeName]: { ...prev[recipeName], [id]: clamped },
    }));
  };

  const handleConfirmMadeIt = (recipe) => {
    const matched = getMatchedPantryItems(recipe);
    matched.forEach((item) => {
      const newQty = pantryEdits[recipe.name]?.[item.id];
      if (newQty !== undefined && newQty !== item.quantity) {
        updateQuantity(item.id, newQty);
        if (newQty === 0 && !item.low) {
          setShowGroceryPopup(item);
        }
      }
    });
    setShowMadeIt((prev) => ({ ...prev, [recipe.name]: false }));
    setMadeItConfirmed((prev) => ({ ...prev, [recipe.name]: true }));
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "700px", margin: "0 auto" }}>
      <h2>Saved Recipes</h2>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        Your saved meals with personal notes and modifications.
      </p>

      {recipes.length === 0 ? (
        <p style={{ color: "#888" }}>No saved recipes yet. Suggest a meal and save it to see it here.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {recipes.map((recipe) => {
            const matchedItems = getMatchedPantryItems(recipe);
            const isMadeItShown = showMadeIt[recipe.name];
            const isMadeItConfirmed = madeItConfirmed[recipe.name];

            return (
              <div key={recipe.name} style={{ border: "1px solid #e0e0e0", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div
                  onClick={() => toggleExpand(recipe.name)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", background: expanded === recipe.name ? "#2d6a4f" : "#f9f9f9", color: expanded === recipe.name ? "white" : "#333", cursor: "pointer" }}
                >
                  <div>
                    <strong style={{ fontSize: "1rem" }}>{recipe.name}</strong>
                    <span style={{ marginLeft: "0.75rem", fontSize: "0.8rem", opacity: 0.7 }}>Serves {recipe.servings}</span>
                  </div>
                  <span style={{ fontSize: "0.85rem" }}>{expanded === recipe.name ? "▲ Collapse" : "▼ Expand"}</span>
                </div>

                {expanded === recipe.name && (
                  <div style={{ padding: "1.5rem" }}>

                    <section style={{ marginBottom: "1.5rem" }}>
                      <h4 style={{ marginBottom: "0.5rem", color: "#2d6a4f" }}>🛒 Pantry Items Used</h4>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {recipe.pantryItemsUsed.map((item, i) => (
                          <span key={i} style={{ background: "#e8f5e9", color: "#2d6a4f", borderRadius: "20px", padding: "0.2rem 0.75rem", fontSize: "0.85rem", fontWeight: "500" }}>{item}</span>
                        ))}
                      </div>
                    </section>

                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                      <section style={{ marginBottom: "1.5rem" }}>
                        <h4 style={{ marginBottom: "0.75rem", color: "#2d6a4f" }}>🧂 Ingredients</h4>
                        <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
                          {recipe.ingredients.map((ingredient, i) => (
                            <li key={i} style={{ marginBottom: "0.4rem", color: "#333", lineHeight: "1.5" }}>{ingredient}</li>
                          ))}
                        </ul>
                      </section>
                    )}

                    <section style={{ marginBottom: "1.5rem" }}>
                      <h4 style={{ marginBottom: "0.75rem", color: "#2d6a4f" }}>📊 Nutrition Per Serving</h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                        {[
                          { label: "Calories", value: `${recipe.nutrition.calories} kcal` },
                          { label: "Protein", value: `${recipe.nutrition.protein}g` },
                          { label: "Carbs", value: `${recipe.nutrition.carbs}g` },
                          { label: "Fat", value: `${recipe.nutrition.fat}g` },
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
                        {recipe.steps.map((step, i) => (
                          <li key={i} style={{ marginBottom: "0.6rem", lineHeight: "1.5", color: "#333" }}>{step}</li>
                        ))}
                      </ol>
                    </section>

                    {recipe.notes && (
                      <section style={{ marginBottom: "1.5rem", background: "#fffde7", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.9rem", color: "#555" }}>
                        💡 {recipe.notes}
                      </section>
                    )}

                    <section style={{ marginBottom: "1.5rem" }}>
                      <h4 style={{ marginBottom: "0.5rem", color: "#2d6a4f" }}>📝 Your Notes</h4>
                      <textarea
                        value={editingNotes[recipe.name] ?? recipe.userNotes ?? ""}
                        onChange={(e) => handleNotesChange(recipe.name, e.target.value)}
                        placeholder="Add or edit your personal notes..."
                        rows={4}
                        style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc", fontSize: "0.9rem", resize: "vertical", boxSizing: "border-box", fontFamily: "sans-serif" }}
                      />
                      <button
                        onClick={() => handleSaveNotes(recipe.name)}
                        style={{ marginTop: "0.5rem", padding: "0.4rem 1rem", borderRadius: "6px", background: "#2d6a4f", color: "white", border: "none", cursor: "pointer", fontSize: "0.85rem" }}
                      >
                        Save Notes
                      </button>
                    </section>

                    <div style={{ borderTop: "1px solid #eee", paddingTop: "1.5rem", marginBottom: "1rem" }}>
                      {!isMadeItConfirmed ? (
                        <>
                          <p style={{ fontWeight: "600", marginBottom: "0.75rem", color: "#333" }}>Did you make this meal?</p>
                          <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button
                              onClick={() => handleMadeIt(recipe)}
                              style={{ padding: "0.5rem 1.25rem", borderRadius: "6px", background: "#2d6a4f", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
                            >
                              Yes, I made it!
                            </button>
                            <button
                              onClick={() => setMadeItConfirmed((prev) => ({ ...prev, [recipe.name]: true }))}
                              style={{ padding: "0.5rem 1.25rem", borderRadius: "6px", background: "#eee", color: "#333", border: "none", cursor: "pointer" }}
                            >
                              Not yet
                            </button>
                          </div>
                        </>
                      ) : (
                        <div style={{ color: "#52b788", fontWeight: "600" }}>✓ Pantry updated!</div>
                      )}
                    </div>

                    {isMadeItShown && matchedItems.length > 0 && (
                      <div style={{ background: "#f9f9f9", borderRadius: "10px", padding: "1.25rem", marginBottom: "1.5rem" }}>
                        <h4 style={{ marginBottom: "0.5rem", color: "#2d6a4f" }}>Update your pantry quantities</h4>
                        <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: "1rem" }}>Adjust how much of each ingredient you used. You can only reduce quantities.</p>
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
                                    value={pantryEdits[recipe.name]?.[item.id] ?? item.quantity}
                                    onChange={(e) => handleQuantityEdit(recipe.name, item.id, e.target.value, item.quantity)}
                                    style={{ width: "65px", padding: "0.25rem", borderRadius: "4px", border: "1px solid #ccc" }}
                                  />
                                </td>
                                <td style={{ padding: "0.5rem", color: "#888" }}>{item.unit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button
                          onClick={() => handleConfirmMadeIt(recipe)}
                          style={{ marginTop: "1rem", padding: "0.5rem 1.25rem", borderRadius: "6px", background: "#2d6a4f", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
                        >
                          Confirm & Update Pantry
                        </button>
                      </div>
                    )}

                    {isMadeItShown && matchedItems.length === 0 && (
                      <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "1rem" }}>No matching pantry items found for this recipe.</p>
                    )}

                    <button
                      onClick={() => handleDelete(recipe.name)}
                      style={{ padding: "0.4rem 1rem", borderRadius: "6px", background: "#e63946", color: "white", border: "none", cursor: "pointer", fontSize: "0.85rem" }}
                    >
                      Delete Recipe
                    </button>
                  </div>
                )}
              </div>
            );
          })}
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

export default SavedRecipes;