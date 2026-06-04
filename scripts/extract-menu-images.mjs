import sharp from "sharp";
import { mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenPath = join(
  __dirname,
  "../public/figma/screens/Android Compact - 8.pdf.png",
);
const outDir = join(__dirname, "../public/images/menu");
mkdirSync(outDir, { recursive: true });

const meta = await sharp(screenPath).metadata();
const scale = meta.width / 412;

/** فقط نوشیدنی — مختصات از Android Compact 8 @ 412px */
const items = [
  { id: "espresso-single", x: 300, y: 200, width: 100, height: 88 },
  { id: "americano", x: 300, y: 294, width: 100, height: 88 },
  { id: "narhan-potion", x: 300, y: 388, width: 100, height: 88 },
  { id: "japanese-coffee", x: 300, y: 482, width: 100, height: 88 },
  { id: "ice-coffee", x: 300, y: 576, width: 100, height: 88 },
  { id: "orange-juice", x: 300, y: 670, width: 100, height: 88 },
];

function shouldBeTransparent(r, g, b) {
  const avg = (r + g + b) / 3;
  const neutral = Math.abs(r - g) < 22 && Math.abs(g - b) < 22;
  // پس‌زمینه تیره منو
  if (avg < 72) return true;
  // پلاک خاکستری/سفید
  if (neutral && avg > 120) return true;
  if (avg > 245) return true;
  return false;
}

async function trimTransparent(input) {
  const { data, info } = await input.ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });

  let minX = info.width;
  let minY = info.height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      if (data[i + 3] > 8) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX <= minX || maxY <= minY) {
    return sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 },
    });
  }

  const pad = Math.max(2, Math.round(3 * scale));
  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).extract({
    left: Math.max(0, minX - pad),
    top: Math.max(0, minY - pad),
    width: Math.min(info.width - Math.max(0, minX - pad), maxX - minX + 1 + pad * 2),
    height: Math.min(info.height - Math.max(0, minY - pad), maxY - minY + 1 + pad * 2),
  });
}

for (const item of items) {
  const left = Math.round(item.x * scale);
  const top = Math.round(item.y * scale);
  const width = Math.round(item.width * scale);
  const height = Math.round(item.height * scale);

  const { data, info } = await sharp(screenPath)
    .extract({ left, top, width, height })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    if (shouldBeTransparent(data[i], data[i + 1], data[i + 2])) {
      data[i + 3] = 0;
    }
  }

  const cleaned = sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });

  await (await trimTransparent(cleaned)).png().toFile(join(outDir, `${item.id}.png`));
}

console.log({ width: meta.width, height: meta.height, scale, exported: items.length });
