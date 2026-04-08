import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#05070d",
        panel: "#0c1220",
        shell: "#0a1020",
        accent: "#7ce6a2",
        caution: "#f4c25f",
        danger: "#ff6f6f",
        electric: "#7dd3fc"
      },
      boxShadow: {
        pulse: "0 18px 60px rgba(3, 8, 20, 0.55)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -12px, 0)" }
        },
        rise: {
          "0%": { opacity: "0", transform: "translate3d(0, 24px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" }
        },
        pulseRing: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.5" },
          "50%": { transform: "scale(1.04)", opacity: "1" }
        }
      },
      animation: {
        drift: "drift 12s ease-in-out infinite",
        rise: "rise 0.6s ease forwards",
        "pulse-ring": "pulseRing 5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
