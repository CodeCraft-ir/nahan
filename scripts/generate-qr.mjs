import QRCode from "qrcode";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const URL = "https://nahancafe.ir";
const DARK = "#2a2a2a";
const LIGHT = "#ffffff";
const ACCENT = "#c8a27c";

const outDir = resolve(process.cwd(), "public/qr");
mkdirSync(outDir, { recursive: true });

const LOGO_VIEWBOX_W = 41;
const LOGO_VIEWBOX_H = 26;
const LOGO_PATHS = `
<path d="M18.6609 15.5469H10.6447C10.0365 15.5469 9.54407 15.0545 9.54407 14.4463V6.43011C9.54407 5.82184 10.0365 5.32943 10.6447 5.32943H18.6609C19.2692 5.32943 19.7616 5.82184 19.7616 6.43011V14.4463C19.7616 15.0545 19.2692 15.5469 18.6609 15.5469ZM11.7454 13.3456H17.5602V7.53079H11.7454V13.3456Z" fill="#ffffff"/>
<path d="M12.5492 25.091C9.55855 25.091 6.64753 24.0193 4.35204 22.0424C1.58585 19.66 0 16.1914 0 12.5418V1.10048C0 0.709445 0.209998 0.347379 0.543099 0.151863C0.8762 -0.0436528 1.2962 -0.0508941 1.63654 0.13738L11.1806 5.45975L10.1089 7.3787L2.20136 2.97598V12.5418C2.20136 15.5542 3.51204 18.4145 5.79306 20.3841C8.07407 22.3538 11.0865 23.23 14.0699 22.7882L38.1763 19.2255V2.51978L18.9361 7.48732L18.3857 5.35837L39.0018 0.0360018C39.3276 -0.0508941 39.6824 0.0215191 39.9504 0.231517C40.2183 0.441516 40.3776 0.760134 40.3776 1.10048V20.1669C40.3776 20.71 39.9793 21.1734 39.4362 21.2531L14.3885 24.9606C13.773 25.0548 13.1575 25.0982 12.5492 25.0982V25.091Z" fill="#ffffff"/>
<path d="M9.80211 13.7411L3.79822 20.9446L5.48924 22.354L11.4931 15.1505L9.80211 13.7411Z" fill="#ffffff"/>
<path d="M18.9502 13.3798L18.3611 15.5009L38.979 21.2265L39.568 19.1054L18.9502 13.3798Z" fill="#ffffff"/>
`;

const qrSvgRaw = await QRCode.toString(URL, {
  type: "svg",
  errorCorrectionLevel: "H",
  margin: 2,
  color: { dark: DARK, light: LIGHT },
  width: 1024,
});

const viewBoxMatch = qrSvgRaw.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
const vbW = parseFloat(viewBoxMatch[1]);
const vbH = parseFloat(viewBoxMatch[2]);
const cx = vbW / 2;
const cy = vbH / 2;
const badgeR = vbW * 0.13;
const ringR = badgeR + vbW * 0.012;
const logoPad = badgeR * 0.32;
const logoBoxSize = badgeR * 2 - logoPad * 2;
const logoScale = Math.min(logoBoxSize / LOGO_VIEWBOX_W, logoBoxSize / LOGO_VIEWBOX_H);
const logoW = LOGO_VIEWBOX_W * logoScale;
const logoH = LOGO_VIEWBOX_H * logoScale;
const logoX = cx - logoW / 2;
const logoY = cy - logoH / 2;

const overlay =
  `<circle cx="${cx}" cy="${cy}" r="${ringR}" fill="#ffffff"/>` +
  `<circle cx="${cx}" cy="${cy}" r="${badgeR}" fill="${DARK}"/>` +
  `<g transform="translate(${logoX} ${logoY}) scale(${logoScale})">${LOGO_PATHS}</g>`;

const brandedSvg = qrSvgRaw.replace("</svg>", `${overlay}</svg>`);
writeFileSync(resolve(outDir, "nahancafe-qr.svg"), brandedSvg);

const plainSvg = await QRCode.toString(URL, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 2,
  color: { dark: DARK, light: LIGHT },
  width: 1024,
});
writeFileSync(resolve(outDir, "nahancafe-qr-plain.svg"), plainSvg);

await QRCode.toFile(resolve(outDir, "nahancafe-qr-plain.png"), URL, {
  errorCorrectionLevel: "M",
  margin: 2,
  color: { dark: DARK, light: LIGHT },
  width: 1024,
});

console.log("Generated files in", outDir);
