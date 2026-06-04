import { MENU_CATEGORIES } from "@/lib/data/navigation";
import { getMenuGroupedByCategory, MENU_ITEMS } from "@/lib/data/menu";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { wpFetchAllPages } from "@/lib/wordpress/client";
import { wpConfig } from "@/lib/wordpress/config";
import {
  groupMenuItems,
  mapMenuCategory,
  mapMenuItem,
} from "@/lib/wordpress/mappers/menu";
import {
  offlineResult,
  onlineResult,
  type WithOfflineFlag,
} from "@/lib/wordpress/offline";
import type { WpPost, WpTerm } from "@/lib/wordpress/types";

export interface MenuData {
  categories: MenuCategory[];
  items: MenuItem[];
  groups: { category: MenuCategory; items: MenuItem[] }[];
  isOffline: boolean;
}

export type MenuDataResult = WithOfflineFlag<
  Omit<MenuData, "isOffline">
>;

function getStaticMenuData(): Omit<MenuData, "isOffline"> {
  const groups = getMenuGroupedByCategory();
  return {
    categories: MENU_CATEGORIES,
    items: MENU_ITEMS,
    groups,
  };
}

function buildCategorySlugMap(terms: WpTerm[]): Map<number, string> {
  return new Map(terms.map((term) => [term.id, term.slug]));
}

export async function getMenuData(): Promise<MenuDataResult> {
  if (wpConfig.skipWordPressApi) {
    return offlineResult(getStaticMenuData());
  }

  const [terms, posts] = await Promise.all([
    wpFetchAllPages<WpTerm>(
      `/wp/v2/${wpConfig.taxonomies.menuCategories}`,
      { hide_empty: true, orderby: "name", order: "asc" },
    ),
    wpFetchAllPages<WpPost>(`/wp/v2/${wpConfig.postTypes.menuItems}`, {
      _embed: true,
      status: "publish",
      orderby: "menu_order",
      order: "asc",
    }),
  ]);

  if (!terms?.length || !posts) {
    return offlineResult(getStaticMenuData());
  }

  const categories = terms.map(mapMenuCategory);
  const categorySlugById = buildCategorySlugMap(terms);
  const items = posts
    .map((post) => mapMenuItem(post, categorySlugById))
    .filter((item): item is MenuItem => item !== null);

  if (categories.length === 0) {
    return offlineResult(getStaticMenuData());
  }

  return onlineResult({
    categories,
    items,
    groups: groupMenuItems(categories, items),
  });
}
