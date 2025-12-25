/** @type {import('next').NextConfig} */
const nextConfig = {
  // Для GitHub Pages — static export
  output: "export",
  basePath: "/banena",
  
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

