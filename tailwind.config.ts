import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./contexts/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "var(--color-sand)",
        paper: "var(--color-paper)",
        mist: "var(--color-mist)",
        rose: "var(--color-rose)",
        cloud: "var(--color-cloud)",
        ink: "var(--color-ink)",
      },
    },
  },
  plugins: [],
};

export default config;
