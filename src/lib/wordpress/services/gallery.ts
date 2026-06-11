import { GALLERY_ITEMS } from "@/lib/data/gallery";
import type { GalleryItem } from "@/lib/types";
import { wcFetchAllPages, wpFetchAllPages } from "@/lib/wordpress/client";
import { wpConfig } from "@/lib/wordpress/config";
import {
  mapWcRestProducts,
  mapWcStoreProducts,
} from "@/lib/wordpress/mappers/gallery";
import {
  offlineResult,
  onlineResult,
  type WithOfflineFlag,
} from "@/lib/wordpress/offline";
import type { WcRestProduct, WcStoreProduct, WpPost } from "@/lib/wordpress/types";

export interface GalleryData {
  items: GalleryItem[];
  isOffline: boolean;
}

export type GalleryDataResult = WithOfflineFlag<{ items: GalleryItem[] }>;

function getStaticGalleryData(): GalleryItem[] {
  return GALLERY_ITEMS;
}

/**
 * روش اول: WooCommerce REST API (v3)
 * نیاز به کلیدهای WC_CONSUMER_KEY و WC_CONSUMER_SECRET دارد
 * این روش کامل‌ترین اطلاعات رو برمی‌گردونه
 */
async function fetchFromWcRestApi(): Promise<GalleryItem[] | null> {
  const { consumerKey, consumerSecret } = wpConfig.woocommerce;

  // اگر کلیدها ست نشده، این روش رو رد می‌کنیم
  if (!consumerKey || !consumerSecret) {
    console.log("[Gallery] WC REST API keys not set, skipping...");
    return null;
  }

  const products = await wcFetchAllPages<WcRestProduct>("/wc/v3/products", {
    status: "publish",
    per_page: 100,
  });

  if (!products?.length) return null;

  console.log(`[Gallery] Fetched ${products.length} products from WC REST API`);
  return mapWcRestProducts(products);
}

/**
 * روش دوم: WooCommerce Store API (بدون نیاز به کلید)
 * این API عمومیه و نیاز به احراز هویت نداره
 */
async function fetchFromStoreApi(): Promise<GalleryItem[] | null> {
  const products = await wpFetchAllPages<WcStoreProduct>(
    "/wc/store/v1/products",
    {
      status: "publish",
      per_page: 100,
    },
  );

  if (!products?.length) return null;

  console.log(`[Gallery] Fetched ${products.length} products from WC Store API`);
  return mapWcStoreProducts(products);
}

/**
 * روش سوم: WordPress Posts API برای محصولات
 * fallback در صورت عدم دسترسی به WooCommerce
 */
async function fetchFromWpProducts(): Promise<GalleryItem[] | null> {
  const posts = await wpFetchAllPages<WpPost>("/wp/v2/product", {
    _embed: true,
    status: "publish",
    per_page: 100,
  });

  if (!posts?.length) return null;

  console.log(`[Gallery] Fetched ${posts.length} products from WP Posts API`);

  return posts.map((post) => {
    const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
    return {
      id: String(post.id),
      title: post.title.rendered.replace(/<[^>]*>/g, "").trim(),
      ...(image ? { image } : {}),
    };
  });
}

export async function getGalleryData(): Promise<GalleryDataResult> {
  if (wpConfig.skipWordPressApi) {
    return offlineResult({ items: getStaticGalleryData() });
  }

  const { consumerKey, consumerSecret } = wpConfig.woocommerce;
  const hasCreds = Boolean(consumerKey && consumerSecret);

  // اگر کلید داریم WC REST رو امتحان کن، وگرنه Store API
  const primarySource = hasCreds ? fetchFromWcRestApi : fetchFromStoreApi;
  const fallbackSource = hasCreds ? fetchFromStoreApi : fetchFromWpProducts;

  for (const source of [primarySource, fallbackSource]) {
    try {
      const items = await source();
      if (items && items.length > 0) {
        return onlineResult({ items });
      }
    } catch (error) {
      console.error(`[Gallery] Source ${source.name} failed:`, error);
    }
  }

  console.warn("[Gallery] All sources failed, using static fallback");
  return offlineResult({ items: getStaticGalleryData() });
}