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
  category?: { id?: string; label?: string };
  items?: {
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

function formatSubtitle(date: string, time: string): string {
  if (!date) return "";
  const parts = [date];
  if (time) parts.push(time);
  return parts.join(" — ");
}

function emptyEvents(): Omit<EventsData, "isOffline"> {
  return { categories: [], items: [] };
}

function mapEventGroups(groups: NahanEventGroup[]): Omit<EventsData, "isOffline"> {
  const categories: EventCategory[] = [];
  const items: EventItem[] = [];

  for (const group of groups) {
    const categoryId = group.category?.id;
    const categoryLabel = group.category?.label;
    if (!categoryId || !categoryLabel) continue;

    const groupItems = Array.isArray(group.items) ? group.items : [];
    categories.push({ id: categoryId, label: categoryLabel });

    for (const item of groupItems) {
      if (!item?.id || !item.title) continue;
      items.push({
        id: item.id,
        categoryId,
        title: item.title,
        subtitle: formatSubtitle(item.date ?? "", item.time ?? ""),
        ...(item.image ? { image: item.image } : {}),
      });
    }
  }

  return { categories, items };
}

export async function getEventsData(): Promise<EventsDataResult> {
  if (wpConfig.skipWordPressApi) {
    return offlineResult(emptyEvents());
  }

  const groups = await wpFetch<NahanEventGroup[]>("/nahan/v1/events");

  if (!Array.isArray(groups)) {
    return offlineResult(emptyEvents());
  }

  return onlineResult(mapEventGroups(groups));
}
