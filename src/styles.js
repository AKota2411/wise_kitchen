// ============================================================
// Wise Kitchen — Global Style System
// Earthy green pastel palette, rounded, soft, approachable
// ============================================================

export const colors = {
    // Primary greens
    primary: "#52796f",        // main action color - muted sage
    primaryDark: "#354f52",    // hover / header backgrounds
    primaryLight: "#84a98c",   // secondary accents
    primaryXLight: "#cad2c5",  // borders, dividers
  
    // Backgrounds
    bgPage: "#f8f5f0",         // warm off-white page background
    bgCard: "#ffffff",         // card surfaces
    bgCardAlt: "#f4f1ec",      // alternate card / section tint
    bgTag: "#d8e8d8",          // pantry item tags
    bgWarning: "#fef9ec",      // low item rows
  
    // Text
    textPrimary: "#2f3e35",    // main text - dark earthy green
    textSecondary: "#5c6b5e",  // secondary text
    textMuted: "#8f9e91",      // placeholders, hints
    textOnPrimary: "#ffffff",  // text on green buttons
  
    // Semantic
    danger: "#c1665a",         // delete / error
    dangerLight: "#f9eded",
    warning: "#b07d3a",        // low stock badge
    warningLight: "#fef3e2",
    success: "#52796f",        // confirmed / saved
    successLight: "#e8f0e8",
  
    // Nutrition badges
    calColor: "#7a9e7e",
    proteinColor: "#6b8f71",
    carbColor: "#8fab7e",
    fatColor: "#a8b87a",
  };
  
  export const radius = {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    full: "999px",
  };
  
  export const shadow = {
    sm: "0 1px 4px rgba(47,62,53,0.07)",
    md: "0 2px 12px rgba(47,62,53,0.09)",
    lg: "0 4px 24px rgba(47,62,53,0.12)",
  };
  
  export const spacing = {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  };
  
  export const font = {
    base: "'Segoe UI', system-ui, sans-serif",
    sizeSm: "0.8rem",
    sizeMd: "0.95rem",
    sizeLg: "1.1rem",
    sizeXl: "1.4rem",
  };
  
  // ── Reusable component styles ────────────────────────────────
  
  export const S = {
    // Page wrapper
    page: {
      padding: spacing.lg,
      maxWidth: "720px",
      margin: "0 auto",
      fontFamily: font.base,
      color: colors.textPrimary,
    },
  
    // Cards
    card: {
      background: colors.bgCard,
      borderRadius: radius.lg,
      border: `1px solid ${colors.primaryXLight}`,
      boxShadow: shadow.md,
      overflow: "hidden",
    },
  
    cardHeader: {
      background: colors.primaryDark,
      color: colors.textOnPrimary,
      padding: `${spacing.md} ${spacing.lg}`,
    },
  
    cardBody: {
      padding: spacing.lg,
    },
  
    cardHeaderAlt: {
      background: colors.bgCardAlt,
      color: colors.textPrimary,
      padding: `${spacing.md} ${spacing.lg}`,
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
  
    cardHeaderActive: {
      background: colors.primaryDark,
      color: colors.textOnPrimary,
      padding: `${spacing.md} ${spacing.lg}`,
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
  
    // Section inside a card
    section: {
      marginBottom: spacing.lg,
    },
  
    sectionTitle: {
      color: colors.primary,
      marginBottom: spacing.sm,
      fontSize: font.sizeLg,
      fontWeight: "600",
    },
  
    // Buttons
    btnPrimary: {
      padding: "0.55rem 1.25rem",
      borderRadius: radius.full,
      background: colors.primary,
      color: colors.textOnPrimary,
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: font.sizeMd,
      transition: "background 0.2s",
    },
  
    btnPrimaryLarge: {
      padding: "0.7rem 1.75rem",
      borderRadius: radius.full,
      background: colors.primary,
      color: colors.textOnPrimary,
      border: "none",
      cursor: "pointer",
      fontWeight: "700",
      fontSize: font.sizeLg,
    },
  
    btnSecondary: {
      padding: "0.55rem 1.25rem",
      borderRadius: radius.full,
      background: colors.bgCardAlt,
      color: colors.textSecondary,
      border: `1px solid ${colors.primaryXLight}`,
      cursor: "pointer",
      fontSize: font.sizeMd,
    },
  
    btnDanger: {
      padding: "0.4rem 1rem",
      borderRadius: radius.full,
      background: colors.danger,
      color: colors.textOnPrimary,
      border: "none",
      cursor: "pointer",
      fontSize: font.sizeSm,
      fontWeight: "600",
    },
  
    btnDisabled: {
      padding: "0.55rem 1.25rem",
      borderRadius: radius.full,
      background: colors.primaryXLight,
      color: colors.textMuted,
      border: "none",
      cursor: "default",
      fontWeight: "600",
      fontSize: font.sizeMd,
    },
  
    btnWarning: {
      padding: "0.3rem 0.75rem",
      borderRadius: radius.full,
      background: colors.warningLight,
      color: colors.warning,
      border: `1px solid #e8d5b0`,
      cursor: "pointer",
      fontSize: font.sizeSm,
      fontWeight: "600",
    },
  
    btnWarningActive: {
      padding: "0.3rem 0.75rem",
      borderRadius: radius.full,
      background: colors.primaryXLight,
      color: colors.textSecondary,
      border: `1px solid ${colors.primaryXLight}`,
      cursor: "pointer",
      fontSize: font.sizeSm,
    },
  
    // Inputs
    input: {
      padding: "0.55rem 0.85rem",
      borderRadius: radius.md,
      border: `1px solid ${colors.primaryXLight}`,
      fontSize: font.sizeMd,
      background: colors.bgCard,
      color: colors.textPrimary,
      outline: "none",
    },
  
    select: {
      padding: "0.55rem 0.85rem",
      borderRadius: radius.md,
      border: `1px solid ${colors.primaryXLight}`,
      fontSize: font.sizeMd,
      background: colors.bgCard,
      color: colors.textPrimary,
    },
  
    textarea: {
      width: "100%",
      padding: "0.75rem",
      borderRadius: radius.md,
      border: `1px solid ${colors.primaryXLight}`,
      fontSize: font.sizeMd,
      resize: "vertical",
      boxSizing: "border-box",
      fontFamily: font.base,
      background: colors.bgCard,
      color: colors.textPrimary,
    },
  
    // Tags / chips
    tag: {
      background: colors.bgTag,
      color: colors.primaryDark,
      borderRadius: radius.full,
      padding: "0.2rem 0.75rem",
      fontSize: font.sizeSm,
      fontWeight: "500",
      display: "inline-block",
    },
  
    // Nutrition grid
    nutritionGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "0.75rem",
    },
  
    nutritionCell: {
      textAlign: "center",
      background: colors.bgCardAlt,
      borderRadius: radius.md,
      padding: "0.75rem 0.5rem",
      border: `1px solid ${colors.primaryXLight}`,
    },
  
    // AI notes box
    aiNotes: {
      background: "#fdf8ee",
      borderRadius: radius.md,
      padding: "0.75rem 1rem",
      fontSize: font.sizeMd,
      color: colors.textSecondary,
      border: "1px solid #ecdfc4",
    },
  
    // Divider
    divider: {
      borderTop: `1px solid ${colors.primaryXLight}`,
      paddingTop: spacing.lg,
      marginTop: spacing.sm,
    },
  
    // Modal overlay
    overlay: {
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(47,62,53,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
  
    modal: {
      background: colors.bgCard,
      borderRadius: radius.xl,
      padding: spacing.xl,
      maxWidth: "380px",
      width: "90%",
      textAlign: "center",
      boxShadow: shadow.lg,
    },
  
    // Error / info text
    errorText: {
      color: colors.danger,
      fontSize: font.sizeMd,
      marginBottom: spacing.md,
    },
  
    mutedText: {
      color: colors.textMuted,
      fontSize: font.sizeSm,
      marginBottom: spacing.sm,
    },
  
    // Table
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
  
    th: {
      padding: "0.5rem 0.75rem",
      fontSize: font.sizeSm,
      color: colors.textMuted,
      textAlign: "left",
      borderBottom: `2px solid ${colors.primaryXLight}`,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.04em",
    },
  
    td: {
      padding: "0.6rem 0.75rem",
      borderBottom: `1px solid ${colors.bgCardAlt}`,
      fontSize: font.sizeMd,
      color: colors.textPrimary,
    },
  
    // Nav
    nav: {
      background: colors.primaryDark,
      padding: `0.85rem ${spacing.lg}`,
      display: "flex",
      gap: spacing.md,
      alignItems: "center",
      boxShadow: shadow.md,
    },
  
    navBrand: {
      color: colors.textOnPrimary,
      fontWeight: "700",
      fontSize: font.sizeLg,
      marginRight: "auto",
      textDecoration: "none",
    },
  
    navLink: {
      color: colors.primaryXLight,
      textDecoration: "none",
      fontSize: font.sizeMd,
      padding: "0.3rem 0.75rem",
      borderRadius: radius.full,
      transition: "background 0.2s",
    },
  
    navLinkActive: {
      color: colors.textOnPrimary,
      textDecoration: "none",
      fontSize: font.sizeMd,
      padding: "0.3rem 0.75rem",
      borderRadius: radius.full,
      background: "rgba(255,255,255,0.15)",
    },
  };