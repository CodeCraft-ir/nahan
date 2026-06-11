import type { GalleryItem } from "@/lib/types";
import type { WcRestProduct, WcStoreProduct } from "@/lib/wordpress/types";
import { pickFirstNonEmpty, stripHtml } from "@/lib/wordpress/utils/html";

// ─── WooCommerce Store API ────────────────────────────────────────────────

function mapStoreProduct(product: WcStoreProduct): GalleryItem {
  // اولین تصویر با src معتبر
  const image = product.images?.find((img) => img.src)?.src;

  return {
    id: String(product.id),
    categoryId: "",
    title: product.name,
    ...(image ? { image } : {}),
  };
}

// ─── WooCommerce REST API v3 ──────────────────────────────────────────────

function mapRestProduct(product: WcRestProduct): GalleryItem {
  const image = product.images?.find((img) => img.src)?.src;

  return {
    id: String(product.id),
    categoryId: "",
    title: product.name,
    ...(image ? { image } : {}),
  };
}

// ─── Exports ──────────────────────────────────────────────────────────────

export function mapWcStoreProducts(products: WcStoreProduct[]): GalleryItem[] {
  return products
    .map(mapStoreProduct)
    .filter((item) => item.title); // فقط محصولات با نام
}

export function mapWcRestProducts(products: WcRestProduct[]): GalleryItem[] {
  return products
    .map(mapRestProduct)
    .filter((item) => item.title); // فقط محصولات با نام
}

export function getProductDescription(
  product: WcStoreProduct | WcRestProduct,
): string {
  return pickFirstNonEmpty(
    stripHtml(product.short_description ?? ""),
    stripHtml(product.description ?? ""),
  );
}