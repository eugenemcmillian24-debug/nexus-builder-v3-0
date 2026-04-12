import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#08080f",
        surface: "#0d0d1a",
        "surface-2": "#0a0a0f",
        border: "#1a1a2e",
        "border-2": "#2a2a4a",
        accent: "#00ff88",
        blue: "#00d4ff",
        orange: "#ff6b35",
        purple: "#a78bfa",
        amber: "#f59e0b",
        red: "#ff4757",
        text: "#e2e8f0",
        "text-muted": "#6b7280",
        "text-dim": "#4a4a6a",
      },
      fontFamily: {
        mono: ["Space Mono", "monospace"],
        code: ["DM Mono", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;