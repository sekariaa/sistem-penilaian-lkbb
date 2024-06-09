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
        "blue-primary": "#003285",
        "blue-secondary": "#2A629A",
        "orange-primary": "#FF7F3E",
        "orange-secondary": "#FFDA78",
      },
    },
  },
  plugins: [],
};
export default config;
