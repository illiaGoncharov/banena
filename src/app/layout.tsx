import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

// IBM Plex Sans — чистый, геометричный шрифт от IBM
const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BANENA — Фотограф, Москва",
  description: "Фотограф из Москвы. Репортаж, предметная съёмка, арт-портрет, видео.",
  keywords: ["фотограф", "Москва", "репортаж", "предметная съёмка", "портрет", "BANENA"],
  authors: [{ name: "Сергей" }],
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
      </body>
    </html>
  );
}
