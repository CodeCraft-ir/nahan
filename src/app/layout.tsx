import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NavLoadingProvider } from "@/components/ui/NavLoadingProvider";

export const metadata: Metadata = {
  title: "نهان | کافه گالری",
  description: "نهان کافه گالری — منو، گالری و رویدادها",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "نهان",
  },
};

export const viewport: Viewport = {
  themeColor: "#2a2a2a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <style>{`
          @keyframes navShimmer {
            0% { transform: translateX(-200%); }
            100% { transform: translateX(400%); }
          }
        `}</style>
      </head>
      <body className="min-h-full bg-narhan-charcoal text-white antialiased">
        <NavLoadingProvider>
          {children}
        </NavLoadingProvider>
      </body>
    </html>
  );
}
