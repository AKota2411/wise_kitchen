import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Pantry from "./components/Pantry";
import GroceryList from "./components/GroceryList";
import Preferences from "./pages/Preferences";
import Meals from "./pages/Meals";
import SavedRecipes from "./pages/SavedRecipes";
import AuthPage from "./pages/AuthPage";
import { usePantry } from "./store/usePantry";
import { useAuth } from "./store/useAuth";
import { S, colors } from "./styles";

const App = () => {
  const { user, authLoading, authError, signIn, signUp, logOut } = useAuth();
  const pantryState = usePantry(user?.uid);

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: colors.bgPage, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", color: colors.textMuted }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🌿</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage signIn={signIn} signUp={signUp} authError={authError} />;
  }

  return (
    <BrowserRouter>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: colors.bgPage, minHeight: "100vh" }}>
        <nav style={S.nav}>
          <NavLink to="/" style={{ ...S.navBrand, textDecoration: "none" }}>🌿 Wise Kitchen 🌿</NavLink>
          <NavLink to="/" style={({ isActive }) => isActive ? S.navLinkActive : S.navLink}>Pantry</NavLink>
          <NavLink to="/grocery" style={({ isActive }) => isActive ? S.navLinkActive : S.navLink}>Grocery List</NavLink>
          <NavLink to="/meals" style={({ isActive }) => isActive ? S.navLinkActive : S.navLink}>Meals</NavLink>
          <NavLink to="/saved" style={({ isActive }) => isActive ? S.navLinkActive : S.navLink}>Saved Recipes</NavLink>
          <NavLink to="/preferences" style={({ isActive }) => isActive ? S.navLinkActive : S.navLink}>Preferences</NavLink>
          <button onClick={logOut} style={{ ...S.btnSecondary, marginLeft: "auto", fontSize: "0.8rem", padding: "0.3rem 0.85rem" }}>
            Sign Out
          </button>
        </nav>

        <Routes>
          <Route path="/" element={<Pantry {...pantryState} />} />
          <Route path="/grocery" element={<GroceryList {...pantryState} />} />
          <Route path="/meals" element={<Meals uid={user.uid} pantry={pantryState.pantry} updateQuantity={pantryState.updateQuantity} toggleLow={pantryState.toggleLow} addToGroceryList={pantryState.addToGroceryList} />} />
          <Route path="/saved" element={<SavedRecipes uid={user.uid} pantry={pantryState.pantry} updateQuantity={pantryState.updateQuantity} toggleLow={pantryState.toggleLow} addToGroceryList={pantryState.addToGroceryList} />} />
          <Route path="/preferences" element={<Preferences uid={user.uid} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;