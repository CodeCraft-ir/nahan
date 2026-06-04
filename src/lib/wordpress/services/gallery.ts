import { GALLERY_ITEMS } from "@/lib/data/gallery";
import type { GalleryItem } from "@/lib/types";
import {
  wcFetchAllPages,
  WordPressApiError,
  wpFetchAllPages,
} from "@/lib/wordpress/client";
import { wpConfig } from "@/lib/wordpress/config";
import {
  mapWcRestProducts,
  mapWcStoreProducts,
} from "@/lib/wordpress/mappers/gallery";
import type { WcRestProduct, WcStoreProduct, WpPost } from "@/lib/wordpress/types";

function getStaticGalleryData(): GalleryItem[] {
  return GALLERY_ITEMS;
}

async function fetchFromStoreApi(): Promise<GalleryItem[]> {
  const products = await wpFetchAllPages<WcStoreProduct>(
    "/wc/store/v1/products",
    { status: "publish" },
  );

  return mapWcStoreProducts(products);
}

async function fetchFromWcRestApi(): Promise<GalleryItem[]> {
  const products = await wcFetchAllPages<WcRestProduct>("/wc/v3/products", {
    status: "publish",
  });

  return mapWcRestProducts(products);
}

async function fetchFromWpProducts(): Promise<GalleryItem[]> {
  const posts = await wpFetchAllPages<WpPost>("/wp/v2/product", {
    _embed: true,
    status: "publish",
  });

  return posts.map((post) => {
    const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
    return {
      id: String(post.id),
      title: post.title.rendered.replace(/<[^>]*>/g, "").trim(),
      ...(image ? { image } : {}),
    };
  });
}

export async function getGalleryData(): Promise<GalleryItem[]> {
  try {
    const sources = [fetchFromStoreApi, fetchFromWcRestApi, fetchFromWpProducts];

    for (const source of sources) {
      try {
        const items = await source();
        if (items.length > 0) return items;
      } catch (error) {
        console.warn("[wordpress:gallery] source failed:", error);
      }
    }

    throw new WordPressApiError("No gallery products found", 404, "gallery");
  } catch (error) {
    console.error("[wordpress:gallery]", error);

    if (wpConfig.useStaticFallback) {
      return getStaticGalleryData();
    }

    throw error;
  }
}
