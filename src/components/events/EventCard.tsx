import Image from "next/image";
import Link from "next/link";
import { designTokens } from "@/lib/design-tokens";
import type { EventItem } from "@/lib/types";

interface EventCardProps {
  event: EventItem;
}

export function EventCard({ event }: EventCardProps) {
  const { radii } = designTokens;

  return (
    <article
      className="flex flex-col overflow-hidden bg-narhan-card"
      style={{ borderRadius: radii.card }}
    >
      <div className="relative aspect-[4/3] w-full bg-narhan-image-bg/80">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 480px) 50vw, 240px"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-semibold leading-snug text-white">
          {event.title}
        </h3>
        <p className="mt-1 text-xs text-narhan-muted">{event.subtitle}</p>
        <Link
          href={`/events/${event.id}`}
          className="mt-3 block w-full bg-narhan-accent py-2.5 text-center text-xs font-medium text-narhan-charcoal transition hover:bg-narhan-accent-hover active:scale-95"
          style={{ borderRadius: 4 }}
        >
          جزئیات
        </Link>
      </div>
    </article>
  );
}
