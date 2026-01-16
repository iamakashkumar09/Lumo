import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: 'class', 
  content: [
    // Scans the "app" folder (App Router pages)
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Scans the "components" folder (UI elements)
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Fallback for src directory structure
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  // Safelist ensures these classes are always generated, helpful for debugging missing styles
  safelist: [
    "bg-black", 
    "bg-white", 
    "text-black", 
    "text-white", 
    "dark:bg-black", 
    "dark:text-white"
  ],
  plugins: [
    tailwindAnimate,
  ],
};
export default config;