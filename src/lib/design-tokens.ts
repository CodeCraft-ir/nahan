/**
 * Design tokens extracted from Figma exports (Android Compact PDF/SVG)
 * and local .fig archive parsing via openfig-core.
 */
export const designTokens = {
  layout: {
    maxWidth: 412,
    heroHeight: 676,
    screenHeight: 917,
  },
  colors: {
    /** Main app background — Android Compact menu/events */
    charcoal: "#2a2a2a",
    /** Hero panel / footer text — from صفحه اصلی.svg */
    panel: "#414042",
    /** Event cards, elevated surfaces */
    card: "#3a3a3a",
    /** Sub-navigation bar */
    subnav: "#353535",
    /** Active tab, CTA buttons — sampled from Figma PDF */
    accent: "#c8a27c",
    accentHover: "#e0b088",
    /** Muted body copy */
    muted: "#9ca3af",
    /** Menu item image plate */
    imageBg: "#d9d9d9",
    white: "#ffffff",
    border: "rgba(255,255,255,0.1)",
  },
  typography: {
    fontFamily: "Modam FaNum",
    heroTitle: { size: 48, weight: 700 },
    heroSubtitle: { size: 18, weight: 300, tracking: "0.2em" },
    tab: { size: 14, weight: 500 },
    subnav: { size: 12, weight: 400 },
    menuTitle: { size: 14, weight: 600 },
    menuDesc: { size: 12, weight: 400 },
    price: { size: 12, weight: 500 },
    address: { size: 14, weight: 400 },
    brandEn: { size: 12, weight: 400 },
  },
  radii: {
    /** Bottom-left hero curve — SVG path control */
    heroBottomLeft: 97,
    menuImageBottomLeft: 24,
    menuImageOther: 16,
    card: 8,
  },
  spacing: {
    headerPaddingX: 20,
    headerPaddingTop: 24,
    tabGap: 40,
    menuRowPaddingX: 20,
    menuRowPaddingY: 14,
    menuRowGap: 8,
    /** SVG plate — زیر منو ها.svg */
    menuImagePlateWidth: 106,
    menuImagePlateHeight: 67,
    /** Slot height allows drink PNG to overflow above plate */
    menuImageSlotHeight: 86,
    menuImageMaxWidth: 92,
    menuImageMaxHeight: 88,
    priceWidth: 96,
  },
} as const;
