import { useState } from "react";
import { usePreferences } from "../store/usePreferences";
import { S, colors } from "../styles";

const PRESET_CUISINES = ["Italian", "Mexican", "Chinese", "Japanese", "Indian", "Mediterranean", "American", "Thai", "French", "Korean"];
const PRESET_RESTRICTIONS = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Paleo", "Halal", "Kosher", "Low-Sodium", "Low-Sugar"];

const Tag = ({ label, onRemove }) => (
  <span style={{ ...S.tag, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
    {label}
    <span onClick={onRemove} style={{ cursor: "pointer", color: colors.textMuted, fontWeight: "bold", lineHeight: 1 }}>✕</span>
  </span>
);

const CheckboxGroup = ({ options, selected, onToggle }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
    {options.map((opt) => (
      <label key={opt} style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.3rem 0.85rem", borderRadius: "999px", border: `1px solid ${selected.includes(opt) ? colors.primary : colors.primaryXLight}`, background: selected.includes(opt) ? colors.bgTag : colors.bgCard, cursor: "pointer", fontSize: "0.85rem", userSelect: "none", color: selected.includes(opt) ? colors.primaryDark : colors.textSecondary, fontWeight: selected.includes(opt) ? "600" : "400", transition: "all 0.15s" }}>
        <input type="checkbox" checked={selected.includes(opt)} onChange={() => onToggle(opt)} style={{ display: "none" }} />
        {opt}
      </label>
    ))}
  </div>
);

const CustomInput = ({ placeholder, onAdd }) => {
  const [value, setValue] = useState("");
  const handleAdd = () => { if (!value.trim()) return; onAdd(value.trim()); setValue(""); };
  return (
    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
      <input type="text" placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} style={{ ...S.input, flex: 1 }} />
      <button onClick={handleAdd} style={S.btnPrimary}>Add</button>
    </div>
  );
};

const SectionCard = ({ title, children }) => (
  <div style={{ ...S.card, padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
    <h3 style={{ color: colors.textPrimary, marginBottom: "1rem", marginTop: 0, fontSize: "1.05rem" }}>{title}</h3>
    {children}
  </div>
);

const Preferences = ({ uid }) => {
  const { preferences, updatePreferences, toggleItem, addCustomItem, removeItem } = usePreferences(uid);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={S.page}>
      <h2 style={{ color: colors.textPrimary, marginBottom: "0.25rem" }}>My Preferences</h2>
      <p style={{ color: colors.textMuted, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Tell us about your taste and dietary needs so we can suggest the best meals for you.
      </p>

      <SectionCard title="🍝 Favorite Cuisines">
        <CheckboxGroup options={PRESET_CUISINES} selected={preferences.cuisines} onToggle={(v) => toggleItem("cuisines", v)} />
        <CustomInput placeholder="Add a custom cuisine..." onAdd={(v) => addCustomItem("cuisines", v)} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {preferences.cuisines.filter((c) => !PRESET_CUISINES.includes(c)).map((c) => <Tag key={c} label={c} onRemove={() => removeItem("cuisines", c)} />)}
        </div>
      </SectionCard>

      <SectionCard title="🥗 Dietary Restrictions">
        <CheckboxGroup options={PRESET_RESTRICTIONS} selected={preferences.restrictions} onToggle={(v) => toggleItem("restrictions", v)} />
        <CustomInput placeholder="Add a custom restriction..." onAdd={(v) => addCustomItem("restrictions", v)} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {preferences.restrictions.filter((r) => !PRESET_RESTRICTIONS.includes(r)).map((r) => <Tag key={r} label={r} onRemove={() => removeItem("restrictions", r)} />)}
        </div>
      </SectionCard>

      <SectionCard title="⚠️ Allergies">
        <CustomInput placeholder="e.g. Peanuts, Shellfish, Eggs..." onAdd={(v) => addCustomItem("allergies", v)} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {preferences.allergies.map((a) => <Tag key={a} label={a} onRemove={() => removeItem("allergies", a)} />)}
        </div>
      </SectionCard>

      <SectionCard title="🎯 Daily Nutritional Goals">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {[
            { label: "Calories (kcal)", field: "calorieGoal", placeholder: "e.g. 2000" },
            { label: "Protein (g)", field: "proteinGoal", placeholder: "e.g. 150" },
            { label: "Carbs (g)", field: "carbGoal", placeholder: "e.g. 250" },
            { label: "Fat (g)", field: "fatGoal", placeholder: "e.g. 65" },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label style={{ display: "block", fontSize: "0.82rem", marginBottom: "0.3rem", color: colors.textSecondary, fontWeight: "500" }}>{label}</label>
              <input type="number" placeholder={placeholder} value={preferences[field]} onChange={(e) => updatePreferences({ [field]: e.target.value })} min="0" style={{ ...S.input, width: "100%", boxSizing: "border-box" }} />
            </div>
          ))}
        </div>
      </SectionCard>

      <button onClick={handleSave} style={saved ? { ...S.btnPrimaryLarge, background: colors.primaryLight, cursor: "default" } : S.btnPrimaryLarge}>
        {saved ? "✓ Preferences Saved!" : "Save Preferences"}
      </button>
    </div>
  );
};

export default Preferences;