# ساخت نسخه‌ی TWA اپ نهان (اندروید)

این پوشه کانفیگ تبدیل PWA نهان به یک اپ اندرویدی **TWA (Trusted Web Activity)** را نگه می‌دارد.
TWA همان سایت `https://nahancafe.ir` را داخل یک اپ اندرویدی واقعی (نصب‌شونده از فایل/گوگل‌پلی) و
**بدون نوار آدرس مرورگر** اجرا می‌کند.

## پیش‌نیازها (روی سیستم خودت)

- Node.js (نصب است)
- JDK 17 — مثلاً `brew install openjdk@17`
- Android SDK — Bubblewrap در اولین اجرا خودش پیشنهاد نصب می‌دهد (یا از طریق Android Studio)

## مراحل

### ۱) نصب Bubblewrap

```bash
npm install -g @bubblewrap/cli
```

### ۲) ساخت پروژه‌ی اندروید از روی همین کانفیگ

از داخل پوشه‌ی `twa/`:

```bash
cd twa
bubblewrap init --manifest=https://nahancafe.ir/manifest.json
```

> نکته: اگر می‌خواهی به‌جای پرسیدن سؤال‌ها، از کانفیگ آماده‌ی همین ریپو استفاده کنی،
> هنگام init مقادیر زیر را بده (یا فایل `twa-manifest.json` این پوشه را جایگزین فایلی که
> Bubblewrap می‌سازد کن، سپس `bubblewrap update` بزن):
> - Package name: `ir.nahancafe.app`
> - Host: `nahancafe.ir`
> - Start URL: `/menu`

در همین مرحله Bubblewrap یک **کلید امضا** (`android.keystore`) می‌سازد و رمزش را می‌پرسد.
این کلید را **گم نکن و جایی امن نگه دار** — برای هر آپدیت بعدی اپ به همین کلید نیاز داری.

### ۳) گرفتن اثرانگشت SHA-256 کلید امضا

```bash
bubblewrap fingerprint list
# یا مستقیم با keytool:
keytool -list -v -keystore ./android.keystore -alias android
```

مقدار `SHA256` را کپی کن (شکلی مثل `AB:CD:12:...`).

### ۴) قرار دادن اثرانگشت در سایت

در فایل [`../public/.well-known/assetlinks.json`](../public/.well-known/assetlinks.json)
مقدار `REPLACE_WITH_YOUR_SIGNING_KEY_SHA256_FINGERPRINT` را با اثرانگشت مرحله‌ی ۳ جایگزین کن،
سپس سایت را روی Liara دوباره دیپلوی کن.

بررسی کن که این آدرس درست برمی‌گردد:

```bash
curl https://nahancafe.ir/.well-known/assetlinks.json
```

> این فایل همان چیزی است که نوار آدرس مرورگر را داخل اپ مخفی می‌کند. اگر اثرانگشت اشتباه/خالی
> باشد، اپ باز می‌شود ولی نوار آدرس کروم بالای صفحه دیده می‌شود.

### ۵) ساخت فایل نصب (APK / AAB)

```bash
bubblewrap build
```

خروجی:
- `app-release-signed.apk` → برای نصب مستقیم روی گوشی (تست) و توزیع خارج از گوگل‌پلی
- `app-release-bundle.aab` → برای آپلود در گوگل‌پلی

نصب روی گوشی متصل:

```bash
adb install app-release-signed.apk
```

## آپدیت‌های بعدی

بعد از تغییر در سایت/منیفست، فقط:

```bash
cd twa
bubblewrap update      # همگام‌سازی با کانفیگ
# appVersionCode را در twa-manifest.json یک واحد زیاد کن
bubblewrap build
```

## نکته‌ی مهم درباره‌ی گوگل‌پلی (Play App Signing)

اگر اپ را در **گوگل‌پلی** منتشر کنی و Play App Signing فعال باشد، گوگل با کلید خودش هم اپ را
دوباره امضا می‌کند. در آن صورت باید اثرانگشت SHA-256ای که در کنسول گوگل‌پلی
(بخش *Setup → App integrity*) نمایش داده می‌شود را **هم** به آرایه‌ی
`sha256_cert_fingerprints` در `assetlinks.json` اضافه کنی (می‌تواند چند اثرانگشت داشته باشد).
