import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { EasterEggs } from "@/components/EasterEggs";

// IBM Plex Mono — моноширный из семейства IBM, editorial-стиль, есть кириллица
const ibmPlex = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://banena.ru"),
  title: "BANENA — Фотограф, Москва",
  description: "Фотограф из Москвы. Репортаж, предметная съёмка, арт-портрет, видео.",
  keywords: ["фотограф", "Москва", "репортаж", "предметная съёмка", "портрет", "BANENA"],
  authors: [{ name: "Сергей Захаров" }],
  openGraph: {
    title: "BANENA — Фотограф, Москва",
    description: "Фотограф из Москвы. Репортаж, предметная съёмка, арт-портрет, видео.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${ibmPlex.className} antialiased`}>
        {children}
        <EasterEggs />
      </body>
    </html>
  );
}
