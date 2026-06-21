# ساخت نسخه‌ی TWA اپ نهان (اندروید)

این پوشه PWA نهان (`https://nahancafe.ir`) را به یک اپ اندرویدی **TWA (Trusted Web Activity)**
تبدیل می‌کند: همان سایت، داخل یک اپ واقعی نصب‌شونده و **بدون نوار آدرس مرورگر**.

> **چرا با GitHub Actions؟**
> از IP ایران، سرورهای گوگل لازم برای ساخت اندروید (`dl.google.com` برای Android SDK و
> Google Maven برای Gradle) تحریم‌اند و ۴۰۴ می‌دهند. پس build روی رانر گیت‌هاب انجام می‌شود
> که تحریم نیست. برای ساخت لوکال باید VPN روشن باشد (به انتهای فایل نگاه کن).

## فایل‌های این پوشه

| فایل | کارش |
|------|------|
| `twa-manifest.json` | کانفیگ کامل اپ (پکیج `ir.nahancafe.app`، هاست، رنگ، آیکون). تنها فایلی که برای تغییر اپ ویرایش می‌کنی. |
| `generate-project.mjs` | پروژه‌ی اندروید را از روی `twa-manifest.json` می‌سازد (غیرتعاملی، بدون نیاز به گوگل). |
| `package.json` / `package-lock.json` | وابستگی `@bubblewrap/cli`. |
| `android.keystore` | کلید امضا. **در گیت نیست** و نباید commit شود. ساخته شده و base64 آن در secretهای گیت‌هاب است. |

بقیه‌ی فایل‌ها (`app/`, `build.gradle`, `gradlew`, ...) خروجی تولیدی‌اند و در `.gitignore` هستند —
در CI از نو ساخته می‌شوند.

## راه‌اندازی اولیه (یک‌بار)

سه secret زیر را در گیت‌هاب اضافه کن:
**Settings → Secrets and variables → Actions → New repository secret**

| نام secret | مقدار |
|-----------|-------|
| `ANDROID_KEYSTORE_BASE64` | محتوای base64 فایل `android.keystore` |
| `ANDROID_KEYSTORE_PASSWORD` | رمز کلید امضا |
| `ANDROID_KEY_PASSWORD` | همان رمز کلید امضا |

> اگر زمانی کلید را گم کردی، یک کلید جدید بساز، اثرانگشت SHA-256 جدیدش را در
> `public/.well-known/assetlinks.json` جایگزین کن و سایت را دوباره دیپلوی کن. بدون کلید اصلی
> نمی‌توانی اپ منتشرشده در گوگل‌پلی را آپدیت کنی.

## ساخت APK / AAB

1. به تب **Actions** ریپو برو.
2. workflow با نام **Build Android TWA** را انتخاب کن → **Run workflow**.
3. بعد از پایان، از بخش **Artifacts** فایل `nahan-twa` را دانلود کن:
   - `app-release-signed.apk` → نصب مستقیم روی گوشی / توزیع خارج از گوگل‌پلی
   - `app-release-bundle.aab` → آپلود در گوگل‌پلی

نصب روی گوشی متصل: `adb install app-release-signed.apk`

(می‌توانی به‌جای دستی، یک تگ `twa-v*` پوش کنی تا خودکار build شود.)

## آپدیت اپ

1. در صورت نیاز `twa-manifest.json` را ویرایش کن و **`appVersionCode` را یک واحد زیاد کن**
   (و `appVersionName` را).
2. کامیت و پوش کن، بعد دوباره workflow را اجرا کن.

## نکته‌ی گوگل‌پلی (Play App Signing)

اگر در گوگل‌پلی منتشر کنی و Play App Signing فعال باشد، گوگل با کلید خودش هم اپ را امضا می‌کند.
آن‌وقت باید اثرانگشت SHA-256ای که در کنسول گوگل‌پلی (*Setup → App integrity*) نشان داده می‌شود
را **هم** به آرایه‌ی `sha256_cert_fingerprints` در
[`../public/.well-known/assetlinks.json`](../public/.well-known/assetlinks.json) اضافه کنی.

## ساخت لوکال (فقط با VPN)

اگر VPN داری و می‌خواهی روی سیستم خودت build کنی:

```bash
cd twa
npm ci
node generate-project.mjs
# کلید را در همین پوشه با نام android.keystore قرار بده، سپس:
export BUBBLEWRAP_KEYSTORE_PASSWORD='...'
export BUBBLEWRAP_KEY_PASSWORD='...'
./node_modules/.bin/bubblewrap build --skipPwaValidation
```

نیازمند JDK 17 و Android SDK (build-tools 34.0.0، platform android-36). bubblewrap مسیرها را از
`~/.bubblewrap/config.json` می‌خواند.
