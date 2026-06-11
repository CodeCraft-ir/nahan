import { MENU_CATEGORIES } from "@/lib/data/navigation";
import { getMenuGroupedByCategory, MENU_ITEMS } from "@/lib/data/menu";
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
  category: { id: string; label: string };
  items: {
    id: string;
    title: string;
    description: string;
    price: string;
    image: string;
    badge: string;
  }[];
}

function parsePrice(raw: string): number {
  return Number(raw.replace(/[^0-9]/g, "")) || 0;
}

function getStaticMenuData(): Omit<MenuData, "isOffline"> {
  return {
    categories: MENU_CATEGORIES,
    items: MENU_ITEMS,
    groups: getMenuGroupedByCategory(),
  };
}

export async function getMenuData(): Promise<MenuDataResult> {
  if (wpConfig.skipWordPressApi) {
    return offlineResult(getStaticMenuData());
  }

  const groups = await wpFetch<NahanMenuGroup[]>("/nahan/v1/menu");

  if (!groups?.length) {
    return offlineResult(getStaticMenuData());
  }

  const categories: MenuCategory[] = [];
  const items: MenuItem[] = [];

  for (const group of groups) {
    categories.push({ id: group.category.id, label: group.category.label });
    for (const item of group.items) {
      items.push({
        id: item.id,
        categoryId: group.category.id,
        title: item.title,
        description: item.description,
        price: parsePrice(item.price),
        image: item.image || "",
      });
    }
  }

  return onlineResult({
    categories,
    items,
    groups: groups.map((g) => ({
      category: { id: g.category.id, label: g.category.label },
      items: g.items.map((item) => ({
        id: item.id,
        categoryId: g.category.id,
        title: item.title,
        description: item.description,
        price: parsePrice(item.price),
        image: item.image || "",
      })),
    })),
  });
}
