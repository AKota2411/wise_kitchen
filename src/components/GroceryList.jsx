import { useState } from "react";

const GroceryList = ({ groceryList, addToGroceryList, toggleGroceryItem, removeGroceryItem, clearCheckedGroceries }) => {

  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (!newItem.trim()) return;
    addToGroceryList(newItem.trim());
    setNewItem("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  const unchecked = groceryList.filter((i) => !i.checked);
  const checked = groceryList.filter((i) => i.checked);

  return (
    <div style={{ padding: "1.5rem", maxWidth: "700px", margin: "0 auto" }}>
      <h2>Grocery List</h2>

      {/* Manual Add */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Add an item manually..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
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

      {groceryList.length === 0 ? (
        <p style={{ color: "#888" }}>Your grocery list is empty. Mark items as low in your pantry to auto-populate.</p>
      ) : (
        <>
          {/* Unchecked Items */}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {unchecked.map((item) => (
              <li
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => toggleGroceryItem(item.id)}
                  style={{ cursor: "pointer", width: "16px", height: "16px" }}
                />
                <span style={{ flex: 1 }}>{item.name}</span>
                <button
                  onClick={() => removeGroceryItem(item.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#e63946",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          {/* Checked Items */}
          {checked.length > 0 && (
            <>
              <p style={{ color: "#aaa", fontSize: "0.8rem", marginTop: "1rem" }}>Checked off</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {checked.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #f0f0f0",
                      opacity: 0.5,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => toggleGroceryItem(item.id)}
                      style={{ cursor: "pointer", width: "16px", height: "16px" }}
                    />
                    <span style={{ flex: 1, textDecoration: "line-through" }}>{item.name}</span>
                    <button
                      onClick={() => removeGroceryItem(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#e63946",
                        cursor: "pointer",
                        fontSize: "1rem",
                      }}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={clearCheckedGroceries}
                style={{
                  marginTop: "1rem",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  background: "#e63946",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                Clear Checked
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GroceryList;