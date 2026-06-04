import { AppShell } from "@/components/layout/AppShell";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getGalleryData } from "@/lib/wordpress";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const { items, isOffline } = await getGalleryData();

  return (
    <AppShell isOffline={isOffline}>
      <GalleryGrid items={items} />
    </AppShell>
  );
}
