import type { WpEmbeddedMedia, WpPost } from "@/lib/wordpress/types";

function readAcfImage(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    if (typeof record.url === "string") return record.url;
    if (typeof record.source_url === "string") return record.source_url;
  }
  return undefined;
}

export function getFeaturedImageUrl(post: WpPost): string | undefined {
  const embedded = post._embedded?.["wp:featuredmedia"]?.[0];
  if (embedded?.source_url) return embedded.source_url;

  const acf = post.acf;
  if (acf) {
    return (
      readAcfImage(acf.image) ??
      readAcfImage(acf.thumbnail) ??
      readAcfImage(acf.menu_image)
    );
  }

  return undefined;
}

export function getImageAlt(
  post: WpPost,
  fallback: string,
): string {
  const embedded = post._embedded?.["wp:featuredmedia"]?.[0];
  return embedded?.alt_text?.trim() || fallback;
}

export function getFirstProductImage(
  images?: WpEmbeddedMedia[] | { src: string; alt?: string }[],
): string | undefined {
  if (!images?.length) return undefined;
  const first = images[0];
  if ("src" in first) return first.src;
  return first.source_url;
}
