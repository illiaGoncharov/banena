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

// Placeholder изображения через Unsplash Source (надёжнее picsum)
// Формат: https://source.unsplash.com/WIDTHxHEIGHT/?QUERY
export const images: PortfolioImage[] = [
  // Репортаж
  { id: "r1", src: "https://source.unsplash.com/800x600/?documentary,event", alt: "Репортаж 1", category: "reportage", width: 800, height: 600 },
  { id: "r2", src: "https://source.unsplash.com/600x800/?street,people", alt: "Репортаж 2", category: "reportage", width: 600, height: 800 },
  { id: "r3", src: "https://source.unsplash.com/800x533/?concert,crowd", alt: "Репортаж 3", category: "reportage", width: 800, height: 533 },
  { id: "r4", src: "https://source.unsplash.com/800x600/?journalism,city", alt: "Репортаж 4", category: "reportage", width: 800, height: 600 },
  { id: "r5", src: "https://source.unsplash.com/600x900/?protest,march", alt: "Репортаж 5", category: "reportage", width: 600, height: 900 },
  { id: "r6", src: "https://source.unsplash.com/800x600/?festival,night", alt: "Репортаж 6", category: "reportage", width: 800, height: 600 },
  
  // Предметная съёмка
  { id: "p1", src: "https://source.unsplash.com/800x800/?product,minimal", alt: "Предмет 1", category: "product", width: 800, height: 800 },
  { id: "p2", src: "https://source.unsplash.com/800x600/?object,studio", alt: "Предмет 2", category: "product", width: 800, height: 600 },
  { id: "p3", src: "https://source.unsplash.com/600x800/?still-life,design", alt: "Предмет 3", category: "product", width: 600, height: 800 },
  { id: "p4", src: "https://source.unsplash.com/800x800/?cosmetics,beauty", alt: "Предмет 4", category: "product", width: 800, height: 800 },
  
  // Портрет
  { id: "a1", src: "https://source.unsplash.com/600x900/?portrait,artistic", alt: "Портрет 1", category: "portrait", width: 600, height: 900 },
  { id: "a2", src: "https://source.unsplash.com/800x600/?face,studio", alt: "Портрет 2", category: "portrait", width: 800, height: 600 },
  { id: "a3", src: "https://source.unsplash.com/600x800/?model,fashion", alt: "Портрет 3", category: "portrait", width: 600, height: 800 },
  { id: "a4", src: "https://source.unsplash.com/800x533/?headshot,professional", alt: "Портрет 4", category: "portrait", width: 800, height: 533 },
  { id: "a5", src: "https://source.unsplash.com/600x900/?black-white,portrait", alt: "Портрет 5", category: "portrait", width: 600, height: 900 },
  
  // Видео (превьюшки)
  { id: "v1", src: "https://source.unsplash.com/1280x720/?cinema,film", alt: "Видео 1", category: "video", width: 1280, height: 720 },
  { id: "v2", src: "https://source.unsplash.com/1280x720/?video,production", alt: "Видео 2", category: "video", width: 1280, height: 720 },
  { id: "v3", src: "https://source.unsplash.com/1280x720/?camera,movie", alt: "Видео 3", category: "video", width: 1280, height: 720 },
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
