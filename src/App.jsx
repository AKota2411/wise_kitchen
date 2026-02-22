import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Pantry from "./components/Pantry";
import GroceryList from "./components/GroceryList";
import Preferences from "./pages/Preferences";
import { usePantry } from "./store/usePantry";

const navStyle = ({ isActive }) => ({
  textDecoration: "none",
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  fontWeight: "500",
  background: isActive ? "#2d6a4f" : "transparent",
  color: isActive ? "white" : "#2d6a4f",
  border: "1px solid #2d6a4f",
  fontSize: "0.9rem",
});

const App = () => {
  const pantryState = usePantry();

  return (
    <BrowserRouter>
      <div style={{ fontFamily: "sans-serif" }}>
        {/* Nav */}
        <nav style={{
          display: "flex",
          gap: "0.75rem",
          padding: "1rem 1.5rem",
          borderBottom: "1px solid #eee",
          alignItems: "center",
        }}>
          <span style={{ fontWeight: "bold", fontSize: "1.1rem", marginRight: "1rem", color: "#2d6a4f" }}>
            🌿 Wise Kitchen
          </span>
          <NavLink to="/" style={navStyle}>Pantry</NavLink>
          <NavLink to="/grocery" style={navStyle}>Grocery List</NavLink>
          <NavLink to="/preferences" style={navStyle}>Preferences</NavLink>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Pantry {...pantryState} />} />
          <Route path="/grocery" element={<GroceryList {...pantryState} />} />
          <Route path="/preferences" element={<Preferences />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;