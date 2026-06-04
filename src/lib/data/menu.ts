import { MENU_CATEGORIES } from "@/lib/data/navigation";
import type { MenuItem } from "@/lib/types";

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "espresso-single",
    categoryId: "espresso",
    title: "اسپرسو (سینگل)",
    description: "۷۰ ۳۰ عربیکا روبوستا",
    price: 152_000,
    image: "/images/menu/espresso-single.png",
  },
  {
    id: "americano",
    categoryId: "espresso",
    title: "آمریکانو",
    description: "۷۰ ۳۰ عربیکا روبوستا",
    price: 152_000,
    image: "/images/menu/americano.png",
  },
  {
    id: "ice-coffee",
    categoryId: "ice-coffee",
    title: "آیس کافی",
    description: "۷۰ ۳۰ عربیکا روبوستا",
    price: 152_000,
    image: "/images/menu/ice-coffee.png",
  },
  {
    id: "hot-chocolate",
    categoryId: "hot-bar",
    title: "هات چاکلت",
    description: "شکلات تلخ بلژیکی",
    price: 168_000,
    image: "/images/menu/narhan-potion.png",
  },
  {
    id: "pasta",
    categoryId: "hot-bar",
    title: "پاستا هیزجی",
    description: "سس مخصوص نهان",
    price: 245_000,
    image: "/images/menu/japanese-coffee.png",
  },
  {
    id: "japanese-coffee",
    categoryId: "brew",
    title: "قهوه ژاپنی",
    description: "۷۰ ۳۰ عربیکا روبوستا",
    price: 152_000,
    image: "/images/menu/japanese-coffee.png",
  },
  {
    id: "v60",
    categoryId: "brew",
    title: "وی۶۰",
    description: "تک خواستگاه عربیکا",
    price: 175_000,
    image: "/images/menu/espresso-single.png",
  },
  {
    id: "vanilla-shake",
    categoryId: "shake",
    title: "شیک وانیل",
    description: "بستنی وانیل، شیر",
    price: 185_000,
    image: "/images/menu/ice-coffee.png",
  },
  {
    id: "orange-juice",
    categoryId: "sherbet",
    title: "آب پرتقال اسلامی",
    description: "پرتقال تازه",
    price: 152_000,
    image: "/images/menu/orange-juice.png",
  },
  {
    id: "narhan-potion",
    categoryId: "mocktail",
    title: "معجون مخصوص نهان",
    description: "موز، خیار، تخم‌مرغ پرنده، پسته، بادام، گردو",
    price: 152_000,
    image: "/images/menu/narhan-potion.png",
  },
];

export function getMenuGroupedByCategory() {
  return MENU_CATEGORIES.map((category) => ({
    category,
    items: MENU_ITEMS.filter((item) => item.categoryId === category.id),
  }));
}
