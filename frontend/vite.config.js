import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import dotenv from "dotenv";
import path from "path";

// Load .env file from the parent directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export default defineConfig({
  plugins: [react()],
  proxy: {
    "/api": {
      target: "https://ecommerce-main-s1rb.onrender.com",
      changeOrigin: true,
      secure: true,
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  // Optional: Accessing process.env variables manually (if needed)
  define: {
    "process.env": process.env,
  },
});
