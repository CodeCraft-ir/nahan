# Nahan Café REST API - راهنما

## پیش‌نیازها
- **WordPress 6.0+**
- **PHP 8.0+**
- **Advanced Custom Fields (ACF)** - نسخه Pro یا Free

## نصب و فعال‌سازی

### ۱. نصب پلاگین
```bash
# در wp-content/plugins/:
unzip nahan-cafe-api.zip
# یا
git clone https://github.com/nahan/nahan-cafe-api.git
```

### ۲. فعال‌سازی
- وارد پنل وردپرس شوید
- پلاگین‌ها → Installed Plugins
- "Nahan Café REST API" را فعال کنید

### ۳. بررسی داده‌های پیش‌فرض
وقتی پلاگین فعال می‌شود:
- ۳ Custom Post Type جدید ایجاد می‌شود
- ۳ Custom Taxonomy جدید ایجاد می‌شود
- ACF Field Groups خودکار ایجاد می‌شوند

---

## API Endpoints

### منو

**GET** `/wp-json/nahan/v1/menu`

```json
[
  {
    "category": {
      "id": "espresso",
      "label": "اسپرسو بار"
    },
    "items": [
      {
        "id": "12",
        "title": "اسپرسو سینگل",
        "description": "توضیح محصول",
        "price": "25,000",
        "image": "https://example.com/image.jpg",
        "badge": "محبوب"
      }
    ]
  }
]
```

---

### رویدادها

**GET** `/wp-json/nahan/v1/events`

```json
[
  {
    "category": {
      "id": "workshop",
      "label": "ورکشاپ"
    },
    "items": [
      {
        "id": "45",
        "title": "ورکشاپ دمی ریزی",
        "description": "توضیح رویداد",
        "date": "2026-06-15",
        "time": "18:30",
        "capacity": 20,
        "registered": 15,
        "image": "https://example.com/event.jpg",
        "link": "https://example.com/event/45"
      }
    ]
  }
]
```

---

### گالری

**GET** `/wp-json/nahan/v1/gallery`

```json
[
  {
    "id": "78",
    "title": "عکس کافه",
    "full": "https://example.com/image-full.jpg",
    "thumbnail": "https://example.com/image-thumbnail.jpg",
    "medium": "https://example.com/image-medium.jpg",
    "large": "https://example.com/image-large.jpg"
  }
]
```

**GET** `/wp-json/nahan/v1/gallery?group=true` (گروه‌بندی شده)

```json
[
  {
    "category": {
      "id": "interior",
      "label": "دکوراسیون"
    },
    "images": [...]
  }
]
```

---

## استفاده در Next.js

### ۱. تعریف Environment Variable

`.env.local`:
```
NEXT_PUBLIC_WP_API_URL=https://your-wordpress-site.com/wp-json
```

### ۲. ایجاد API Client

`src/lib/api.ts`:
```typescript
const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL;

export async function fetchMenu() {
  const res = await fetch(`${WP_API_URL}/nahan/v1/menu`);
  if (!res.ok) throw new Error('Failed to fetch menu');
  return res.json();
}

export async function fetchEvents() {
  const res = await fetch(`${WP_API_URL}/nahan/v1/events`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function fetchGallery(grouped = false) {
  const url = `${WP_API_URL}/nahan/v1/gallery${grouped ? '?group=true' : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch gallery');
  return res.json();
}
```

### ۳. استفاده در صفحات

`src/app/menu/page.tsx`:
```typescript
import { fetchMenu } from '@/lib/api';
import { MenuSections } from '@/components/menu/MenuSections';

export default async function MenuPage() {
  const groups = await fetchMenu();
  return <MenuSections groups={groups} />;
}
```

---

## Content Structure

### آیتم‌های منو

ایجاد/ویرایش از طریق:
- پنل وردپرس → نهان کافه → آیتم منو
- پر کنید:
  - **عنوان**: نام محصول (مثال: "اسپرسو سینگل")
  - **محتوا**: توضیح محصول
  - **تصویر**: عکس محصول
  - **دسته‌بندی**: دسته‌ی منو (مثال: "اسپرسو بار")
  - **ACF Fields**:
    - **قیمت**: 25,000
    - **برچسب**: محبوب / تازه / ویژه

### رویدادها

- پنل وردپرس → نهان کافه → رویداد
- پر کنید:
  - **عنوان**: نام رویداد
  - **محتوا**: توضیح رویداد
  - **تصویر**: عکس رویداد
  - **دسته‌بندی**: ورکشاپ / کلاس / نمایش فیلم / etc
  - **ACF Fields**:
    - **تاریخ رویداد**: 2026-06-15
    - **ساعت شروع**: 18:30
    - **ظرفیت**: 20
    - **نفرات ثبت‌نام شده**: 15

### گالری

- پنل وردپرس → نهان کافه → عکس گالری
- پر کنید:
  - **عنوان**: نام عکس
  - **تصویر**: آپلود عکس
  - **دسته‌بندی**: دکوراسیون / آشپزخانه / etc

---

## تنظیمات جدید

### ترتیب نمایش

برای تغییر ترتیب آیتم‌ها در دسته‌ی خاص:
1. پنل وردپرس → نهان کافه → آیتم منو
2. نمایش → ترتیب
3. کشیدن و رها کردن برای تغییر ترتیب

---

## Security & CORS

اگر Next.js و WordPress روی دامنه‌های مختلف‌اند، باید CORS تنظیم کنید.

اضافه کنید به `wp-config.php` یا functions.php:
```php
add_filter('rest_allowed_cors_headers', function ($allowed_headers) {
    $allowed_headers[] = 'Authorization';
    return $allowed_headers;
});
```

یا استفاده کنید از پلاگین: **Enable REST API by default for all posts**

---

## Troubleshooting

### ۱. 404 در API Endpoint
```
Solution: وارد Settings → Permalinks شوید و Save را بزنید.
```

### ۲. ACF Fields تاریک نمایش داده نمی‌شوند
```
Solution: مطمئن شوید ACF فعال است و Field Groups ذخیره شده‌اند.
```

### ۳. تصاویر نشان داده نمی‌شوند
```
Solution: مطمئن شوید Featured Image تنظیم شده است.
```

---

## توسعه‌های آینده

- [ ] Authentication/Token برای ویرایش
- [ ] Caching (Redis / WP Transients)
- [ ] Webhook برای Sync با Next.js ISR
- [ ] Search endpoint