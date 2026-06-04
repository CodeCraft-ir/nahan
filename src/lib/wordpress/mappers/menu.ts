import type { MenuCategory, MenuItem } from "@/lib/types";
import { wpConfig } from "@/lib/wordpress/config";
import type { WpPost, WpTerm } from "@/lib/wordpress/types";
import { pickFirstNonEmpty, stripHtml } from "@/lib/wordpress/utils/html";
import { getFeaturedImageUrl } from "@/lib/wordpress/utils/media";
import { extractPrice } from "@/lib/wordpress/utils/price";

const FALLBACK_MENU_IMAGE = "/images/menu/espresso-single.png";

function getTermIds(post: WpPost): number[] {
  const taxonomy = wpConfig.taxonomies.menuCategories;
  const fromField = post[taxonomy as keyof WpPost];
  if (Array.isArray(fromField)) return fromField;

  const embeddedTerms = post._embedded?.["wp:term"]?.flat() ?? [];
  return embeddedTerms
    .filter((term) => term.taxonomy === taxonomy || !term.taxonomy)
    .map((term) => term.id);
}

function getDescription(post: WpPost): string {
  const acf = post.acf;
  const fromAcf =
    typeof acf?.description === "string"
      ? acf.description
      : typeof acf?.menu_description === "string"
        ? acf.menu_description
        : undefined;

  return pickFirstNonEmpty(
    fromAcf,
    stripHtml(post.excerpt?.rendered ?? ""),
    stripHtml(post.content?.rendered ?? ""),
  );
}

export function mapMenuCategory(term: WpTerm): MenuCategory {
  return {
    id: term.slug,
    label: term.name,
  };
}

export function mapMenuItem(
  post: WpPost,
  categorySlugById: Map<number, string>,
): MenuItem | null {
  const termIds = getTermIds(post);
  const categoryId =
    termIds
      .map((id) => categorySlugById.get(id))
      .find((slug): slug is string => Boolean(slug)) ?? "";

  if (!categoryId) return null;

  const title = stripHtml(post.title?.rendered ?? "");
  if (!title) return null;

  return {
    id: String(post.id),
    categoryId,
    title,
    description: getDescription(post),
    price: extractPrice(post as unknown as Record<string, unknown>),
    image: getFeaturedImageUrl(post) ?? FALLBACK_MENU_IMAGE,
  };
}

export function groupMenuItems(
  categories: MenuCategory[],
  items: MenuItem[],
): { category: MenuCategory; items: MenuItem[] }[] {
  return categories.map((category) => ({
    category,
    items: items.filter((item) => item.categoryId === category.id),
  }));
}
