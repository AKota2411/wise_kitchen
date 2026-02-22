import { useState } from "react";
import { S, colors } from "../styles";

const AuthPage = ({ signIn, signUp, authError }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    if (isLogin) {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bgPage,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "1.5rem",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🌿</div>
          <h1 style={{ color: colors.primaryDark, margin: 0, fontSize: "1.8rem", fontWeight: "700" }}>Wise Kitchen</h1>
          <p style={{ color: colors.textMuted, marginTop: "0.4rem", fontSize: "0.95rem" }}>
            Cook smarter. Waste less. Eat better.
          </p>
        </div>

        {/* Card */}
        <div style={{ ...S.card, padding: "2rem" }}>
          <h2 style={{ color: colors.textPrimary, marginTop: 0, marginBottom: "1.5rem", fontSize: "1.2rem", textAlign: "center" }}>
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: colors.textSecondary, marginBottom: "0.3rem" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{ ...S.input, width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: colors.textSecondary, marginBottom: "0.3rem" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{ ...S.input, width: "100%", boxSizing: "border-box" }}
            />
          </div>

          {authError && (
            <p style={{ ...S.errorText, marginBottom: "1rem", textAlign: "center" }}>{authError}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ ...(loading ? S.btnDisabled : S.btnPrimaryLarge), width: "100%", textAlign: "center" }}
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>

          <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.88rem", color: colors.textMuted }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              style={{ color: colors.primary, fontWeight: "600", cursor: "pointer" }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;