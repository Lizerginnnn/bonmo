import type { NextConfig } from 'next';

// На GitHub Pages сайт живёт в подпапке репозитория (/bonmo).
// Путь подставляет workflow деплоя, локально он пустой.
const basePath = process.env.PAGES_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  // Статический сайт в папке out/ — GitHub Pages умеет отдавать только его
  output: 'export',
  basePath,
  images: { unoptimized: true },
  // yarn dev: пускать телефон из домашней Wi‑Fi сети (адреса 192.168.x.x)
  allowedDevOrigins: ['192.168.*.*'],
};

export default nextConfig;
