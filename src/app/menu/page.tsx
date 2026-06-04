import { MenuWithStickyHeader } from "@/components/menu/MenuWithStickyHeader";
import { OfflineNotice } from "@/components/ui/OfflineNotice";
import { designTokens } from "@/lib/design-tokens";
import { getMenuData } from "@/lib/wordpress";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const { categories, groups, isOffline } = await getMenuData();

  return (
    <div
      className="mx-auto min-h-screen w-full bg-narhan-charcoal"
      style={{ maxWidth: designTokens.layout.maxWidth }}
    >
      {isOffline ? <OfflineNotice /> : null}
      <MenuWithStickyHeader categories={categories} groups={groups} />
    </div>
  );
}
