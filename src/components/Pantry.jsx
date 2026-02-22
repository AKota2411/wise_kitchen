import { useState } from "react";
import { S, colors } from "../styles";

const UNITS = ["pcs", "lbs", "oz", "kg", "g", "cups", "liters", "ml", "tbsp", "tsp"];

const Pantry = ({ pantry, addItem, removeItem, updateQuantity, toggleLow, addToGroceryList }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [error, setError] = useState("");
  const [pendingLowItem, setPendingLowItem] = useState(null);
  const [zeroedItem, setZeroedItem] = useState(null);
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) { setError("Please enter an item name."); return; }
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) { setError("Please enter a valid quantity."); return; }
    const duplicate = pantry.find((item) => item.name.toLowerCase() === name.trim().toLowerCase());
    if (duplicate) { setError(`"${name.trim()}" is already in your pantry. Edit the quantity directly.`); return; }
    setError("");
    setAdding(true);
    await addItem(name.trim(), Number(quantity), unit);
    setAdding(false);
    setName("");
    setQuantity("");
    setUnit("pcs");
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleAdd(); };

  const handleToggleLow = (item) => {
    if (!item.low) { setPendingLowItem(item); } else { toggleLow(item.id); }
  };

  const handleQuantityChange = (item, value) => {
    const num = Number(value);
    if (num <= 0) { removeItem(item.id); setZeroedItem(item); }
    else { updateQuantity(item.id, num); }
  };

  return (
    <div style={S.page}>
      <h2 style={{ color: colors.textPrimary, marginBottom: "0.25rem" }}>My Pantry</h2>
      <p style={{ color: colors.textMuted, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Track what you have at home. We'll use this to suggest meals you can make right now.
      </p>

      {/* Add form */}
      <div style={{ ...S.card, padding: "1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Item name (e.g. Broccoli)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ ...S.input, flex: 2, minWidth: "140px" }}
          />
          <input
            type="number"
            placeholder="Qty"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyDown={handleKeyDown}
            min="0"
            style={{ ...S.input, flex: 1, minWidth: "70px" }}
          />
          <select value={unit} onChange={(e) => setUnit(e.target.value)} style={S.select}>
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <button
            onClick={handleAdd}
            disabled={adding}
            style={adding ? S.btnDisabled : S.btnPrimary}
          >
            {adding ? "Adding..." : "＋ Add"}
          </button>
        </div>
        {adding && <p style={{ color: colors.primary, fontSize: "0.8rem", marginTop: "0.5rem", marginBottom: 0 }}>🔍 Looking up nutrition data...</p>}
        {error && <p style={{ ...S.errorText, marginTop: "0.5rem", marginBottom: 0 }}>{error}</p>}
      </div>

      {/* Pantry table */}
      {pantry.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: colors.textMuted }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🧺</div>
          <p>Your pantry is empty. Add some ingredients above to get started.</p>
        </div>
      ) : (
        <div style={S.card}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Item</th>
                <th style={S.th}>Qty</th>
                <th style={S.th}>Unit</th>
                <th style={S.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pantry.map((item) => (
                <tr key={item.id} style={{ background: item.low ? colors.warningLight : "transparent" }}>
                  <td style={S.td}>
                    <div style={{ fontWeight: "500" }}>
                      {item.name}
                      {item.low && (
                        <span style={{ marginLeft: "0.5rem", color: colors.warning, fontSize: "0.72rem", fontWeight: "600", background: colors.warningLight, padding: "0.1rem 0.5rem", borderRadius: "999px", border: "1px solid #e8d5b0" }}>
                          ⚠ Low
                        </span>
                      )}
                    </div>
                    {item.nutrition && (
                      <div style={{ fontSize: "0.7rem", color: colors.textMuted, marginTop: "0.2rem" }}>
                        📊 {item.nutrition.per100g.calories} kcal · {item.nutrition.per100g.protein}g protein · {item.nutrition.per100g.carbs}g carbs · {item.nutrition.per100g.fat}g fat <span style={{ opacity: 0.6 }}>per 100g</span>
                      </div>
                    )}
                  </td>
                  <td style={S.td}>
                    <input
                      type="number"
                      value={item.quantity}
                      min="0"
                      onChange={(e) => handleQuantityChange(item, e.target.value)}
                      style={{ ...S.input, width: "65px", padding: "0.25rem 0.4rem" }}
                    />
                  </td>
                  <td style={{ ...S.td, color: colors.textMuted }}>{item.unit}</td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button onClick={() => handleToggleLow(item)} style={item.low ? S.btnWarningActive : S.btnWarning}>
                        {item.low ? "Unmark" : "Mark Low"}
                      </button>
                      <button onClick={() => removeItem(item.id)} style={S.btnDanger}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Zero quantity popup */}
      {zeroedItem && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🗑️</div>
            <h3 style={{ marginBottom: "0.5rem", color: colors.textPrimary }}>Item Removed</h3>
            <p style={{ color: colors.textSecondary, marginBottom: "1.5rem" }}>
              <strong>{zeroedItem.name}</strong> hit 0 and was removed. Add it to your grocery list?
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button onClick={() => { addToGroceryList(zeroedItem.name, zeroedItem.unit); setZeroedItem(null); }} style={S.btnPrimary}>Yes, Add It</button>
              <button onClick={() => setZeroedItem(null)} style={S.btnSecondary}>No Thanks</button>
            </div>
          </div>
        </div>
      )}

      {/* Mark Low popup */}
      {pendingLowItem && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🛒</div>
            <h3 style={{ marginBottom: "0.5rem", color: colors.textPrimary }}>Add to Grocery List?</h3>
            <p style={{ color: colors.textSecondary, marginBottom: "1.5rem" }}>
              Do you want to add <strong>{pendingLowItem.name}</strong> to your grocery list?
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button onClick={() => { toggleLow(pendingLowItem.id); addToGroceryList(pendingLowItem.name, pendingLowItem.unit); setPendingLowItem(null); }} style={S.btnPrimary}>Yes, Add It</button>
              <button onClick={() => { toggleLow(pendingLowItem.id); setPendingLowItem(null); }} style={S.btnSecondary}>No Thanks</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pantry;