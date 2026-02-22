import { useState } from "react";
import { S, colors } from "../styles";

const GroceryList = ({ groceryList, addToGroceryList, toggleGroceryItem, removeGroceryItem, clearCheckedGroceries }) => {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (!newItem.trim()) return;
    addToGroceryList(newItem.trim());
    setNewItem("");
  };

  const unchecked = groceryList.filter((i) => !i.checked);
  const checked = groceryList.filter((i) => i.checked);

  return (
    <div style={S.page}>
      <h2 style={{ color: colors.textPrimary, marginBottom: "0.25rem" }}>Grocery List</h2>
      <p style={{ color: colors.textMuted, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Items marked low in your pantry appear here automatically.
      </p>

      {/* Add manually */}
      <div style={{ ...S.card, padding: "1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="Add an item manually..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          style={{ ...S.input, flex: 1 }}
        />
        <button onClick={handleAdd} style={S.btnPrimary}>＋ Add</button>
      </div>

      {groceryList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: colors.textMuted }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🛒</div>
          <p>Your grocery list is empty. Mark items as low in your pantry to auto-populate.</p>
        </div>
      ) : (
        <div style={S.card}>
          {/* Unchecked */}
          <ul style={{ listStyle: "none", padding: "0.5rem 1rem", margin: 0 }}>
            {unchecked.map((item) => (
              <li key={item.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0", borderBottom: `1px solid ${colors.bgCardAlt}` }}>
                <input type="checkbox" checked={false} onChange={() => toggleGroceryItem(item.id)} style={{ cursor: "pointer", width: "17px", height: "17px", accentColor: colors.primary }} />
                <span style={{ flex: 1, color: colors.textPrimary }}>{item.name}</span>
                <button onClick={() => removeGroceryItem(item.id)} style={{ background: "none", border: "none", color: colors.danger, cursor: "pointer", fontSize: "1rem", lineHeight: 1 }}>✕</button>
              </li>
            ))}
          </ul>

          {/* Checked */}
          {checked.length > 0 && (
            <div style={{ borderTop: `1px solid ${colors.primaryXLight}`, padding: "0.5rem 1rem 1rem" }}>
              <p style={{ color: colors.textMuted, fontSize: "0.78rem", margin: "0.5rem 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Checked off</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {checked.map((item) => (
                  <li key={item.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0", opacity: 0.45 }}>
                    <input type="checkbox" checked={true} onChange={() => toggleGroceryItem(item.id)} style={{ cursor: "pointer", width: "17px", height: "17px", accentColor: colors.primary }} />
                    <span style={{ flex: 1, textDecoration: "line-through", color: colors.textSecondary }}>{item.name}</span>
                    <button onClick={() => removeGroceryItem(item.id)} style={{ background: "none", border: "none", color: colors.danger, cursor: "pointer", fontSize: "1rem" }}>✕</button>
                  </li>
                ))}
              </ul>
              <button onClick={clearCheckedGroceries} style={{ ...S.btnDanger, marginTop: "0.75rem", fontSize: "0.8rem" }}>Clear Checked</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroceryList;