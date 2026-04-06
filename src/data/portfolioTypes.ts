// Общие типы портфолио (отдельный файл — без циклических импортов с reportage.generated)

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

export interface BioBrand {
  name: string;
  url: string | null;
}

export interface PortfolioVideo {
  id: string;
  youtubeId: string;
  title: string;
  category: Category;
  isShort: boolean;
}
