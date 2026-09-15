import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "REACT_APP_");
  const localTesting = loadEnv(mode, process.cwd(), "").LOCAL_TESTING || "false";

  return {
    plugins: [react()],
    envPrefix: "REACT_APP_",
    optimizeDeps: {
      entries: ["index.html"],
    },
    build: {
      outDir: "build",
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      strictPort: false,
      open: false,
      fs: {
        deny: ["legacy/**"],
      },
    },
    define: {
      ...Object.fromEntries(
        Object.entries(env).map(([key, value]) => [
          `process.env.${key}`,
          JSON.stringify(value),
        ]),
      ),
      "process.env.LOCAL_TESTING": JSON.stringify(localTesting),
      "import.meta.env.LOCAL_TESTING": JSON.stringify(localTesting),
    },
  };
});
