import { useState } from "react";

const UNITS = ["pcs", "lbs", "oz", "kg", "g", "cups", "liters", "ml", "tbsp", "tsp"];

const Pantry = ({ pantry, addItem, removeItem, updateQuantity, toggleLow, addToGroceryList }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [error, setError] = useState("");
  const [pendingLowItem, setPendingLowItem] = useState(null);
  const [zeroedItem, setZeroedItem] = useState(null);

  const handleQuantityChange = (item, value) => {
    const num = Number(value);
    if (num <= 0) {
      removeItem(item.id);
      setZeroedItem(item);
    } else {
      updateQuantity(item.id, num);
    }
  };

  const handleAdd = () => {
    if (!name.trim()) {
      setError("Please enter an item name.");
      return;
    }
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }
    const duplicate = pantry.find(
      (item) => item.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (duplicate) {
      setError(`"${name.trim()}" is already in your inventory. Update the quantity directly in the table.`);
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

  const handleToggleLow = (item) => {
    if (!item.low) {
      // Marking as low — show popup
      setPendingLowItem(item);
    } else {
      // Unmarking — just toggle, no popup
      toggleLow(item.id);
    }
  };

  const confirmAddToGrocery = () => {
    if (!pendingLowItem) return;
    toggleLow(pendingLowItem.id);
    addToGroceryList(pendingLowItem.name, pendingLowItem.unit);
    setPendingLowItem(null);
  };

  const declineAddToGrocery = () => {
    if (!pendingLowItem) return;
    toggleLow(pendingLowItem.id);
    setPendingLowItem(null);
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
                    onChange={(e) => handleQuantityChange(item, e.target.value)}
                    style={{ width: "60px", padding: "0.25rem", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                </td>
                <td style={{ padding: "0.5rem" }}>{item.unit}</td>
                <td style={{ padding: "0.5rem", display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleToggleLow(item)}
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      background: item.low ? "#aaa" : "#f4a261",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                    }}
                  >
                    {item.low ? "Unmark Low" : "Mark Low"}
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

      {/* Zero quantity popup */}
      {zeroedItem && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "12px", padding: "2rem", maxWidth: "360px", width: "90%", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            <h3 style={{ marginBottom: "0.5rem" }}>Item Removed</h3>
            <p style={{ color: "#555", marginBottom: "1.5rem" }}>
              <strong>{zeroedItem.name}</strong> hit 0 and was removed. Add it to your grocery list?
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button onClick={() => { addToGroceryList(zeroedItem.name, zeroedItem.unit); setZeroedItem(null); }} style={{ padding: "0.5rem 1.25rem", borderRadius: "6px", background: "#2d6a4f", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>Yes, Add It</button>
              <button onClick={() => setZeroedItem(null)} style={{ padding: "0.5rem 1.25rem", borderRadius: "6px", background: "#eee", color: "#333", border: "none", cursor: "pointer" }}>No Thanks</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup */}
      {pendingLowItem && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            maxWidth: "360px",
            width: "90%",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}>
            <h3 style={{ marginBottom: "0.5rem" }}>Add to Grocery List?</h3>
            <p style={{ color: "#555", marginBottom: "1.5rem" }}>
              Do you want to add <strong>{pendingLowItem.name}</strong> to your grocery list?
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={confirmAddToGrocery}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "6px",
                  background: "#2d6a4f",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Yes, Add It
              </button>
              <button
                onClick={declineAddToGrocery}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "6px",
                  background: "#eee",
                  color: "#333",
                  border: "none",
                  cursor: "pointer",
                }}
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

export default Pantry;