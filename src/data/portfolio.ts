import type { Category, CategoryInfo, SectionInfo, ProjectInfo, PortfolioImage, PortfolioVideo, BioBrand } from "./portfolioTypes";
import { reportageImages } from "./reportage.generated";

// Реэкспорт типов — импорты из @/data/portfolio в компонентах не ломаются
export type { Category, CategoryInfo, SectionInfo, ProjectInfo, PortfolioImage, PortfolioVideo, BioBrand } from "./portfolioTypes";

// Категории для меню
export const categories: CategoryInfo[] = [
  { id: "reportage", title: "Репортаж" },
  { id: "product", title: "Предметная съёмка" },
  { id: "portrait", title: "Арт / Портрет" },
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
  { id: "nikola-lenivets-other",      title: "Разное",     section: "nikola-lenivets", category: "reportage" },

  // Мероприятия
  { id: "events-4-ceramics",  title: "4 ceramics",              section: "events", category: "reportage" },
  { id: "events-septemas",    title: "Septemas",                section: "events", category: "reportage" },
  { id: "events-omoda",       title: "Omoda",                   section: "events", category: "reportage" },
  { id: "events-sila-vetra",  title: "Сила ветра & Билайн",    section: "events", category: "reportage" },
  { id: "events-krutoyak",    title: "Крутояк",                 section: "events", category: "reportage" },
  { id: "events-lupine",      title: "Lupine",                  section: "events", category: "reportage" },
  { id: "events-streetbeat",  title: "Streetbeat",              section: "events", category: "reportage" },

  // Бэкстейдж
  { id: "backstage-solomon-talks", title: "Solomon Talks",      section: "backstage", category: "reportage" },
  { id: "backstage-na-shume",     title: "На шуме",             section: "backstage", category: "reportage" },
  { id: "backstage-yandex-disk",  title: "Яндекс диск",        section: "backstage", category: "reportage" },
  { id: "backstage-jughead",      title: "Jughead — мозг выкл", section: "backstage", category: "reportage" },
];

// Placeholder до появления реальных фото
const placeholderImages: PortfolioImage[] = [
  { id: "p1", src: "https://placehold.co/800x800/1a1a1a/333333?text=P1", alt: "Предмет 1", category: "product", project: "product-misc", width: 800, height: 800 },
  { id: "p2", src: "https://placehold.co/800x600/1a1a1a/333333?text=P2", alt: "Предмет 2", category: "product", project: "product-misc", width: 800, height: 600 },
  { id: "p3", src: "https://placehold.co/600x800/1a1a1a/333333?text=P3", alt: "Предмет 3", category: "product", project: "product-misc", width: 600, height: 800 },
  { id: "p4", src: "https://placehold.co/800x800/1a1a1a/333333?text=P4", alt: "Предмет 4", category: "product", project: "product-misc", width: 800, height: 800 },

  { id: "a1", src: "https://placehold.co/600x900/1a1a1a/333333?text=A1", alt: "Портрет 1", category: "portrait", project: "portrait-misc", width: 600, height: 900 },
  { id: "a2", src: "https://placehold.co/800x600/1a1a1a/333333?text=A2", alt: "Портрет 2", category: "portrait", project: "portrait-misc", width: 800, height: 600 },
  { id: "a3", src: "https://placehold.co/600x800/1a1a1a/333333?text=A3", alt: "Портрет 3", category: "portrait", project: "portrait-misc", width: 600, height: 800 },
  { id: "a4", src: "https://placehold.co/800x533/1a1a1a/333333?text=A4", alt: "Портрет 4", category: "portrait", project: "portrait-misc", width: 800, height: 533 },
  { id: "a5", src: "https://placehold.co/600x900/1a1a1a/333333?text=A5", alt: "Портрет 5", category: "portrait", project: "portrait-misc", width: 600, height: 900 },
];

export const images: PortfolioImage[] = [...reportageImages, ...placeholderImages];

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
