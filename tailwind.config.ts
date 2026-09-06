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
        background: "var(--background)",
        foreground: "var(--foreground)",
        stone: {
          50: "#FAF9F5",
          100: "#F4F1EA",
          200: "#E8E2D5",
          300: "#D5CBBA",
          400: "#B5A691",
          500: "#92826C",
          600: "#736451",
          700: "#574B3C",
          800: "#3D342B",
          900: "#26201A",
          950: "#16130F",
        },
        ivory: {
          50: "#FEFDFB",
          100: "#FCFAF6",
          200: "#F7F3EB",
          300: "#EFE8DA",
        },
        charcoal: {
          700: "#3A3937",
          800: "#272624",
          900: "#1B1A19",
          950: "#11100F",
        },
        bronze: {
          400: "#C4A47C",
          500: "#A6865B",
          600: "#8C6E45",
          700: "#715733",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'stone-sm': '0 1px 3px rgba(38, 32, 26, 0.05)',
        'stone-md': '0 4px 12px rgba(38, 32, 26, 0.08)',
        'stone-lg': '0 12px 30px rgba(38, 32, 26, 0.10)',
        'stone-xl': '0 20px 40px rgba(38, 32, 26, 0.12)',
      }
    },
  },
  plugins: [],
};
export default config;
