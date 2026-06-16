import { notFound } from "next/navigation";
import { getEventById } from "@/lib/wordpress/services/eventDetail";
import { EventDetailView } from "@/components/events/EventDetailView";
import { designTokens } from "@/lib/design-tokens";

export const revalidate = 300;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) notFound();

  return (
    <div
      className="mx-auto min-h-screen w-full bg-narhan-charcoal"
      style={{ maxWidth: designTokens.layout.maxWidth }}
    >
      <EventDetailView event={event} />
    </div>
  );
}
