import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Для GitHub Pages — static export
  output: "export",
  basePath: "/banena",
  
  // Разрешаем загрузку изображений с внешних источников
  // Для static export используем unoptimized
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
