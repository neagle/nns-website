import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // sans: ["var(--font-dunbar-low)"],
        sans: ["Papyrus"],
        serif: ["Comic Sans MS"],
      },
    },
  },
  plugins: [],
} satisfies Config;
