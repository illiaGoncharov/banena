/**
 * basePath-aware путь к статическим ассетам.
 *
 * next.config.mjs задаёт basePath: "/banena" для GitHub Pages.
 * Обычный <img src="/photos/..."> на проде будет искать /photos/...,
 * а нужно /banena/photos/... — эта утилита добавляет префикс.
 *
 * В dev-режиме (localhost) basePath не нужен.
 */
const BASE_PATH = process.env.NODE_ENV === "production" ? "/banena" : "";

export function assetPath(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${BASE_PATH}${src}`;
}
