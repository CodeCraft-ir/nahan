import { MENU_CATEGORIES } from "@/lib/data/navigation";
import { getMenuGroupedByCategory, MENU_ITEMS } from "@/lib/data/menu";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { WordPressApiError, wpFetchAllPages } from "@/lib/wordpress/client";
import { wpConfig } from "@/lib/wordpress/config";
import {
  groupMenuItems,
  mapMenuCategory,
  mapMenuItem,
} from "@/lib/wordpress/mappers/menu";
import type { WpPost, WpTerm } from "@/lib/wordpress/types";

export interface MenuData {
  categories: MenuCategory[];
  items: MenuItem[];
  groups: { category: MenuCategory; items: MenuItem[] }[];
}

function getStaticMenuData(): MenuData {
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

export async function getMenuData(): Promise<MenuData> {
  try {
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

    const categories = terms.map(mapMenuCategory);
    const categorySlugById = buildCategorySlugMap(terms);
    const items = posts
      .map((post) => mapMenuItem(post, categorySlugById))
      .filter((item): item is MenuItem => item !== null);

    if (categories.length === 0) {
      throw new WordPressApiError("No menu categories found", 404, "menu");
    }

    return {
      categories,
      items,
      groups: groupMenuItems(categories, items),
    };
  } catch (error) {
    console.error("[wordpress:menu]", error);

    if (wpConfig.useStaticFallback) {
      return getStaticMenuData();
    }

    throw error;
  }
}
