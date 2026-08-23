/**
 * CRA eagerly requires workbox-webpack-plugin in webpack.config.js.
 * That require hangs indefinitely in this environment, so npm start never binds a port.
 * This script rewrites the require to a Proxy that loads Workbox only when used.
 */
const fs = require("fs");
const path = require("path");

const configPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "react-scripts",
  "config",
  "webpack.config.js",
);

if (!fs.existsSync(configPath)) {
  console.warn("[patch-cra-workbox] react-scripts not installed; skipping.");
  process.exit(0);
}

const original = "const WorkboxWebpackPlugin = require('workbox-webpack-plugin');";
const patched = `// Lazy-load Workbox only when used (eager require hangs in some environments)
const WorkboxWebpackPlugin = new Proxy(
  {},
  {
    get(_target, prop) {
      return require('workbox-webpack-plugin')[prop];
    },
  }
);`;

const source = fs.readFileSync(configPath, "utf8");

if (source.includes("Lazy-load Workbox only when used")) {
  console.log("[patch-cra-workbox] already applied.");
  process.exit(0);
}

if (!source.includes(original)) {
  console.warn(
    "[patch-cra-workbox] expected Workbox require not found; CRA may have changed.",
  );
  process.exit(0);
}

fs.writeFileSync(configPath, source.replace(original, patched));
console.log("[patch-cra-workbox] applied.");
