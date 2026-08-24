#!/usr/bin/env node
/**
 * Copy Cloud Functions off Desktop/iCloud, install there, then deploy.
 * firebase deploy hangs when it tries to load node_modules from iCloud.
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const root = path.join(__dirname, "..");
const cacheRoot = path.join(os.homedir(), ".cache", "quirkle-functions-deploy");
const sourceDir = path.join(root, "quirkle-functions");
const destDir = path.join(cacheRoot, "quirkle-functions");

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    env: {
      ...process.env,
      FUNCTIONS_DISCOVERY_TIMEOUT: process.env.FUNCTIONS_DISCOVERY_TIMEOUT || "60",
    },
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

fs.rmSync(cacheRoot, { recursive: true, force: true });
fs.mkdirSync(destDir, { recursive: true });

for (const name of fs.readdirSync(sourceDir)) {
  if (name === "node_modules") continue;
  fs.cpSync(path.join(sourceDir, name), path.join(destDir, name), {
    recursive: true,
  });
}

fs.cpSync(path.join(root, "firebase.json"), path.join(cacheRoot, "firebase.json"));
fs.cpSync(path.join(root, ".firebaserc"), path.join(cacheRoot, ".firebaserc"));

console.log("[deploy-functions] Installing dependencies on local disk…");
run("npm", ["install", "--no-fund", "--no-audit"], destDir);

console.log("[deploy-functions] Deploying…");
run("firebase", ["deploy", "--only", "functions"], cacheRoot);

console.log(
  "[deploy-functions] Allowing unauthenticated invoke on adminCancelSubscription…",
);
const iam = spawnSync(
  "gcloud",
  [
    "functions",
    "add-iam-policy-binding",
    "adminCancelSubscription",
    "--region=us-central1",
    "--member=allUsers",
    "--role=roles/cloudfunctions.invoker",
    "--project=quirkle-db",
  ],
  { cwd: cacheRoot, stdio: "inherit", env: process.env },
);
if (iam.status !== 0) {
  console.warn(
    "[deploy-functions] Could not set IAM. Run this once so the browser can call the function:\n" +
      "gcloud functions add-iam-policy-binding adminCancelSubscription --region=us-central1 --member=allUsers --role=roles/cloudfunctions.invoker --project=quirkle-db",
  );
}
