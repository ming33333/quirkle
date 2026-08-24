#!/usr/bin/env node
/**
 * Run Vite from a cache outside Desktop/iCloud.
 * Project node_modules on iCloud often ETIMEDOUT, so the toolchain lives in ~/.cache.
 */
const { spawn, execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const args = process.argv.slice(2);
const command = args[0] || "dev server";
console.log(`[run-vite] starting (${command === "build" ? "build" : args.length ? args.join(" ") : "dev server"})…`);

const TOOLS_DIR = path.join(os.homedir(), ".cache", "quirkle-vite-tools");
const VITE_JS = path.join(TOOLS_DIR, "node_modules", "vite", "bin", "vite.js");
const VITE_BIN = path.join(TOOLS_DIR, "node_modules", ".bin", "vite");

function ensureVite() {
  if (fs.existsSync(VITE_JS)) return;
  fs.mkdirSync(TOOLS_DIR, { recursive: true });
  const pkg = path.join(TOOLS_DIR, "package.json");
  if (!fs.existsSync(pkg)) {
    fs.writeFileSync(
      pkg,
      JSON.stringify({ name: "quirkle-vite-tools", private: true }, null, 2),
    );
  }
  console.log("[run-vite] Installing Vite once to", TOOLS_DIR);
  execSync(
    "npm install vite@6.3.5 @vitejs/plugin-react@4.7.0 --no-fund --no-audit",
    {
      cwd: TOOLS_DIR,
      stdio: "inherit",
    },
  );
}

ensureVite();

const bin = fs.existsSync(VITE_BIN) ? VITE_BIN : process.execPath;
const spawnArgs = fs.existsSync(VITE_BIN) ? args : [VITE_JS, ...args];

const env = {
  ...process.env,
  NODE_PATH: [path.join(TOOLS_DIR, "node_modules"), process.env.NODE_PATH || ""]
    .filter(Boolean)
    .join(path.delimiter),
};

const child = spawn(bin, spawnArgs, {
  cwd: path.join(__dirname, ".."),
  env,
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code ?? 0));
