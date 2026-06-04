import type { GalleryItem } from "@/lib/types";
import type { WcRestProduct, WcStoreProduct } from "@/lib/wordpress/types";
import { pickFirstNonEmpty, stripHtml } from "@/lib/wordpress/utils/html";

function mapStoreProduct(product: WcStoreProduct): GalleryItem {
  const image = product.images?.[0]?.src;

  return {
    id: String(product.id),
    title: product.name,
    ...(image ? { image } : {}),
  };
}

function mapRestProduct(product: WcRestProduct): GalleryItem {
  const image = product.images?.[0]?.src;

  return {
    id: String(product.id),
    title: product.name,
    ...(image ? { image } : {}),
  };
}

export function mapWcStoreProducts(products: WcStoreProduct[]): GalleryItem[] {
  return products.map(mapStoreProduct);
}

export function mapWcRestProducts(products: WcRestProduct[]): GalleryItem[] {
  return products.map(mapRestProduct);
}

export function getProductDescription(
  product: WcStoreProduct | WcRestProduct,
): string {
  return pickFirstNonEmpty(
    stripHtml(product.short_description ?? ""),
    stripHtml(product.description ?? ""),
  );
}
