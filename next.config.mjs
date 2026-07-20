/** @type {import('next').NextConfig} */
const nextConfig = {
  // Для GitHub Pages — static export
  // basePath не нужен: сайт живёт в корне своего домена (banena.ru),
  // а не в подпути github.io/banena/
  output: "export",

  images: {
    unoptimized: true,
  },
};

export default nextConfig;

