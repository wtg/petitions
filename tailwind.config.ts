import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "cherry": "#D6001C",
        "black": "#000000",
        "dark-gray": "#515151",
        "light-gray": "#7A7777",

        "secondary-red": "#AB2328",
        "secondary-blue": "#00205B",
        "secondary-white": "#dcdcdc",
        "secondary-gray": "#b4b4b4",

        "tint-red": {
          100: "#EABCAD",
          200: "#D58570",
          300: "#C35442"
        },
        "tint-blue": {
          100: "#A5B0CB",
          200: "#667BA2",
          300: "2#B517F"
        },
        "tint-green": {
          100: "#D4E6E8",
          200: "#B3D3D5",
          300: "#94C0C6"
        }
      },

      fontFamily: {
        'display': ['Nunito', 'serif'],
        'body': ['Lato', 'sans-serif'],
        'sans-serif': ['Roboto', 'Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
} satisfies Config;
