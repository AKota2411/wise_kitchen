import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Pantry from "./components/Pantry";
import GroceryList from "./components/GroceryList";
import Preferences from "./pages/Preferences";
import Meals from "./pages/Meals";
import SavedRecipes from "./pages/SavedRecipes";
import { usePantry } from "./store/usePantry";
import { S, colors } from "./styles";

const App = () => {
  const pantryState = usePantry();

  return (
    <BrowserRouter>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: colors.bgPage, minHeight: "100vh" }}>
        <nav style={S.nav}>
        <NavLink to="/" style={({ isActive }) => isActive ? S.navLinkActive : S.navLink}>🌿 Wise Kitchen 🌿</NavLink>
          <NavLink to="/" style={({ isActive }) => isActive ? S.navLinkActive : S.navLink}>Pantry</NavLink>
          <NavLink to="/grocery" style={({ isActive }) => isActive ? S.navLinkActive : S.navLink}>Grocery List</NavLink>
          <NavLink to="/meals" style={({ isActive }) => isActive ? S.navLinkActive : S.navLink}>Meals</NavLink>
          <NavLink to="/saved" style={({ isActive }) => isActive ? S.navLinkActive : S.navLink}>Saved Recipes</NavLink>
          <NavLink to="/preferences" style={({ isActive }) => isActive ? S.navLinkActive : S.navLink}>Preferences</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Pantry {...pantryState} />} />
          <Route path="/grocery" element={<GroceryList {...pantryState} />} />
          <Route path="/meals" element={<Meals pantry={pantryState.pantry} updateQuantity={pantryState.updateQuantity} toggleLow={pantryState.toggleLow} addToGroceryList={pantryState.addToGroceryList} />} />
          <Route path="/saved" element={<SavedRecipes pantry={pantryState.pantry} updateQuantity={pantryState.updateQuantity} toggleLow={pantryState.toggleLow} addToGroceryList={pantryState.addToGroceryList} />} />
          <Route path="/preferences" element={<Preferences />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;