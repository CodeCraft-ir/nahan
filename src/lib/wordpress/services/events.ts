import { EVENT_CATEGORIES } from "@/lib/data/navigation";
import { EVENT_ITEMS } from "@/lib/data/events";
import type { EventCategory, EventItem } from "@/lib/types";
import { WordPressApiError, wpFetchAllPages } from "@/lib/wordpress/client";
import { wpConfig } from "@/lib/wordpress/config";
import {
  mapEventCategory,
  mapEventItem,
} from "@/lib/wordpress/mappers/events";
import type { WpPost, WpTerm } from "@/lib/wordpress/types";

export interface EventsData {
  categories: EventCategory[];
  items: EventItem[];
}

function getStaticEventsData(): EventsData {
  return {
    categories: EVENT_CATEGORIES,
    items: EVENT_ITEMS,
  };
}

function buildCategorySlugMap(terms: WpTerm[]): Map<number, string> {
  return new Map(terms.map((term) => [term.id, term.slug]));
}

export async function getEventsData(): Promise<EventsData> {
  try {
    const [terms, posts] = await Promise.all([
      wpFetchAllPages<WpTerm>(
        `/wp/v2/${wpConfig.taxonomies.eventCategories}`,
        { hide_empty: true, orderby: "name", order: "asc" },
      ),
      wpFetchAllPages<WpPost>(`/wp/v2/${wpConfig.postTypes.events}`, {
        _embed: true,
        status: "publish",
        orderby: "date",
        order: "desc",
      }),
    ]);

    const categories = terms.map(mapEventCategory);
    const categorySlugById = buildCategorySlugMap(terms);
    const items = posts
      .map((post) => mapEventItem(post, categorySlugById))
      .filter((item): item is EventItem => item !== null);

    if (categories.length === 0) {
      throw new WordPressApiError("No event categories found", 404, "events");
    }

    return { categories, items };
  } catch (error) {
    console.error("[wordpress:events]", error);

    if (wpConfig.useStaticFallback) {
      return getStaticEventsData();
    }

    throw error;
  }
}
