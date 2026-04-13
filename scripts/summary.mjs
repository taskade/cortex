import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const BUNDLE_DIRS = ["agents", "apps", "automations", "projects"];

function listJsonFiles(dirName) {
  const dirPath = path.join(ROOT, dirName);
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function printHeader(title) {
  console.log(`\n${title}`);
  console.log("-".repeat(title.length));
}

const manifestPath = path.join(ROOT, "manifest.json");
if (!fs.existsSync(manifestPath)) {
  console.error("Missing manifest.json");
  process.exit(1);
}

const manifest = readJson(manifestPath);

printHeader("Cortex Bundle Summary");
console.log(`Name: ${manifest.name ?? "Unknown"}`);
console.log(`Space ID: ${manifest.spaceId ?? "Unknown"}`);
console.log(`Version: ${manifest.version ?? "Unknown"}`);

for (const dirName of BUNDLE_DIRS) {
  const files = listJsonFiles(dirName);
  printHeader(`${dirName} (${files.length})`);

  for (const fileName of files) {
    const id = fileName.replace(/\.json$/u, "");
    console.log(`- ${id}`);
  }
}

console.log("\nSummary completed.");
