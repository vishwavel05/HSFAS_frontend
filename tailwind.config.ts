import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1E4D",
          dark: "#081538",
          light: "#132a63",
        },
        gold: {
          DEFAULT: "#F5A623",
          light: "#FCD9A0",
        },
        brand: {
          blue: "#2563EB",
          "blue-dark": "#1D4ED8",
          "blue-light": "#EFF4FF",
        },
        success: {
          DEFAULT: "#16A34A",
          light: "#DCFCE7",
        },
        danger: {
          DEFAULT: "#DC2626",
          light: "#FEE2E2",
        },
        surface: {
          DEFAULT: "#F5F7FB",
          card: "#FFFFFF",
          border: "#E5E9F2",
          muted: "#6B7280",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 2px 10px 0 rgba(11, 30, 77, 0.06)",
        "card-lg": "0 8px 30px 0 rgba(11, 30, 77, 0.10)",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
      },
      maxWidth: {
        shell: "440px",
      },
    },
  },
  plugins: [],
};

export default config;
