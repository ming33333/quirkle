#!/usr/bin/env node
/**
 * Frontend + local API without concurrently (iCloud node_modules often times out).
 */
const { spawn } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");
const children = [];

function run(label, cmd, args) {
  console.log(`[dev] ${label}`);
  const child = spawn(cmd, args, {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  });
  children.push(child);
  child.on("exit", (code, signal) => {
    if (signal === "SIGINT" || signal === "SIGTERM") return;
    if (code) process.exitCode = code;
  });
}

run("api", process.execPath, [
  "--experimental-default-type=module",
  path.join(root, "server.js"),
]);
run("app", process.execPath, [path.join(root, "scripts", "run-vite.js")]);

const stop = () => {
  children.forEach((child) => {
    if (!child.killed) child.kill("SIGTERM");
  });
};

process.on("SIGINT", () => {
  stop();
  process.exit(0);
});
process.on("SIGTERM", stop);
