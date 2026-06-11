import { AppShell } from "@/components/layout/AppShell";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getGalleryData } from "@/lib/wordpress";

export const revalidate = 300;

export default async function GalleryPage() {
  const { categories, items, isOffline } = await getGalleryData();

  return (
    <AppShell isOffline={isOffline}>
      <GalleryGrid categories={categories} items={items} />
    </AppShell>
  );
}
