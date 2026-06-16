export type MainTabId = "menu" | "gallery" | "events";

export interface MenuCategory {
  id: string;
  label: string;
}

export interface MenuGroup {
  category: MenuCategory;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  price: number | null;
  /** Path from Figma export — `/images/menu/{id}.png` */
  image: string;
}

export interface EventCategory {
  id: string;
  label: string;
}

export interface EventItem {
  id: string;
  categoryId: string;
  title: string;
  subtitle: string;
  image?: string;
}

export interface EventItemDetail extends EventItem {
  categoryLabel: string;
  description?: string;
  date?: string;
  time?: string;
  capacity?: number;
  registered?: number;
  link?: string;
}

export interface GalleryCategory {
  id: string;
  label: string;
}

export interface GalleryItem {
  id: string;
  categoryId: string;
  title: string;
  image?: string;
  price?: string;
  salePrice?: string;
}

export interface GalleryItemDetail extends GalleryItem {
  categoryLabel: string;
  description?: string;
}
