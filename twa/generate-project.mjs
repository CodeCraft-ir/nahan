// Generates the Android TWA project from twa-manifest.json without any
// interactive prompts. Used both locally and in CI (GitHub Actions).
//
// It uses @bubblewrap/core directly (the same engine `bubblewrap init` uses),
// so it needs network access only to fetch the icons referenced in
// twa-manifest.json (hosted on nahancafe.ir) — NOT to any Google endpoint.
//
// Usage:  node generate-project.mjs
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const require = createRequire(import.meta.url);
const { TwaManifest, TwaGenerator, ConsoleLog } = require("@bubblewrap/core");

const targetDirectory = dirname(fileURLToPath(import.meta.url));
const manifestFile = join(targetDirectory, "twa-manifest.json");

const log = new ConsoleLog("generate");

const twaManifest = await TwaManifest.fromFile(manifestFile);

const validationError = twaManifest.validate();
if (validationError) {
  console.error("twa-manifest.json is invalid:", validationError);
  process.exit(1);
}

const generator = new TwaGenerator();
await generator.createTwaProject(targetDirectory, twaManifest, log);

// Write the checksum so `bubblewrap build` doesn't try to regenerate.
const manifestContents = await readFile(manifestFile);
const checksum = createHash("sha1").update(manifestContents).digest("hex");
await writeFile(join(targetDirectory, "manifest-checksum.txt"), checksum);

console.log("\n✓ Android TWA project generated in", targetDirectory);
