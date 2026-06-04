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

async function fetchFromStoreApi(): Promise<GalleryItem[] | null> {
  const products = await wpFetchAllPages<WcStoreProduct>(
    "/wc/store/v1/products",
    { status: "publish" },
  );

  if (!products?.length) return null;
  return mapWcStoreProducts(products);
}

async function fetchFromWcRestApi(): Promise<GalleryItem[] | null> {
  const products = await wcFetchAllPages<WcRestProduct>("/wc/v3/products", {
    status: "publish",
  });

  if (!products?.length) return null;
  return mapWcRestProducts(products);
}

async function fetchFromWpProducts(): Promise<GalleryItem[] | null> {
  const posts = await wpFetchAllPages<WpPost>("/wp/v2/product", {
    _embed: true,
    status: "publish",
  });

  if (!posts?.length) return null;

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

  const sources = [fetchFromStoreApi, fetchFromWcRestApi, fetchFromWpProducts];

  for (const source of sources) {
    const items = await source();
    if (items && items.length > 0) {
      return onlineResult({ items });
    }
  }

  return offlineResult({ items: getStaticGalleryData() });
}
