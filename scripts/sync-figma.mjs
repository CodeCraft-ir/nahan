/**
 * Sync design assets from Figma sources:
 * 1. Local .fig archive (openfig-core)
 * 2. Figma PDF exports in project root
 * 3. Optional Figma REST API (FIGMA_ACCESS_TOKEN + FIGMA_FILE_KEY)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { parseFig } from "openfig-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "../..");
const narhanRoot = join(projectRoot, "..");

const FIG_FILE = join(
  narhanRoot,
  "Minimal portfolio (Community) - Partial file saved 3-13-2026.fig",
);
const PDFS = [
  "Android Compact - 2.pdf",
  "Android Compact - 8.pdf",
  "Android Compact - 9.pdf",
];

function figColorToHex(c) {
  if (!c) return null;
  const r = Math.round((c.r ?? 0) * 255);
  const g = Math.round((c.g ?? 0) * 255);
  const b = Math.round((c.b ?? 0) * 255);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function parseLocalFig() {
  if (!existsSync(FIG_FILE)) return null;
  const doc = parseFig(new Uint8Array(readFileSync(FIG_FILE)));
  const colors = new Set();
  const texts = [];

  for (const node of doc.nodes) {
    for (const p of node.fillPaints ?? []) {
      const hex = figColorToHex(p.color);
      if (hex) colors.add(hex);
    }
    if (node.type === "TEXT" && node.textData?.characters) {
      texts.push({
        name: node.name,
        text: node.textData.characters,
        fontSize: node.fontSize,
        font: node.fontName?.family,
        color: figColorToHex(node.fillPaints?.[0]?.color),
      });
    }
  }

  return {
    header: doc.header,
    nodeCount: doc.nodes.length,
    imageCount: doc.images?.size ?? 0,
    colors: [...colors],
    persianTexts: texts.filter((t) => /[\u0600-\u06FF]/.test(t.text)),
  };
}

async function fetchFigmaApi() {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY;
  if (!token || !fileKey) return null;

  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return {
    name: json.name,
    lastModified: json.lastModified,
    pages: json.document?.children?.map((p) => p.name) ?? [],
  };
}

function exportPdfScreens() {
  const out = join(__dirname, "../public/figma/screens");
  mkdirSync(out, { recursive: true });
  for (const pdf of PDFS) {
    const src = join(narhanRoot, pdf);
    if (!existsSync(src)) continue;
    execSync(`qlmanage -t -s 2400 -o "${out}" "${src}"`, { stdio: "ignore" });
  }
}

function runImageExtraction() {
  execSync("node scripts/extract-hero.mjs", { cwd: join(__dirname, ".."), stdio: "inherit" });
  execSync("node scripts/extract-menu-images.mjs", {
    cwd: join(__dirname, ".."),
    stdio: "inherit",
  });
}

async function main() {
  console.log("=== Figma sync ===\n");

  console.log("1) Parsing local .fig …");
  const fig = parseLocalFig();
  if (fig) {
    console.log(`   nodes: ${fig.nodeCount}, images: ${fig.imageCount}`);
  } else {
    console.log("   .fig not found");
  }

  console.log("2) Exporting PDF screens …");
  exportPdfScreens();

  console.log("3) Cropping menu & hero images …");
  runImageExtraction();

  console.log("4) Figma API …");
  let api = null;
  try {
    api = await fetchFigmaApi();
    if (api) console.log(`   connected: ${api.name}`);
    else console.log("   skipped (set FIGMA_ACCESS_TOKEN + FIGMA_FILE_KEY)");
  } catch (e) {
    console.log(`   API error: ${e.message}`);
  }

  const report = {
    syncedAt: new Date().toISOString(),
    sources: {
      figFile: existsSync(FIG_FILE),
      pdfs: PDFS.map((p) => ({ file: p, exists: existsSync(join(narhanRoot, p)) })),
      figmaApi: api,
    },
    localFig: fig,
    note:
      "Narhan Android Compact screens are in PDF exports. The bundled .fig is a partial community template.",
  };

  const outPath = join(__dirname, "../figma-export/sync-report.json");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`\nReport: ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
