import type { MenuCategory, MenuItem } from "@/lib/types";
import { wpFetch } from "@/lib/wordpress/client";
import { wpConfig } from "@/lib/wordpress/config";
import {
  offlineResult,
  onlineResult,
  type WithOfflineFlag,
} from "@/lib/wordpress/offline";

export interface MenuData {
  categories: MenuCategory[];
  items: MenuItem[];
  groups: { category: MenuCategory; items: MenuItem[] }[];
  isOffline: boolean;
}

export type MenuDataResult = WithOfflineFlag<Omit<MenuData, "isOffline">>;

interface NahanMenuGroup {
  category?: { id?: string; label?: string };
  items?: {
    id: string;
    title: string;
    description: string;
    price: string;
    image: string;
    badge: string;
  }[];
}

function parsePrice(raw: string): number {
  return Number(String(raw).replace(/[^0-9]/g, "")) || 0;
}

function emptyMenu(): Omit<MenuData, "isOffline"> {
  return { categories: [], items: [], groups: [] };
}

function mapMenuGroups(groups: NahanMenuGroup[]): Omit<MenuData, "isOffline"> {
  const categories: MenuCategory[] = [];
  const items: MenuItem[] = [];
  const mappedGroups: MenuData["groups"] = [];

  for (const group of groups) {
    const categoryId = group.category?.id;
    const categoryLabel = group.category?.label;
    if (!categoryId || !categoryLabel) continue;

    const category = { id: categoryId, label: categoryLabel };
    const groupItems: MenuItem[] = [];
    const sourceItems = Array.isArray(group.items) ? group.items : [];

    categories.push(category);

    for (const item of sourceItems) {
      if (!item?.id || !item.title) continue;
      const mapped: MenuItem = {
        id: item.id,
        categoryId,
        title: item.title,
        description: item.description ?? "",
        price: parsePrice(item.price ?? ""),
        image: item.image || "",
      };
      items.push(mapped);
      groupItems.push(mapped);
    }

    mappedGroups.push({ category, items: groupItems });
  }

  return { categories, items, groups: mappedGroups };
}

export async function getMenuData(): Promise<MenuDataResult> {
  if (wpConfig.skipWordPressApi) {
    return offlineResult(emptyMenu());
  }

  const groups = await wpFetch<NahanMenuGroup[]>("/nahan/v1/menu");

  if (!Array.isArray(groups)) {
    return offlineResult(emptyMenu());
  }

  return onlineResult(mapMenuGroups(groups));
}
