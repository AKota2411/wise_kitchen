import { useState } from "react";
import { usePreferences } from "../store/usePreferences";

const PRESET_CUISINES = ["Italian", "Mexican", "Chinese", "Japanese", "Indian", "Mediterranean", "American", "Thai", "French", "Korean"];
const PRESET_RESTRICTIONS = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Paleo", "Halal", "Kosher", "Low-Sodium", "Low-Sugar"];

const Tag = ({ label, onRemove }) => (
  <span style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    background: "#e8f5e9",
    color: "#2d6a4f",
    borderRadius: "20px",
    padding: "0.25rem 0.75rem",
    fontSize: "0.85rem",
    fontWeight: "500",
  }}>
    {label}
    <span
      onClick={onRemove}
      style={{ cursor: "pointer", fontWeight: "bold", color: "#999" }}
    >
      ✕
    </span>
  </span>
);

const CheckboxGroup = ({ options, selected, onToggle }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
    {options.map((opt) => (
      <label
        key={opt}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
          padding: "0.3rem 0.75rem",
          borderRadius: "20px",
          border: `1px solid ${selected.includes(opt) ? "#2d6a4f" : "#ccc"}`,
          background: selected.includes(opt) ? "#e8f5e9" : "white",
          cursor: "pointer",
          fontSize: "0.85rem",
          userSelect: "none",
        }}
      >
        <input
          type="checkbox"
          checked={selected.includes(opt)}
          onChange={() => onToggle(opt)}
          style={{ display: "none" }}
        />
        {opt}
      </label>
    ))}
  </div>
);

const CustomInput = ({ placeholder, onAdd }) => {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        style={{ flex: 1, padding: "0.4rem 0.75rem", borderRadius: "6px", border: "1px solid #ccc" }}
      />
      <button
        onClick={handleAdd}
        style={{
          padding: "0.4rem 0.75rem",
          borderRadius: "6px",
          background: "#2d6a4f",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Add
      </button>
    </div>
  );
};

const Preferences = () => {
  const { preferences, updatePreferences, toggleItem, addCustomItem, removeItem } = usePreferences();
  const [saved, setSaved] = useState(false);

  const handleGoalChange = (field, value) => {
    updatePreferences({ [field]: value });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "700px", margin: "0 auto" }}>
      <h2>My Preferences</h2>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        Tell us about your taste and dietary needs so we can suggest the best meals for you.
      </p>

      {/* Cuisines */}
      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "0.5rem" }}>Favorite Cuisines</h3>
        <CheckboxGroup
          options={PRESET_CUISINES}
          selected={preferences.cuisines}
          onToggle={(val) => toggleItem("cuisines", val)}
        />
        <CustomInput
          placeholder="Add a custom cuisine..."
          onAdd={(val) => addCustomItem("cuisines", val)}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {preferences.cuisines
            .filter((c) => !PRESET_CUISINES.includes(c))
            .map((c) => (
              <Tag key={c} label={c} onRemove={() => removeItem("cuisines", c)} />
            ))}
        </div>
      </section>

      {/* Dietary Restrictions */}
      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "0.5rem" }}>Dietary Restrictions</h3>
        <CheckboxGroup
          options={PRESET_RESTRICTIONS}
          selected={preferences.restrictions}
          onToggle={(val) => toggleItem("restrictions", val)}
        />
        <CustomInput
          placeholder="Add a custom restriction..."
          onAdd={(val) => addCustomItem("restrictions", val)}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {preferences.restrictions
            .filter((r) => !PRESET_RESTRICTIONS.includes(r))
            .map((r) => (
              <Tag key={r} label={r} onRemove={() => removeItem("restrictions", r)} />
            ))}
        </div>
      </section>

      {/* Allergies */}
      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "0.5rem" }}>Allergies</h3>
        <CustomInput
          placeholder="e.g. Peanuts, Shellfish, Eggs..."
          onAdd={(val) => addCustomItem("allergies", val)}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {preferences.allergies.map((a) => (
            <Tag key={a} label={a} onRemove={() => removeItem("allergies", a)} />
          ))}
        </div>
      </section>

      {/* Nutritional Goals */}
      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "0.75rem" }}>Daily Nutritional Goals</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {[
            { label: "Calories (kcal)", field: "calorieGoal", placeholder: "e.g. 2000" },
            { label: "Protein (g)", field: "proteinGoal", placeholder: "e.g. 150" },
            { label: "Carbs (g)", field: "carbGoal", placeholder: "e.g. 250" },
            { label: "Fat (g)", field: "fatGoal", placeholder: "e.g. 65" },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem", color: "#555" }}>
                {label}
              </label>
              <input
                type="number"
                placeholder={placeholder}
                value={preferences[field]}
                onChange={(e) => handleGoalChange(field, e.target.value)}
                min="0"
                style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Save Button */}
      <button
        onClick={handleSave}
        style={{
          padding: "0.6rem 1.5rem",
          borderRadius: "6px",
          background: saved ? "#52b788" : "#2d6a4f",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "1rem",
          transition: "background 0.3s",
        }}
      >
        {saved ? "✓ Saved!" : "Save Preferences"}
      </button>
    </div>
  );
};

export default Preferences;