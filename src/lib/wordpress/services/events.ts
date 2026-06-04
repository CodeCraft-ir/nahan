import { EVENT_CATEGORIES } from "@/lib/data/navigation";
import { EVENT_ITEMS } from "@/lib/data/events";
import type { EventCategory, EventItem } from "@/lib/types";
import { wpFetchAllPages } from "@/lib/wordpress/client";
import { wpConfig } from "@/lib/wordpress/config";
import {
  mapEventCategory,
  mapEventItem,
} from "@/lib/wordpress/mappers/events";
import {
  offlineResult,
  onlineResult,
  type WithOfflineFlag,
} from "@/lib/wordpress/offline";
import type { WpPost, WpTerm } from "@/lib/wordpress/types";

export interface EventsData {
  categories: EventCategory[];
  items: EventItem[];
  isOffline: boolean;
}

export type EventsDataResult = WithOfflineFlag<
  Omit<EventsData, "isOffline">
>;

function getStaticEventsData(): Omit<EventsData, "isOffline"> {
  return {
    categories: EVENT_CATEGORIES,
    items: EVENT_ITEMS,
  };
}

function buildCategorySlugMap(terms: WpTerm[]): Map<number, string> {
  return new Map(terms.map((term) => [term.id, term.slug]));
}

export async function getEventsData(): Promise<EventsDataResult> {
  if (wpConfig.skipWordPressApi) {
    return offlineResult(getStaticEventsData());
  }

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

  if (!terms?.length || !posts) {
    return offlineResult(getStaticEventsData());
  }

  const categories = terms.map(mapEventCategory);
  const categorySlugById = buildCategorySlugMap(terms);
  const items = posts
    .map((post) => mapEventItem(post, categorySlugById))
    .filter((item): item is EventItem => item !== null);

  if (categories.length === 0) {
    return offlineResult(getStaticEventsData());
  }

  return onlineResult({ categories, items });
}
