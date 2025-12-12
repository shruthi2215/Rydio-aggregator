import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#0051FF",
        midnight: "#0F172A",
        surface: "#0B1220",
        frost: "rgba(255,255,255,0.08)",
        accent: {
          cyan: "#22d3ee",
          amber: "#f59e0b",
          lime: "#84cc16",
        },
      },
      boxShadow: {
        glass: "0 20px 60px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 10% 20%, rgba(0,81,255,0.12), transparent 25%), radial-gradient(circle at 80% 0%, rgba(34,211,238,0.14), transparent 25%), radial-gradient(circle at 50% 80%, rgba(245,158,11,0.14), transparent 25%)",
        "primary-gradient":
          "linear-gradient(120deg, #0051FF 0%, #22D3EE 60%, #67e8f9 100%)",
      },
    },
  },
  plugins: [forms, typography],
};

