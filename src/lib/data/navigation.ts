import type { EventCategory, MainTabId, MenuCategory } from "@/lib/types";

export const SITE_ADDRESS_FA =
  "صفائیه، کوچه ۳۲، فرعی اول، شماره ۱۲۸";
export const SITE_NAME_EN = "Nahan | Café-gallery";

export const MAIN_TABS: { id: MainTabId; label: string; href: string }[] = [
  { id: "menu", label: "منو", href: "/menu" },
  { id: "gallery", label: "گالری", href: "/gallery" },
  { id: "events", label: "رویداد", href: "/events" },
];

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: "espresso", label: "اسپرسو بار" },
  { id: "ice-coffee", label: "آیس کافی" },
  { id: "hot-bar", label: "بار گرم" },
  { id: "brew", label: "دمی بار" },
  { id: "shake", label: "شیک و بستنی" },
  { id: "sherbet", label: "شربت" },
  { id: "mocktail", label: "ماکتل" },
];

export const EVENT_CATEGORIES: EventCategory[] = [
  { id: "workshop", label: "ورکشاپ" },
  { id: "class", label: "کلاس آموزشی" },
  { id: "letters", label: "دورنشین حروف" },
  { id: "film", label: "نمایش فیلم" },
  { id: "shake", label: "شیک و بستنی" },
];
