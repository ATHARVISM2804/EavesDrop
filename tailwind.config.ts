import type { Config } from "tailwindcss";

/**
 * Eavesdrop design system — "Altitude"
 *
 * Swiss-editorial, near-monochrome. Hairline borders do the structural work;
 * shadows are almost absent and strictly neutral. One restrained vermillion
 * accent, used only for signal (scores, live states, the logo mark) — never
 * for primary buttons, which are ink black.
 *
 * NOTE: token *names* are unchanged from the previous theme on purpose. Every
 * component consumes semantic tokens (text-static, bg-paper, border-divider),
 * so re-pointing the values re-themes the entire site without touching them.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0B0D", // primary text / dark sections / primary buttons
        "ink-soft": "#16181C", // raised surfaces on dark sections
        paper: "#FFFFFF", // base background (true white, not warm)
        surface: "#FFFFFF", // raised card surface
        sunken: "#F6F7F9", // alternating / recessed sections
        veil: "#FAFBFC", // faintest fill (table stripes, inset wells)
        signal: "#D14E2B", // accent — signal only, never a primary CTA
        "signal-hi": "#E0653F",
        "signal-dark": "#B03D1E",
        static: "#6B7280", // secondary text (cool grey)
        "static-soft": "#9AA1AC", // tertiary text / captions
        alert: "#D14E2B", // high-intent
        success: "#3F8F6B", // low-noise / positive
        divider: "#E7E9EC", // hairline borders
        hairline: "#F1F3F5", // faintest inner separators
      },
      fontFamily: {
        // Single-family system. `serif` is mapped to the same geometric sans so
        // existing `font-serif` headline usages become tight display sans.
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        display: "-0.032em", // large headlines
        tightish: "-0.018em", // sub-heads / lead copy
        eyebrow: "0.16em", // uppercase micro-labels
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "16px",
        "2xl": "22px",
        "3xl": "28px",
      },
      maxWidth: {
        content: "1200px",
        prose: "680px",
      },
      boxShadow: {
        // Neutral and very soft — structure comes from borders, not elevation.
        xs: "0 1px 2px rgba(10,11,13,0.04)",
        sm: "0 1px 2px rgba(10,11,13,0.04), 0 1px 3px rgba(10,11,13,0.03)",
        DEFAULT: "0 2px 4px rgba(10,11,13,0.04), 0 4px 12px rgba(10,11,13,0.04)",
        md: "0 4px 10px rgba(10,11,13,0.05), 0 12px 28px rgba(10,11,13,0.06)",
        lg: "0 12px 28px rgba(10,11,13,0.07), 0 32px 64px rgba(10,11,13,0.08)",
        // The hero product shot floating over the atmosphere plate.
        float: "0 24px 60px rgba(10,11,13,0.12), 0 60px 120px rgba(10,11,13,0.10)",
        // Floating pill nav.
        pill: "0 1px 2px rgba(10,11,13,0.05), 0 8px 24px rgba(10,11,13,0.07)",
        "signal-sm": "0 2px 10px rgba(209,78,43,0.22)",
        signal: "0 8px 26px rgba(209,78,43,0.26)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(0.85)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "grow-line": {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-14px) scale(1.03)" },
        },
        // Pane swap in the hero showcase
        "pane-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Data packet travelling down a pipeline connector
        packet: {
          "0%": { top: "-3px", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
        // Brief highlight when a new row lands
        flash: {
          "0%": { backgroundColor: "rgba(209,78,43,0.09)" },
          "100%": { backgroundColor: "rgba(209,78,43,0)" },
        },
        // Sweep across a bar / skeleton
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
        // Soft breathing halo on the active node
        halo: {
          "0%, 100%": { boxShadow: "0 0 0 3px rgba(209,78,43,0.10)" },
          "50%": { boxShadow: "0 0 0 6px rgba(209,78,43,0.05)" },
        },
        // Live sparkline bars breathing at staggered delays
        bars: {
          "0%, 100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
        // Scanning line sweeping down a pane ("processing…")
        scan: {
          "0%": { top: "0%", opacity: "0" },
          "12%": { opacity: "1" },
          "88%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "live-pulse": "pulse 2s ease-in-out infinite",
        marquee: "marquee var(--marquee-duration,32s) linear infinite",
        drift: "drift 18s ease-in-out infinite",
        "pane-in": "pane-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
        packet: "packet 0.9s ease-in-out infinite",
        flash: "flash 1.4s ease-out both",
        shimmer: "shimmer 2.2s ease-in-out infinite",
        halo: "halo 1.6s ease-in-out infinite",
        bars: "bars 1.4s ease-in-out infinite",
        scan: "scan 3.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
