// Категории работ
export type Category = 
  | "reportage" 
  | "product" 
  | "portrait" 
  | "video" 
  | "bio";

export interface CategoryInfo {
  id: Category;
  title: string;
  subtitle?: string;
}

export interface PortfolioImage {
  id: string;
  src: string;
  alt: string;
  category: Category;
  width: number;
  height: number;
}

// Категории для меню
export const categories: CategoryInfo[] = [
  { id: "reportage", title: "Репортаж" },
  { id: "product", title: "Предметная съёмка" },
  { id: "portrait", title: "Арт / Портрет" },
  { id: "video", title: "Видео" },
  { id: "bio", title: "Био" },
];

// Placeholder изображения через placehold.co (надёжный сервис)
// Формат: https://placehold.co/WIDTHxHEIGHT/BGCOLOR/TEXTCOLOR
export const images: PortfolioImage[] = [
  // Репортаж — тёплые тона
  { id: "r1", src: "https://placehold.co/800x600/1a1a1a/333333?text=R1", alt: "Репортаж 1", category: "reportage", width: 800, height: 600 },
  { id: "r2", src: "https://placehold.co/600x800/1a1a1a/333333?text=R2", alt: "Репортаж 2", category: "reportage", width: 600, height: 800 },
  { id: "r3", src: "https://placehold.co/800x533/1a1a1a/333333?text=R3", alt: "Репортаж 3", category: "reportage", width: 800, height: 533 },
  { id: "r4", src: "https://placehold.co/800x600/1a1a1a/333333?text=R4", alt: "Репортаж 4", category: "reportage", width: 800, height: 600 },
  { id: "r5", src: "https://placehold.co/600x900/1a1a1a/333333?text=R5", alt: "Репортаж 5", category: "reportage", width: 600, height: 900 },
  { id: "r6", src: "https://placehold.co/800x600/1a1a1a/333333?text=R6", alt: "Репортаж 6", category: "reportage", width: 800, height: 600 },
  
  // Предметная съёмка — нейтральные
  { id: "p1", src: "https://placehold.co/800x800/1a1a1a/333333?text=P1", alt: "Предмет 1", category: "product", width: 800, height: 800 },
  { id: "p2", src: "https://placehold.co/800x600/1a1a1a/333333?text=P2", alt: "Предмет 2", category: "product", width: 800, height: 600 },
  { id: "p3", src: "https://placehold.co/600x800/1a1a1a/333333?text=P3", alt: "Предмет 3", category: "product", width: 600, height: 800 },
  { id: "p4", src: "https://placehold.co/800x800/1a1a1a/333333?text=P4", alt: "Предмет 4", category: "product", width: 800, height: 800 },
  
  // Портрет — холодные
  { id: "a1", src: "https://placehold.co/600x900/1a1a1a/333333?text=A1", alt: "Портрет 1", category: "portrait", width: 600, height: 900 },
  { id: "a2", src: "https://placehold.co/800x600/1a1a1a/333333?text=A2", alt: "Портрет 2", category: "portrait", width: 800, height: 600 },
  { id: "a3", src: "https://placehold.co/600x800/1a1a1a/333333?text=A3", alt: "Портрет 3", category: "portrait", width: 600, height: 800 },
  { id: "a4", src: "https://placehold.co/800x533/1a1a1a/333333?text=A4", alt: "Портрет 4", category: "portrait", width: 800, height: 533 },
  { id: "a5", src: "https://placehold.co/600x900/1a1a1a/333333?text=A5", alt: "Портрет 5", category: "portrait", width: 600, height: 900 },
  
  // Видео (превьюшки) — кинематографичные пропорции
  { id: "v1", src: "https://placehold.co/1280x720/1a1a1a/333333?text=V1", alt: "Видео 1", category: "video", width: 1280, height: 720 },
  { id: "v2", src: "https://placehold.co/1280x720/1a1a1a/333333?text=V2", alt: "Видео 2", category: "video", width: 1280, height: 720 },
  { id: "v3", src: "https://placehold.co/1280x720/1a1a1a/333333?text=V3", alt: "Видео 3", category: "video", width: 1280, height: 720 },
];

// Получить изображения по категории
export function getImagesByCategory(category: Category): PortfolioImage[] {
  return images.filter(img => img.category === category);
}

// Контактные данные
export const contacts = {
  telegram: "https://t.me/banena",
  instagram: "https://instagram.com/banenaphotography",
  email: "banena@example.com",
};

// Текст для Bio (как у Петраковой — со ссылками, перечислением работ и людей)
export const bioText = `Сергей — фотограф из Москвы. 

[СЮДА ДОБАВИТЬ: образование, курсы, мастер-классы — со ссылками]

Работал с [ИМЕНА КЛИЕНТОВ/БРЕНДОВ — со ссылками если есть].

Съёмки публиковались в [ИЗДАНИЯ — со ссылками].

Выставки: [СПИСОК ВЫСТАВОК — со ссылками на галереи].`;
