import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // "Signal on Static" palette
        ink: "#0E0E10", // primary text / dark sections
        paper: "#FAF8F4", // base background (warm off-white)
        signal: "#D97B3F", // primary accent (amber/copper)
        static: "#5B6B7A", // secondary accent (muted slate blue)
        alert: "#E8542E", // high-intent / urgent
        success: "#7A9B76", // low-noise / positive
        divider: "#E4DFD6", // borders / dividers (warm grey)
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        // sharp-ish, editorial — not bubbly pills
        sm: "3px",
        DEFAULT: "5px",
        md: "6px",
        lg: "8px",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
