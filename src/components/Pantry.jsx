import { useState } from "react";
import { usePantry } from "../store/usePantry";

const UNITS = ["pcs", "lbs", "oz", "kg", "g", "cups", "liters", "ml", "tbsp", "tsp"];

const Pantry = () => {
  const {
    pantry,
    addItem,
    removeItem,
    updateQuantity,
    markAsLow,
  } = usePantry();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!name.trim()) {
      setError("Please enter an item name.");
      return;
    }
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }
    setError("");
    addItem(name.trim(), Number(quantity), unit);
    setName("");
    setQuantity("");
    setUnit("pcs");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "700px", margin: "0 auto" }}>
      <h2>My Pantry</h2>

      {/* Add Item Form */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Item name (e.g. Chicken)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 2, padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Qty"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          onKeyDown={handleKeyDown}
          min="0"
          style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            background: "#2d6a4f",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Add
        </button>
      </div>

      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      {/* Pantry List */}
      {pantry.length === 0 ? (
        <p style={{ color: "#888" }}>Your pantry is empty. Start adding ingredients above.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
              <th style={{ padding: "0.5rem" }}>Item</th>
              <th style={{ padding: "0.5rem" }}>Quantity</th>
              <th style={{ padding: "0.5rem" }}>Unit</th>
              <th style={{ padding: "0.5rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pantry.map((item) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: "1px solid #f0f0f0",
                  background: item.low ? "#fff8e1" : "transparent",
                }}
              >
                <td style={{ padding: "0.5rem" }}>
                  {item.name}
                  {item.low && (
                    <span style={{ marginLeft: "0.5rem", color: "#e07b00", fontSize: "0.75rem" }}>
                      ⚠ Low
                    </span>
                  )}
                </td>
                <td style={{ padding: "0.5rem" }}>
                  <input
                    type="number"
                    value={item.quantity}
                    min="0"
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    style={{ width: "60px", padding: "0.25rem", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                </td>
                <td style={{ padding: "0.5rem" }}>{item.unit}</td>
                <td style={{ padding: "0.5rem", display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => markAsLow(item.id)}
                    disabled={item.low}
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      background: item.low ? "#ccc" : "#f4a261",
                      color: "white",
                      border: "none",
                      cursor: item.low ? "default" : "pointer",
                      fontSize: "0.75rem",
                    }}
                  >
                    Mark Low
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      background: "#e63946",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Pantry;