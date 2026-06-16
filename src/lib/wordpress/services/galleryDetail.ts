import { wpFetch } from "@/lib/wordpress/client";
import { wpConfig } from "@/lib/wordpress/config";
import type { GalleryItemDetail } from "@/lib/types";

interface NahanGalleryGroup {
  category: { id: string; label: string };
  items: {
    id: string;
    title: string;
    image: string;
    price?: string;
    sale_price?: string;
    description?: string;
  }[];
}

export async function getGalleryItemById(id: string): Promise<GalleryItemDetail | null> {
  if (wpConfig.skipWordPressApi) return null;

  const groups = await wpFetch<NahanGalleryGroup[]>("/nahan/v1/gallery");
  if (!groups?.length) return null;

  for (const group of groups) {
    const found = group.items.find((item) => item.id === id);
    if (found) {
      return {
        id: found.id,
        categoryId: group.category.id,
        categoryLabel: group.category.label,
        title: found.title,
        ...(found.image ? { image: found.image } : {}),
        ...(found.price != null ? { price: String(found.price) } : {}),
        ...(found.sale_price != null ? { salePrice: String(found.sale_price) } : {}),
        ...(found.description ? { description: found.description } : {}),
      };
    }
  }

  return null;
}
