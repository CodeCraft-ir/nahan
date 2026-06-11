import { EVENT_CATEGORIES } from "@/lib/data/navigation";
import { EVENT_ITEMS } from "@/lib/data/events";
import type { EventCategory, EventItem } from "@/lib/types";
import { wpFetch } from "@/lib/wordpress/client";
import { wpConfig } from "@/lib/wordpress/config";
import {
  offlineResult,
  onlineResult,
  type WithOfflineFlag,
} from "@/lib/wordpress/offline";

export interface EventsData {
  categories: EventCategory[];
  items: EventItem[];
  isOffline: boolean;
}

export type EventsDataResult = WithOfflineFlag<Omit<EventsData, "isOffline">>;

interface NahanEventGroup {
  category: { id: string; label: string };
  items: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    capacity: number;
    registered: number;
    image: string;
    link: string;
  }[];
}

function getStaticEventsData(): Omit<EventsData, "isOffline"> {
  return { categories: EVENT_CATEGORIES, items: EVENT_ITEMS };
}

function formatSubtitle(date: string, time: string): string {
  if (!date) return "";
  const parts = [date];
  if (time) parts.push(time);
  return parts.join(" — ");
}

export async function getEventsData(): Promise<EventsDataResult> {
  if (wpConfig.skipWordPressApi) {
    return offlineResult(getStaticEventsData());
  }

  const groups = await wpFetch<NahanEventGroup[]>("/nahan/v1/events");

  if (!groups?.length) {
    return offlineResult(getStaticEventsData());
  }

  const categories: EventCategory[] = [];
  const items: EventItem[] = [];

  for (const group of groups) {
    if (!group.items.length) continue;
    categories.push({ id: group.category.id, label: group.category.label });
    for (const item of group.items) {
      items.push({
        id: item.id,
        categoryId: group.category.id,
        title: item.title,
        subtitle: formatSubtitle(item.date, item.time),
        ...(item.image ? { image: item.image } : {}),
      });
    }
  }

  if (!categories.length) {
    return offlineResult(getStaticEventsData());
  }

  return onlineResult({ categories, items });
}
