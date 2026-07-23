import type { Category, CategoryInfo, SectionInfo, ProjectInfo, PortfolioImage, PortfolioVideo, BioBrand } from "./portfolioTypes";
import { reportageImages } from "./reportage.generated";

// Реэкспорт типов — импорты из @/data/portfolio в компонентах не ломаются
export type { Category, CategoryInfo, SectionInfo, ProjectInfo, PortfolioImage, PortfolioVideo, BioBrand } from "./portfolioTypes";

// Категории для меню.
// product/portrait временно скрыты — реальных фото ещё нет (только репортаж и видео).
export const categories: CategoryInfo[] = [
  { id: "reportage", title: "Репортаж" },
  { id: "video", title: "Видео" },
  { id: "bio", title: "Био" },
];

// Секции внутри категорий (верхний уровень группировки)
export const sections: SectionInfo[] = [
  // Репортаж
  { id: "nikola-lenivets",  title: "Никола-Ленивец",  category: "reportage" },
  { id: "events",           title: "Мероприятия",      category: "reportage" },
  { id: "backstage",        title: "Бэкстейдж",       category: "reportage" },
];

// Проекты внутри секций
export const projects: ProjectInfo[] = [
  // Никола-Ленивец
  { id: "nikola-lenivets-2023",       title: "2023",       section: "nikola-lenivets", category: "reportage" },
  { id: "nikola-lenivets-2024",       title: "2024",       section: "nikola-lenivets", category: "reportage" },
  { id: "nikola-lenivets-2025",       title: "2025",       section: "nikola-lenivets", category: "reportage" },
  { id: "nikola-lenivets-maslenitsa", title: "Масленица",  section: "nikola-lenivets", category: "reportage" },

  // Мероприятия
  { id: "events-4-ceramics",  title: "4 ceramics",              section: "events", category: "reportage" },
  { id: "events-septemas",    title: "Septemas",                section: "events", category: "reportage" },
  { id: "events-omoda",       title: "Omoda",                   section: "events", category: "reportage" },
  { id: "events-sila-vetra",  title: "Сила ветра & Билайн",    section: "events", category: "reportage" },
  { id: "events-krutoyak",    title: "Крутояк",                 section: "events", category: "reportage" },
  { id: "events-lupine",      title: "Lupine",                  section: "events", category: "reportage" },
  { id: "events-streetbeat",  title: "Streetbeat",              section: "events", category: "reportage" },

  // Бэкстейдж — без под-проектов, единая лента (см. getImagesBySection)
];

export const images: PortfolioImage[] = [...reportageImages];

export function getImagesByCategory(category: Category): PortfolioImage[] {
  return images.filter((img) => img.category === category);
}

export function getSectionsByCategory(category: Category): SectionInfo[] {
  return sections.filter((s) => s.category === category);
}

export function getProjectsBySection(sectionId: string): ProjectInfo[] {
  return projects.filter((p) => p.section === sectionId);
}

export function getImagesByProject(projectId: string): PortfolioImage[] {
  return images.filter((img) => img.project === projectId);
}

// Для секций без под-проектов (напр. "Бэкстейдж") — фото лежат прямо
// под project === section.id, единой лентой без разбивки на альбомы.
export function getImagesBySection(sectionId: string): PortfolioImage[] {
  return images.filter((img) => img.project === sectionId);
}

// Видео с YouTube
export const videos: PortfolioVideo[] = [
  { id: "v1",  youtubeId: "KzrLv4ngqAY", title: "", category: "video", isShort: true  },
  { id: "v2",  youtubeId: "Pgml26nML5Q", title: "", category: "video", isShort: true  },
  { id: "v3",  youtubeId: "rin-Bjqh3po", title: "", category: "video", isShort: true  },
  { id: "v4",  youtubeId: "f_bb_ZveN2g", title: "", category: "video", isShort: false },
  { id: "v5",  youtubeId: "6IC-ydKJ7ZU", title: "", category: "video", isShort: false },
  { id: "v6",  youtubeId: "DRqBDFOu9JY", title: "", category: "video", isShort: true  },
  { id: "v7",  youtubeId: "OqBLlbtyCzs", title: "", category: "video", isShort: true  },
  { id: "v8",  youtubeId: "u-vocMfJQTM", title: "", category: "video", isShort: true  },
  { id: "v9",  youtubeId: "QWwF1Wr1MkE", title: "", category: "video", isShort: true  },
  { id: "v10", youtubeId: "CxsAJR4sQUE", title: "", category: "video", isShort: false },
];

// Контактные данные
export const contacts = {
  telegram: "https://t.me/banena1337A",
  instagram: "https://www.instagram.com/banena1337o?igsh=MWQ0anVwNXJnN2ZndQ==",
  email: "banena1337O@yandex.ru",
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
