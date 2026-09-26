import fs from "fs";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { LANGUAGES } from "./src/data/languages.js";
import { STUDY_TOPICS } from "./src/data/studyTopics.js";

function publishCrawlableRoutes() {
  return {
    name: "publish-crawlable-routes",
    apply: "build",
    closeBundle() {
      const buildDir = path.resolve("build");
      const indexPath = path.join(buildDir, "index.html");
      if (!fs.existsSync(indexPath)) return;

      const html = fs.readFileSync(indexPath);
      fs.writeFileSync(path.join(buildDir, "404.html"), html);

      const routes = [
        "how-to-study",
        ...STUDY_TOPICS.map((topic) => `how-to-study/${topic.slug}`),
        "how-to-learn",
        ...LANGUAGES.map((language) => `how-to-learn/${language.slug}`),
      ];
      for (const route of routes) {
        const dir = path.join(buildDir, route);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), html);
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "REACT_APP_");
  const localTesting = loadEnv(mode, process.cwd(), "").LOCAL_TESTING || "false";

  return {
    plugins: [react(), publishCrawlableRoutes()],
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
