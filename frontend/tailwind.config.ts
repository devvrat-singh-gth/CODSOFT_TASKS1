import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],

  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        border: "hsl(var(--border))",

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        ring: "hsl(var(--ring))",
      },

      boxShadow: {
        soft: "0 10px 35px hsl(220 40% 20% / 0.07)",
        "soft-lg": "0 20px 60px hsl(220 40% 20% / 0.1)",
        glow: "0 10px 40px hsl(var(--primary) / 0.18)",
      },

      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, hsl(var(--gradient-start)), hsl(var(--gradient-middle)) 52%, hsl(var(--gradient-end)))",

        "brand-gradient-soft":
          "linear-gradient(135deg, hsl(var(--gradient-start) / 0.12), hsl(var(--gradient-middle) / 0.08), hsl(var(--gradient-end) / 0.1))",
      },

      borderRadius: {
        xl: "0.8rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },

  plugins: [],
};

export default config;