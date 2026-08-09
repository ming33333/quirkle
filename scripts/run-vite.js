#!/usr/bin/env node
/**
 * Run Vite from a fast local cache.
 * Desktop/iCloud-synced node_modules makes CRA and npm install hang;
 * this keeps the Vite toolchain on a normal disk path.
 */
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");

const TOOLS_DIR = path.join(os.tmpdir(), "quirkle-vite-tools");
const VITE_BIN = path.join(TOOLS_DIR, "node_modules", ".bin", "vite");

function ensureVite() {
  if (fs.existsSync(VITE_BIN)) return;
  fs.mkdirSync(TOOLS_DIR, { recursive: true });
  const pkg = path.join(TOOLS_DIR, "package.json");
  if (!fs.existsSync(pkg)) {
    fs.writeFileSync(
      pkg,
      JSON.stringify({ name: "quirkle-vite-tools", private: true }, null, 2),
    );
  }
  console.log("[run-vite] Installing Vite tooling to", TOOLS_DIR);
  execSync("npm install vite@6.3.5 @vitejs/plugin-react@4.7.0 --no-fund --no-audit", {
    cwd: TOOLS_DIR,
    stdio: "inherit",
  });
}

ensureVite();

const env = {
  ...process.env,
  NODE_PATH: [
    path.join(TOOLS_DIR, "node_modules"),
    process.env.NODE_PATH || "",
  ]
    .filter(Boolean)
    .join(path.delimiter),
};

const child = spawn(VITE_BIN, process.argv.slice(2), {
  cwd: path.join(__dirname, ".."),
  env,
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code ?? 0));
