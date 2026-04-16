import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const JSON_DIRS = ["agents", "automations", "projects"];
const APP_DIR = "apps";

const errors = [];

function fail(message) {
  errors.push(message);
}

function assert(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    fail(`Invalid JSON: ${path.relative(ROOT, filePath)} (${String(error)})`);
    return null;
  }
}

function listJsonFiles(dirName) {
  const dirPath = path.join(ROOT, dirName);
  if (!fs.existsSync(dirPath)) {
    fail(`Missing directory: ${dirName}`);
    return [];
  }

  const files = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(dirPath, entry.name));

  if (files.length === 0) {
    fail(`Directory has no JSON files: ${dirName}`);
  }

  return files;
}

function listAppDirs(dirName) {
  const dirPath = path.join(ROOT, dirName);
  if (!fs.existsSync(dirPath)) {
    fail(`Missing directory: ${dirName}`);
    return [];
  }

  const dirs = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(dirPath, entry.name));

  if (dirs.length === 0) {
    fail(`Directory has no app subdirectories: ${dirName}`);
  }

  return dirs;
}

function validateManifest() {
  const filePath = path.join(ROOT, "manifest.json");
  if (!fs.existsSync(filePath)) {
    fail("Missing manifest.json");
    return;
  }

  const manifest = readJson(filePath);
  if (manifest == null) {
    return;
  }

  assert(
    typeof manifest.version === "string",
    "manifest.version must be a string",
  );
  assert(typeof manifest.name === "string", "manifest.name must be a string");
  assert(
    typeof manifest.spaceId === "string",
    "manifest.spaceId must be a string",
  );
}

function validateAgents() {
  for (const filePath of listJsonFiles("agents")) {
    const data = readJson(filePath);
    if (data == null) {
      continue;
    }

    const rel = path.relative(ROOT, filePath);
    assert(
      typeof data.version === "string",
      `${rel}: version must be a string`,
    );
    assert(typeof data.name === "string", `${rel}: name must be a string`);
    assert(Array.isArray(data.commands), `${rel}: commands must be an array`);
  }
}

function validateApps() {
  for (const appDir of listAppDirs(APP_DIR)) {
    const pkgPath = path.join(appDir, "package.json");
    const rel = path.relative(ROOT, appDir);

    if (!fs.existsSync(pkgPath)) {
      fail(`${rel}: missing package.json`);
      continue;
    }

    const data = readJson(pkgPath);
    if (data == null) {
      continue;
    }

    assert(typeof data.name === "string", `${rel}/package.json: name must be a string`);
  }
}

function validateAutomations() {
  for (const filePath of listJsonFiles("automations")) {
    const data = readJson(filePath);
    if (data == null) {
      continue;
    }

    const rel = path.relative(ROOT, filePath);
    assert(
      typeof data.flowTitle === "string",
      `${rel}: flowTitle must be a string`,
    );
    assert(
      typeof data.trigger === "object" && data.trigger != null,
      `${rel}: trigger object is required`,
    );
    assert(Array.isArray(data.actions), `${rel}: actions must be an array`);
  }
}

function validateProjects() {
  for (const filePath of listJsonFiles("projects")) {
    const data = readJson(filePath);
    if (data == null) {
      continue;
    }

    const rel = path.relative(ROOT, filePath);
    assert(
      typeof data.root === "object" && data.root != null,
      `${rel}: root object is required`,
    );
  }
}

validateManifest();

for (const dirName of JSON_DIRS) {
  listJsonFiles(dirName);
}
listAppDirs(APP_DIR);

validateAgents();
validateApps();
validateAutomations();
validateProjects();

if (errors.length > 0) {
  console.error("Bundle validation failed:\n");
  for (const message of errors) {
    console.error(`- ${message}`);
  }
  process.exit(1);
}

console.log("Bundle validation passed.");
