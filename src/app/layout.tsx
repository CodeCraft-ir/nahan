import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegistrar } from "@/components/ui/ServiceWorkerRegistrar";
import { NavLoadingProvider } from "@/components/ui/NavLoadingProvider";
import { PWAProvider } from "@/context/PWAContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "نهان | کافه گالری",
  description: "نهان کافه گالری — منو، گالری و رویدادها",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "نهان",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#2a2a2a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <head>
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/icons/icon-180.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        {/* Splash screens برای iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-full bg-narhan-charcoal text-white antialiased">
        <ServiceWorkerRegistrar />
        <PWAProvider>
          <NavLoadingProvider>{children}</NavLoadingProvider>
        </PWAProvider>
      </body>
    </html>
  );
}
