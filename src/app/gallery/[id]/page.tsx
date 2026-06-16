import { notFound } from "next/navigation";
import { getGalleryItemById } from "@/lib/wordpress/services/galleryDetail";
import { GalleryItemDetailView } from "@/components/gallery/GalleryItemDetailView";
import { designTokens } from "@/lib/design-tokens";

export const revalidate = 300;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GalleryItemPage({ params }: Props) {
  const { id } = await params;
  const item = await getGalleryItemById(id);

  if (!item) notFound();

  return (
    <div
      className="mx-auto min-h-screen w-full bg-narhan-charcoal"
      style={{ maxWidth: designTokens.layout.maxWidth }}
    >
      <GalleryItemDetailView item={item} />
    </div>
  );
}
