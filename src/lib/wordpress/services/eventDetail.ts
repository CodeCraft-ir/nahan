import { wpFetch } from "@/lib/wordpress/client";
import { wpConfig } from "@/lib/wordpress/config";
import type { EventItemDetail } from "@/lib/types";

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

export async function getEventById(id: string): Promise<EventItemDetail | null> {
  if (wpConfig.skipWordPressApi) return null;

  const groups = await wpFetch<NahanEventGroup[]>("/nahan/v1/events");
  if (!groups?.length) return null;

  for (const group of groups) {
    const found = group.items.find((item) => item.id === id);
    if (found) {
      return {
        id: found.id,
        categoryId: group.category.id,
        categoryLabel: group.category.label,
        title: found.title,
        subtitle: [found.date, found.time].filter(Boolean).join(" — "),
        ...(found.image ? { image: found.image } : {}),
        ...(found.description ? { description: found.description } : {}),
        ...(found.date ? { date: found.date } : {}),
        ...(found.time ? { time: found.time } : {}),
        ...(found.capacity ? { capacity: found.capacity } : {}),
        ...(found.registered != null ? { registered: found.registered } : {}),
        ...(found.link ? { link: found.link } : {}),
      };
    }
  }

  return null;
}
