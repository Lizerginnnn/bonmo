import type { Metadata, Viewport } from "next";
import { Open_Sans, Playfair_Display } from "next/font/google";

import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  axes: ["wdth"],
  variable: "--font-open-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  style: "italic",
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Регистрация на встречи клуба бонмо́",
  description: "Форма регистрации на очные встречи клуба бонмо́ в Петербурге",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f1efe8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${openSans.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
