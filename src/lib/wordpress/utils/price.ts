function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[^\d.]/g, "");
}

export function parsePrice(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    const rounded = Math.round(value);
    return rounded > 0 ? rounded : null;
  }

  if (typeof value === "string") {
    const normalized = normalizeDigits(value);
    const parsed = Number.parseFloat(normalized);
    if (Number.isFinite(parsed) && parsed > 0) return Math.round(parsed);
  }

  return null;
}

export function extractPrice(source: Record<string, unknown>): number | null {
  const acf = source.acf as Record<string, unknown> | undefined;
  const meta = source.meta as Record<string, unknown> | undefined;

  const candidates = [
    acf?.price,
    acf?.menu_price,
    meta?.price,
    meta?.menu_price,
    source.price,
    source.regular_price,
  ];

  for (const candidate of candidates) {
    const parsed = parsePrice(candidate);
    if (parsed !== null) return parsed;
  }

  return null;
}
