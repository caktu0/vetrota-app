import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#C67B5C",
          hover: "#B5651D",
        },
        secondary: {
          DEFAULT: "#6B7B3C",
        },
        accent: {
          DEFAULT: "#D97706",
        },
        background: {
          DEFAULT: "#FDFBF7",
        },
        foreground: {
          DEFAULT: "#2D241E",
        },
        card: {
          DEFAULT: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F4EFE6",
        },
        border: {
          DEFAULT: "#E8DFD3",
        },
        destructive: {
          DEFAULT: "#B91C1C",
        },
        info: {
          DEFAULT: "#6B8FAD",
        },
      },
      fontFamily: {
        heading: ["Calistoga", "serif"],
        body: ["DM Sans", "sans-serif"],
        handwriting: ["Caveat", "cursive"],
      },
      borderRadius: {
        card: "18px",
        button: "12px",
      },
      boxShadow: {
        "warm-sm": "0 1px 2px 0 rgba(198, 123, 92, 0.05)",
        "warm-DEFAULT": "0 4px 6px -1px rgba(198, 123, 92, 0.1), 0 2px 4px -1px rgba(198, 123, 92, 0.06)",
        "warm-md": "0 10px 15px -3px rgba(198, 123, 92, 0.1), 0 4px 6px -2px rgba(198, 123, 92, 0.05)",
        "warm-lg": "0 20px 25px -5px rgba(198, 123, 92, 0.1), 0 10px 10px -5px rgba(198, 123, 92, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
