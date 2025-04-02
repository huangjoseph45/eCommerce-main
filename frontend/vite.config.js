import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    define: {
      "process.env.MY_PUBLIC_VAR": JSON.stringify(env.MY_PUBLIC_VAR),
    },
  };
});
