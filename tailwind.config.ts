import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#02060C",
          900: "#03080F",
          800: "#04111F",
          700: "#071C30",
          600: "#0A2540",
          500: "#0D3360",
        },
        blue: {
          brand: "#1565C0",
          bright: "#2196F3",
          light: "#64B5F6",
          pale:  "#BBDEFB",
        },
        accent: "#00B4D8",
        silver: {
          DEFAULT: "#B0BEC5",
          light:   "#E0E8EE",
        },
      },
      fontFamily: {
        sans: ["var(--font-space)", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["var(--font-orbitron)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      animation: {
        "marquee":      "marquee 22s linear infinite",
        "beam":         "beam 7s ease-in-out infinite",
        "pulse-glow":   "pulseGlow 3s ease-in-out infinite",
        "fade-up":      "fadeUp 0.7s ease both",
        "sphere-glow":  "sphereGlow 4s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        beam: {
          "0%,100%": { opacity: "0", transform: "rotate(-12deg) scaleX(1)" },
          "15%":     { opacity: "1" },
          "50%":     { transform: "rotate(0deg) scaleX(2.5)", opacity: "0.7" },
          "85%":     { opacity: "0" },
        },
        pulseGlow: {
          "0%,100%": { opacity: "0.6" },
          "50%":     { opacity: "1" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        sphereGlow: {
          "0%,100%": { boxShadow: "0 0 40px rgba(33,150,243,0.35), 0 0 80px rgba(33,150,243,0.1)" },
          "50%":     { boxShadow: "0 0 70px rgba(33,150,243,0.6), 0 0 120px rgba(33,150,243,0.25)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
