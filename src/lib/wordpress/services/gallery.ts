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
  category?: { id?: string; label?: string };
  items?: {
    id: string;
    title: string;
    image: string;
    price?: string;
    sale_price?: string;
  }[];
}

function emptyGallery(): { categories: GalleryCategory[]; items: GalleryItem[] } {
  return { categories: [], items: [] };
}

function mapGalleryGroups(groups: NahanGalleryGroup[]) {
  const categories: GalleryCategory[] = [];
  const items: GalleryItem[] = [];

  for (const group of groups) {
    const categoryId = group.category?.id;
    const categoryLabel = group.category?.label;
    if (!categoryId || !categoryLabel) continue;

    const groupItems = Array.isArray(group.items) ? group.items : [];
    categories.push({ id: categoryId, label: categoryLabel });

    for (const item of groupItems) {
      if (!item?.id || !item.title) continue;
      items.push({
        id: item.id,
        categoryId,
        title: item.title,
        ...(item.image ? { image: item.image } : {}),
        ...(item.price != null ? { price: String(item.price) } : {}),
        ...(item.sale_price != null ? { salePrice: String(item.sale_price) } : {}),
      });
    }
  }

  return { categories, items };
}

export async function getGalleryData(): Promise<GalleryDataResult> {
  if (wpConfig.skipWordPressApi) {
    return offlineResult(emptyGallery());
  }

  const groups = await wpFetch<NahanGalleryGroup[]>("/nahan/v1/gallery");

  if (!Array.isArray(groups)) {
    return offlineResult(emptyGallery());
  }

  return onlineResult(mapGalleryGroups(groups));
}
