import type { EventCategory, EventItem } from "@/lib/types";
import { wpConfig } from "@/lib/wordpress/config";
import type { WpPost, WpTerm } from "@/lib/wordpress/types";
import { pickFirstNonEmpty, stripHtml } from "@/lib/wordpress/utils/html";
import { getFeaturedImageUrl } from "@/lib/wordpress/utils/media";

function getEventTermIds(post: WpPost): number[] {
  const taxonomy = wpConfig.taxonomies.eventCategories;
  const fromField = post[taxonomy as keyof WpPost];
  if (Array.isArray(fromField)) return fromField;

  const embeddedTerms = post._embedded?.["wp:term"]?.flat() ?? [];
  return embeddedTerms
    .filter((term) => term.taxonomy === taxonomy || !term.taxonomy)
    .map((term) => term.id);
}

function getSubtitle(post: WpPost): string {
  const acf = post.acf;
  const fromAcf =
    typeof acf?.subtitle === "string"
      ? acf.subtitle
      : typeof acf?.speaker === "string"
        ? acf.speaker
        : typeof acf?.presenter === "string"
          ? acf.presenter
          : undefined;

  return pickFirstNonEmpty(
    fromAcf,
    stripHtml(post.excerpt?.rendered ?? ""),
  );
}

export function mapEventCategory(term: WpTerm): EventCategory {
  return {
    id: term.slug,
    label: term.name,
  };
}

export function mapEventItem(
  post: WpPost,
  categorySlugById: Map<number, string>,
): EventItem | null {
  const termIds = getEventTermIds(post);
  const categoryId =
    termIds
      .map((id) => categorySlugById.get(id))
      .find((slug): slug is string => Boolean(slug)) ?? "";

  if (!categoryId) return null;

  const title = stripHtml(post.title?.rendered ?? "");
  if (!title) return null;

  const image = getFeaturedImageUrl(post);

  return {
    id: String(post.id),
    categoryId,
    title,
    subtitle: getSubtitle(post),
    ...(image ? { image } : {}),
  };
}
