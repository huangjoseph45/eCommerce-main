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
      fontFamily: {
        spectral: ["Spectral", "serif"],
      },
      colors: {
        bgBase: "#fffffc",
        bgBase2: "#f8f9fa",
        bgBase3: "#f4f4f2",
        bgBlack: "black",
        bgSecondary: "#0f172a",
        bgSecondaryLight: "#1e293b",
        bgExtraSecondaryLight: "#334155",
        bgTertiary: "#d4a373",
        textLight: "white",
        textHollow: "#9ca3af",
        textDark: "black",
        errorTrue: "#b91c1c",
        errorFalse: "#16A34A",
      },
      boxShadow: {
        custom: "0 0 15px #f8fafc",
        top: "0 -1px 0 #3f3f46",
        bottom: "0px 1px 0px #3f3f46",
      },
      keyframes: {
        pulseBg: {
          "0%, 100%": { backgroundColor: "rgba(209, 213, 219, 0.5)" },
          "50%": { backgroundColor: "rgba(160, 160, 160, 0.5)" },
        },
        rotateMove0: {
          "0%": { transform: "rotate(0deg) translateX(0px)" },
          "50%": {
            transform: "rotate(14deg) translateX(-19px) translateY(22px)",
          },
          "100%": { transform: "rotate(0deg) translateX(0px)" },
        },
        rotateMove1: {
          "0%": { transform: "rotate(0deg) translateX(0px)" },
          "50%": {
            transform: "rotate(18deg) translateX(-27px) translateY(-41px)",
          },
          "100%": { transform: "rotate(0deg) translateX(0px)" },
        },
        rotateMove2: {
          "0%": { transform: "rotate(0deg) translateX(0px)" },
          "50%": {
            transform: "rotate(-7deg) translateX(17px) translateY(-67px)",
          },
          "100%": { transform: "rotate(0deg) translateX(0px)" },
        },
        rotateMove3: {
          "0%": { transform: "rotate(0deg) translateX(0px)" },
          "50%": {
            transform: "rotate(-23deg) translateX(-47px) translateY(32px)",
          },
          "100%": { transform: "rotate(0deg) translateX(0px)" },
        },

        rotateMove4: {
          "0%": { transform: "rotate(0deg) translateX(0px)" },
          "50%": {
            transform: "rotate(11deg) translateX(84px) translateY(17px)",
          },
          "100%": { transform: "rotate(0deg) translateX(0px)" },
        },
      },
      animation: {
        pulseBg: "pulseBg 3s infinite",
        rotateMove0: "rotateMove0 1.6s cubic-bezier(0.25, 0.4, 0.005, 1) 1",
        rotateMove1: "rotateMove1 1.6s cubic-bezier(0.25, 0.4, 0.005, 1) 1",
        rotateMove2: "rotateMove2 1.6s cubic-bezier(0.25, 0.4, 0.005, 1) 1",
        rotateMove3: "rotateMove3 1.6s cubic-bezier(0.25, 0.4, 0.005, 1) 1",
        rotateMove4: "rotateMove4 1.6s cubic-bezier(0.25, 0.4, 0.005, 1) 1",
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
