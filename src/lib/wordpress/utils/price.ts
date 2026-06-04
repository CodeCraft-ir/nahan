function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[^\d.]/g, "");
}

export function parsePrice(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value);
  }

  if (typeof value === "string") {
    const normalized = normalizeDigits(value);
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? Math.round(parsed) : 0;
  }

  return 0;
}

export function extractPrice(source: Record<string, unknown>): number {
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
    if (parsed > 0) return parsed;
  }

  return 0;
}
