/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      screens: {
        sm: "10rem",
        md: "15rem",
        lg: "20rem",
        xl: "25rem",
      },
    },
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
        encode: ["Encode Sans", "sans-serif"],
      },
      keyframes: {
        pulseBg: {
          "0%, 100%": { backgroundColor: "#c7c7c7" },
          "50%": { backgroundColor: "rgba(160, 160, 160, 0.05)" },
        },
      },
      animation: {
        pulseBg: "pulseBg 4s infinite",
      },
      colors: {
        bgBase: "#fffffc",
        bgBase2: "#f8f9fa",
        bgBase3: "#f4f4f2",
        bgBlack: "black",
        bgSecondary: "#0f172a",
        bgSecondaryLight: "#1e293b",
        bgExtraSecondaryLight: "#334155",
        bgTertiary: "#b57c43",
        textLight: "white",
        textHollow: "#575b61",
        textDark: "black",
        errorTrue: "#b91c1c",
        errorFalse: "#16A34A",
      },
      boxShadow: {
        custom: "0 0 15px #f8fafc",
        top: "0 -1px 0 #3f3f46",
        bottom: "0px 1px 0px #3f3f46",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],

  safelist: [
    "text-purple-300",
    "text-amber-300",
    "hover:text-purple-300",
    "hover:text-amber-400",
  ],
};

// keyframes: {
//   pulseBg: {
//     "0%, 100%": { backgroundColor: "#a6a9ad" },
//     "50%": { backgroundColor: "rgba(160, 160, 160, 0.2)" },
//   },
//   rotateMove0: {
//     "0%": {
//       transform: "rotate(10deg) translateX(-13px) translateY(11px)",
//       animationTimingFunction: "ease-out",
//     },
//     "84%": {
//       transform: "rotate(14deg) translateX(-19px) translateY(22px)",
//       animationTimingFunction: "cubic-bezier(.83,.09,14,.1)",
//     },
//     "100%": { transform: "rotate(0deg) translateX(0px)" },
//   },
//   rotateMove1: {
//     "0%": {
//       transform: "rotate(21deg) translateX(-30px) translateY(-34px)",
//       animationTimingFunction: "ease-out",
//     },
//     "82%": {
//       transform: "rotate(18deg) translateX(-27px) translateY(-41px)",
//       animationTimingFunction: "cubic-bezier(.83,.09,14,.1)",
//     },
//     "100%": { transform: "rotate(0deg) translateX(0px)" },
//   },
//   rotateMove2: {
//     "0%": {
//       transform: "rotate(14deg) translateX(16px) translateY(-17px)",
//       animationTimingFunction: "ease-out",
//     },
//     "79%": {
//       transform: "rotate(19deg) translateX(18px) translateY(-13px)",
//       animationTimingFunction: "cubic-bezier(.83,.09,14,.1)",
//     },
//     "100%": { transform: "rotate(0deg) translateX(0px)" },
//   },
//   rotateMove3: {
//     "0%": {
//       transform: "rotate(-25deg) translateX(-52px) translateY(23px)",
//       animationTimingFunction: "ease-out",
//     },
//     "76%": {
//       transform: "rotate(-23deg) translateX(-47px) translateY(32px)",
//       animationTimingFunction: "cubic-bezier(.83,.09,14,.1)",
//     },
//     "100%": { transform: "rotate(0deg) translateX(0px)" },
//   },

//   rotateMove4: {
//     "0%": {
//       transform: "rotate(21deg) translateX(63px) translateY(5px)",
//       animationTimingFunction: "ease-out",
//     },
//     "83%": {
//       transform: "rotate(11deg) translateX(84px) translateY(17px)",
//       animationTimingFunction: "cubic-bezier(.83,.09,14,.1)",
//     },
//     "100%": { transform: "rotate(0deg) translateX(0px)" },
//   },
//   rotateMove5: {
//     "0%": {
//       transform: "rotate(18deg) translateX(-43px) translateY(-19px)",
//       animationTimingFunction: "ease-out",
//     },
//     "74%": {
//       transform: "rotate(11deg) translateX(-48px) translateY(-27px)",
//       animationTimingFunction: "cubic-bezier(.83,.09,14,.1)",
//     },
//     "100%": { transform: "rotate(0deg) translateX(0px)" },
//   },
// },
// animation: {
//   pulseBg: "pulseBg 3s infinite",
//   rotateMove0: "rotateMove0 .7s 1",
//   rotateMove1: "rotateMove1 .7s 1",
//   rotateMove2: "rotateMove2 .7s 1",
//   rotateMove3: "rotateMove3 .7s 1",
//   rotateMove4: "rotateMove4 .7s 1",
//   rotateMove5: "rotateMove5 .7s 1",
// },
