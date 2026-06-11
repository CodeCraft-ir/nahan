# نهان — کافه گالری

وب‌اپ موبایل‌فرست برای **نهان کافه گالری**، پیاده‌سازی شده با Next.js، React و Tailwind CSS بر اساس فایل‌های طراحی Figma (PDF و SVG).

## همگام‌سازی با Figma

طراحی اصلی از **PDFهای Android Compact** (خروجی Figma) و **SVGهای روت** استخراج شده است.

```bash
npm run sync:figma
```

برای اتصال مستقیم به Figma Cloud، در `.env.local` قرار دهید:

```
FIGMA_ACCESS_TOKEN=...
FIGMA_FILE_KEY=...
```

> فایل `.fig` موجود در روت، نسخهٔ جزئی از قالب «Minimal portfolio» است؛ صفحات نهان در PDFها هستند.

## اجرا

```bash
cd narhan-web
npm install
npm run dev
```

مرورگر: [http://localhost:3000](http://localhost:3000)

## صفحات

| مسیر | توضیح |
|------|--------|
| `/` | صفحه اصلی — هیرو با عکس کافه و گوشه منحنی |
| `/menu` | منو با تب‌ها و زیرمنوی دسته‌بندی |
| `/gallery` | گالری تصاویر |
| `/events` | رویدادها با کارت‌های دو ستونه |

## ساختار ماژولار

```
src/
├── app/              # صفحات App Router
├── components/
│   ├── layout/       # هدر، تب‌ها، زیرمنو
│   ├── home/         # هیرو و فوتر صفحه اصلی
│   ├── menu/         # آیتم‌های منو
│   ├── events/       # کارت رویداد
│   ├── gallery/      # گرید گالری
│   └── ui/           # لوگو، آیکون‌ها
└── lib/
    ├── data/         # داده منو، رویداد، ناوبری
    ├── types/
    └── utils/
```

## توکن‌های طراحی

- پس‌زمینه: `#2c2c2c`
- پنل / هیرو: `#414042`
- کارت: `#3a3a3a`
- اکسنت: `#e0b088`

فایل‌های طراحی اصلی در پوشه والد (`../`) قرار دارند.

## استقرار روی Vercel

1. در [Vercel](https://vercel.com) با GitHub وارد شوید و **Import** کنید: `CodeCraft-ir/nahan`
2. Framework: **Next.js** (خودکار تشخیص داده می‌شود)
3. Root Directory: خالی بگذارید (ریپو همان `narhan-web` است)
4. متغیرهای محیطی (از `.env.example`):
   - `WP_SITE_URL` — آدرس وردپرس (پیش‌فرض: `https://api.nahancafe.ir`)
   - در صورت نیاز: `WP_USE_STATIC_FALLBACK=true` اگر API در build در دسترس نبود
5. **Deploy** — هر push به `main` به‌صورت خودکار deploy می‌شود
