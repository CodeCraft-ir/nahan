import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "نهان | کافه گالری",
  description: "نهان کافه گالری — منو، گالری و رویدادها",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <body className="min-h-full bg-narhan-charcoal text-white antialiased">
        {children}
      </body>
    </html>
  );
}
