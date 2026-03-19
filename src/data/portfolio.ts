import type { Category, CategoryInfo, PortfolioImage, BioBrand } from "./portfolioTypes";
import { reportageImages } from "./reportage.generated";

// Реэкспорт типов — импорты из @/data/portfolio в компонентах не ломаются
export type { Category, CategoryInfo, PortfolioImage, BioBrand } from "./portfolioTypes";

// Категории для меню
export const categories: CategoryInfo[] = [
  { id: "reportage", title: "Репортаж" },
  { id: "product", title: "Предметная съёмка" },
  { id: "portrait", title: "Арт / Портрет" },
  { id: "video", title: "Видео" },
  { id: "bio", title: "Био" },
];

// Репортаж: реальные WebP из public/photos/reportage/ (генерация: scripts/optimize-incoming-bundle.mjs)
// Остальные разделы: placeholder до появления материалов
const placeholderImages: PortfolioImage[] = [
  // Предметная съёмка
  { id: "p1", src: "https://placehold.co/800x800/1a1a1a/333333?text=P1", alt: "Предмет 1", category: "product", width: 800, height: 800 },
  { id: "p2", src: "https://placehold.co/800x600/1a1a1a/333333?text=P2", alt: "Предмет 2", category: "product", width: 800, height: 600 },
  { id: "p3", src: "https://placehold.co/600x800/1a1a1a/333333?text=P3", alt: "Предмет 3", category: "product", width: 600, height: 800 },
  { id: "p4", src: "https://placehold.co/800x800/1a1a1a/333333?text=P4", alt: "Предмет 4", category: "product", width: 800, height: 800 },

  // Портрет
  { id: "a1", src: "https://placehold.co/600x900/1a1a1a/333333?text=A1", alt: "Портрет 1", category: "portrait", width: 600, height: 900 },
  { id: "a2", src: "https://placehold.co/800x600/1a1a1a/333333?text=A2", alt: "Портрет 2", category: "portrait", width: 800, height: 600 },
  { id: "a3", src: "https://placehold.co/600x800/1a1a1a/333333?text=A3", alt: "Портрет 3", category: "portrait", width: 600, height: 800 },
  { id: "a4", src: "https://placehold.co/800x533/1a1a1a/333333?text=A4", alt: "Портрет 4", category: "portrait", width: 800, height: 533 },
  { id: "a5", src: "https://placehold.co/600x900/1a1a1a/333333?text=A5", alt: "Портрет 5", category: "portrait", width: 600, height: 900 },

  // Видео (превью)
  { id: "v1", src: "https://placehold.co/1280x720/1a1a1a/333333?text=V1", alt: "Видео 1", category: "video", width: 1280, height: 720 },
  { id: "v2", src: "https://placehold.co/1280x720/1a1a1a/333333?text=V2", alt: "Видео 2", category: "video", width: 1280, height: 720 },
  { id: "v3", src: "https://placehold.co/1280x720/1a1a1a/333333?text=V3", alt: "Видео 3", category: "video", width: 1280, height: 720 },
];

export const images: PortfolioImage[] = [...reportageImages, ...placeholderImages];

// Получить изображения по категории
export function getImagesByCategory(category: Category): PortfolioImage[] {
  return images.filter((img) => img.category === category);
}

// Контактные данные
export const contacts = {
  telegram: "https://t.me/banena",
  instagram: "https://instagram.com/banenaphotography",
  email: "banena@example.com",
};

// Школа / образование
export const bioSchool = {
  name: "Polezreniya",
  url: "https://polezreniya.com/",
};

export const bioBrands: BioBrand[] = [
  { name: "Street Beat", url: "https://street-beat.ru/" },
  { name: "Никола-Ленивец", url: "https://nikola-lenivets.ru/" },
  { name: "Крутояк", url: "https://krutofestival.com/" },
  { name: "Сила Ветра", url: "https://silavetra.com/" },
  { name: "Lupine", url: null },
  { name: "Cube", url: "https://cube.moscow/" },
  { name: "Яндекс", url: null },
  { name: "Art&Fact", url: "https://www.art-fact-products.com" },
  { name: "Абрау-Дюрсо", url: "https://abraudurso-studio.ru/" },
  { name: "Green Mama", url: "https://mygreenmama.ru/" },
  { name: "Жостово", url: "https://zhostovo.ru/" },
  { name: "Bitey", url: "https://bite.ru/" },
];
