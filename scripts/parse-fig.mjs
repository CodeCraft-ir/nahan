import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parseFig } from "openfig-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");
const figPath = join(
  root,
  "Minimal portfolio (Community) - Partial file saved 3-13-2026.fig",
);

const doc = parseFig(new Uint8Array(readFileSync(figPath)));

const outDir = join(__dirname, "../figma-export");
mkdirSync(outDir, { recursive: true });
mkdirSync(join(outDir, "images"), { recursive: true });

const frames = [];
const texts = [];
const colors = new Set();
const images = [];

function rgba(c) {
  if (!c || typeof c !== "object") return null;
  const r = Math.round((c.r ?? 0) * 255);
  const g = Math.round((c.g ?? 0) * 255);
  const b = Math.round((c.b ?? 0) * 255);
  const a = c.a ?? 1;
  const hex = `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  colors.add(hex);
  return { hex, rgba: `rgba(${r},${g},${b},${a})`, a };
}

function walk(node, depth = 0, path = []) {
  const name = node.name ?? node.type ?? "unknown";
  const currentPath = [...path, name];
  const type = node.type;

  if (type === "FRAME" || type === "COMPONENT" || type === "INSTANCE") {
    const box = {
      name,
      type,
      path: currentPath.join(" / "),
      width: node.size?.x ?? node.width,
      height: node.size?.y ?? node.height,
      x: node.transform?.m02 ?? node.x,
      y: node.transform?.m12 ?? node.y,
      cornerRadius: node.cornerRadius,
      fill: node.fillPaints?.map((p) => rgba(p.color)) ?? [],
    };
    if (/android compact|صفحه|منو|گالری|رویداد|home|menu|gallery|event/i.test(name)) {
      frames.push(box);
    }
  }

  if (type === "TEXT" && node.characters) {
    const style = node.textStyle ?? node.style ?? {};
    texts.push({
      text: node.characters,
      name,
      path: currentPath.join(" / "),
      fontSize: style.fontSize,
      fontFamily: style.fontFamily ?? style.fontName?.family,
      fontWeight: style.fontWeight ?? style.fontName?.style,
      color: rgba(node.fillPaints?.[0]?.color ?? node.color),
    });
  }

  if (node.fillPaints) {
    for (const p of node.fillPaints) {
      if (p.color) rgba(p.color);
      if (p.imageRef) images.push({ imageRef: p.imageRef, node: name, path: currentPath.join(" / ") });
    }
  }

  if (node.strokePaints) {
    for (const p of node.strokePaints) {
      if (p.color) rgba(p.color);
    }
  }

  const children = node.children ?? [];
  for (const child of children) {
    walk(child, depth + 1, currentPath);
  }
}

for (const node of doc.nodes ?? []) {
  walk(node);
}

// Export images from fig
let imgIndex = 0;
for (const [hash, bytes] of doc.images ?? []) {
  const outPath = join(outDir, "images", `${hash}.png`);
  writeFileSync(outPath, Buffer.from(bytes));
  imgIndex++;
}

const summary = {
  header: doc.header,
  nodeCount: doc.nodes?.length ?? 0,
  imageCount: imgIndex,
  frames: frames.slice(0, 50),
  texts,
  colors: [...colors],
  imageRefs: images.slice(0, 100),
};

writeFileSync(join(outDir, "design-tokens.json"), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({
  nodes: summary.nodeCount,
  images: summary.imageCount,
  texts: texts.length,
  frames: frames.length,
  colors: summary.colors.length,
}, null, 2));
