import { MenuWithStickyHeader } from "@/components/menu/MenuWithStickyHeader";
import { designTokens } from "@/lib/design-tokens";
import { getMenuData } from "@/lib/wordpress";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const { categories, groups } = await getMenuData();

  return (
    <div
      className="mx-auto min-h-screen w-full bg-narhan-charcoal"
      style={{ maxWidth: designTokens.layout.maxWidth }}
    >
      <MenuWithStickyHeader categories={categories} groups={groups} />
    </div>
  );
}
