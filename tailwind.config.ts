import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1", // Indigo 500
          light: "#818cf8",   // Indigo 400
          dark: "#4f46e5",    // Indigo 600
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f1f5f9", // Slate 100
          foreground: "#0f172a", // Slate 900
        },
        accent: {
          DEFAULT: "#ec4899", // Pink 500
          foreground: "#ffffff",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #6366f1, #8b5cf6)", // Indigo to Violet
        "gradient-glow": "radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
