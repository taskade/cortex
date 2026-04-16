/**
 * Assembles all artifacts into a single workspace bundle.
 *
 * Reads manifest.json + all JSON files from agents/, projects/, automations/,
 * apps/ and produces:
 *   - dist/workspace.json  (SpaceBundleData format)
 *   - cortex.tsk           (copy at repo root for one-click import)
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function listJsonFiles(dirName) {
  const dirPath = path.join(ROOT, dirName);
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(dirPath, entry.name));
}

function loadArtifacts(dirName) {
  return listJsonFiles(dirName).map((filePath) => ({
    id: path.basename(filePath, ".json"),
    data: readJson(filePath),
  }));
}

function loadAppArtifacts(dirName) {
  const dirPath = path.join(ROOT, dirName);
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      id: entry.name,
      data: readJson(path.join(dirPath, entry.name, "package.json")),
    }));
}

// Read manifest
const manifest = readJson(path.join(ROOT, "manifest.json"));

// Assemble bundle
const bundle = {
  ...manifest,
  agents: loadArtifacts("agents"),
  projects: loadArtifacts("projects"),
  automations: loadArtifacts("automations"),
  apps: loadAppArtifacts("apps"),
  assembledAt: new Date().toISOString(),
};

const output = JSON.stringify(bundle, null, 2);

// Write dist/workspace.json
fs.mkdirSync(DIST, { recursive: true });
const workspacePath = path.join(DIST, "workspace.json");
fs.writeFileSync(workspacePath, output);

// Write cortex.tsk at repo root
const tskPath = path.join(ROOT, "cortex.tsk");
fs.writeFileSync(tskPath, output);

const sizeKb = Math.round(Buffer.byteLength(output) / 1024);
console.log(`Assembled ${sizeKb} KB bundle:`);
console.log(`  ${path.relative(ROOT, workspacePath)}`);
console.log(`  ${path.relative(ROOT, tskPath)}`);
console.log(
  `  agents: ${bundle.agents.length}, projects: ${bundle.projects.length}, automations: ${bundle.automations.length}, apps: ${bundle.apps.length}`,
);
