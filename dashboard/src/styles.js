import theme from "./theme";

const styles = {
  page: {
    padding: "20px",
    background: theme.colors.pageBg,
    minHeight: "100vh",
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.text,
  },

  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
    fontWeight: "bold",
  },

  errorBanner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    padding: "14px 16px",
    marginBottom: "20px",
    borderRadius: theme.radius.sm,
    background: "#FFF7ED",
    border: "1px solid #FDBA74",
    color: "#9A3412",
    boxShadow: theme.shadows.card,
  },

  errorTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "4px",
  },

  errorText: {
    fontSize: "14px",
    lineHeight: 1.4,
  },

  retryButton: {
    padding: "10px 14px",
    border: "none",
    borderRadius: theme.radius.sm,
    background: theme.colors.danger,
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "38px",
    fontWeight: "bold",
    letterSpacing: 0,
  },

  filterContainer: {
    display: "flex",
    gap: "12px",
  },

  select: {
    padding: "10px",
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    color: theme.colors.text,
    boxShadow: theme.shadows.inset,
  },

  button: {
    padding: "10px 15px",
    background: theme.colors.primary,
    color: "white",
    border: "none",
    borderRadius: theme.radius.sm,
    cursor: "pointer",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "50% 50%",
    gap: "25px",
    marginBottom: "30px",
  },

  card: {
    padding: "20px",
    borderRadius: theme.radius.md,
    color: "white",
  },

  cardTitle: {
    fontSize: "18px",
  },

  cardValue: {
    fontSize: "36px",
    fontWeight: "bold",
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
  },

  chartCard: {
    background: theme.colors.surface,
    padding: "20px",
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.card,
  },

  monthCard: {
    background: theme.colors.surface,
    padding: "20px",
    borderRadius: theme.radius.md,
    marginTop: "20px",
    boxShadow: theme.shadows.card,
  },

  chartTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "15px",
  },

  footer: {
    textAlign: "center",
    marginTop: "30px",
    fontWeight: "bold",
    color: theme.colors.textMuted,
  },
};

export default styles;   
