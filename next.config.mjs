/** @type {import('next').NextConfig} */
const nextConfig = {
  // Разрешаем загрузку изображений с внешних источников (picsum для демо)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
