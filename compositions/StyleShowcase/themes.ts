// Theme definitions for visual style exploration

export interface Theme {
  name: string;
  background: {
    primary: string;
    secondary: string;
    gradient?: string;
  };
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  accent: {
    primary: string;
    secondary: string;
    glow?: string;
  };
  card: {
    background: string;
    border: string;
  };
}

export const themes: Record<string, Theme> = {
  darkGradient: {
    name: "Dark Gradient",
    background: {
      primary: "#0f0a1f",
      secondary: "#1a1035",
      gradient: "linear-gradient(135deg, #0f0a1f 0%, #1a1035 50%, #0f172a 100%)",
    },
    text: {
      primary: "#ffffff",
      secondary: "#a5b4fc",
      accent: "#c4b5fd",
    },
    accent: {
      primary: "#8b5cf6",
      secondary: "#6366f1",
      glow: "0 0 60px rgba(139, 92, 246, 0.4)",
    },
    card: {
      background: "rgba(139, 92, 246, 0.1)",
      border: "rgba(139, 92, 246, 0.3)",
    },
  },

  lightAcademic: {
    name: "Light Academic",
    background: {
      primary: "#fafaf9",
      secondary: "#f5f5f4",
      gradient: "linear-gradient(180deg, #fafaf9 0%, #f5f5f4 100%)",
    },
    text: {
      primary: "#1c1917",
      secondary: "#57534e",
      accent: "#0369a1",
    },
    accent: {
      primary: "#0284c7",
      secondary: "#0ea5e9",
      glow: "0 4px 20px rgba(2, 132, 199, 0.15)",
    },
    card: {
      background: "#ffffff",
      border: "#e7e5e4",
    },
  },

  neonCyber: {
    name: "Neon Cyber",
    background: {
      primary: "#030712",
      secondary: "#0a0f1a",
      gradient: "linear-gradient(180deg, #030712 0%, #0a0f1a 100%)",
    },
    text: {
      primary: "#f0fdf4",
      secondary: "#86efac",
      accent: "#4ade80",
    },
    accent: {
      primary: "#22c55e",
      secondary: "#14b8a6",
      glow: "0 0 40px rgba(34, 197, 94, 0.5)",
    },
    card: {
      background: "rgba(34, 197, 94, 0.05)",
      border: "rgba(34, 197, 94, 0.3)",
    },
  },

  minimalModern: {
    name: "Minimal Modern",
    background: {
      primary: "#ffffff",
      secondary: "#f8fafc",
      gradient: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
      accent: "#0f172a",
    },
    accent: {
      primary: "#0f172a",
      secondary: "#334155",
      glow: "none",
    },
    card: {
      background: "#f1f5f9",
      border: "#e2e8f0",
    },
  },
};
