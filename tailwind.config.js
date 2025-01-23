/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "512px",
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      boxShadow: {
        custom: "0 0 15px #f8fafc",
        top: "0 -1px 0 #3f3f46",
        bottom: "0px 1px 0px #3f3f46",
      },
    },
  },
  plugins: [],
  safelist: [
    "text-purple-300",
    "text-amber-300",
    "hover:text-purple-300",
    "hover:text-amber-400",
  ],
};
