import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FDFBFB",
        blush: {
          50: "#fdf7f9",
          100: "#fbeef4",
          200: "#ffd1e3",
        },
        brand: {
          DEFAULT: "#FF3B8D",
          300: "#FF7AAC",
          400: "#FF7AAC",
          500: "#FF3B8D",
          600: "#E11E73",
          highlight: "#FF8C7A",
        },
      },
      boxShadow: {
        brand: "0 8px 24px rgba(255,59,141,0.4)",
        "brand-lg": "0 12px 32px rgba(255,59,141,0.4)",
        glass: "0 24px 48px -12px rgba(0, 0, 0, 0.08)",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
