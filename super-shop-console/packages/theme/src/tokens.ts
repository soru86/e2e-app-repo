export type Theme = "light" | "dark";

const base = {
  fontFamily: "Inter, system-ui, sans-serif",
  radiusSm: "0.25rem",
  radiusMd: "0.65rem",
  radiusLg: "1.25rem",
};

export const themeTokens = {
  light: {
    ...base,
    background: "#e2e8f0",
    surface: "#ffffff",
    text: "#0f172a",
    muted: "#94a3b8",
    primary: "#1d4ed8",
    success: "#109869",
    warning: "#ea580c",
    danger: "#dc2626",
    chart: ["#1d4ed8", "#64748b", "#ef4444", "#10b981"],
  },
  dark: {
    ...base,
    background: "#050505",
    surface: "#111827",
    text: "#f8fafc",
    muted: "#fcd9b3",
    primary: "#fb923c",
    success: "#fbbf24",
    warning: "#ff6b35",
    danger: "#fb7185",
    chart: ["#fb923c", "#fbbf24", "#f97316", "#f8fafc"],
  },
} satisfies Record<Theme, Record<string, string | string[]>>;
