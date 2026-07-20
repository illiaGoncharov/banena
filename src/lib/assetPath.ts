/**
 * basePath-aware путь к статическим ассетам.
 *
 * Сайт живёт в корне своего домена (banena.ru), поэтому basePath сейчас пустой.
 * Утилита оставлена как единая точка формирования путей: если проект снова
 * переедет на поддиректорию (например, обратно на github.io/<repo>/),
 * достаточно поменять BASE_PATH в одном месте, а не искать все <img src>.
 */
const BASE_PATH = "";

export function assetPath(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${BASE_PATH}${src}`;
}
