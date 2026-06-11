import { AppShell } from "@/components/layout/AppShell";
import { EventsPageContent } from "@/components/events/EventsPageContent";
import { getEventsData } from "@/lib/wordpress";

export const revalidate = 300;

export default async function EventsPage() {
  const { categories, items, isOffline } = await getEventsData();

  return (
    <AppShell isOffline={isOffline}>
      <EventsPageContent categories={categories} items={items} />
    </AppShell>
  );
}
