import { GALLERY_ITEMS } from "@/lib/data/gallery";
import type { GalleryCategory, GalleryItem } from "@/lib/types";
import { wpFetch } from "@/lib/wordpress/client";
import { wpConfig } from "@/lib/wordpress/config";
import {
  offlineResult,
  onlineResult,
  type WithOfflineFlag,
} from "@/lib/wordpress/offline";

export interface GalleryData {
  categories: GalleryCategory[];
  items: GalleryItem[];
  isOffline: boolean;
}

export type GalleryDataResult = WithOfflineFlag<{
  categories: GalleryCategory[];
  items: GalleryItem[];
}>;

interface NahanGalleryGroup {
  category: { id: string; label: string };
  items: {
    id: string;
    title: string;
    image: string;
    price: string;
  }[];
}

export async function getGalleryData(): Promise<GalleryDataResult> {
  if (wpConfig.skipWordPressApi) {
    return offlineResult({ categories: [], items: GALLERY_ITEMS });
  }

  const groups = await wpFetch<NahanGalleryGroup[]>("/nahan/v1/gallery");

  if (!groups?.length) {
    return offlineResult({ categories: [], items: GALLERY_ITEMS });
  }

  const categories: GalleryCategory[] = [];
  const items: GalleryItem[] = [];

  for (const group of groups) {
    if (!group.items.length) continue;
    categories.push({ id: group.category.id, label: group.category.label });
    for (const item of group.items) {
      items.push({
        id: item.id,
        categoryId: group.category.id,
        title: item.title,
        ...(item.image ? { image: item.image } : {}),
        ...(item.price ? { price: String(item.price) } : {}),
      });
    }
  }

  if (!categories.length) {
    return offlineResult({ categories: [], items: GALLERY_ITEMS });
  }

  return onlineResult({ categories, items });
}
