import { AppShell } from "@/components/layout/AppShell";
import { EventsPageContent } from "@/components/events/EventsPageContent";
import { getEventsData } from "@/lib/wordpress";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const { categories, items } = await getEventsData();

  return (
    <AppShell>
      <EventsPageContent categories={categories} items={items} />
    </AppShell>
  );
}
