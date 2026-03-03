/**
 * Оптимизация фотографий: _incoming/<category>/ → public/photos/<category>/
 *
 * Использование:
 *   node scripts/optimize.mjs <category>
 *   node scripts/optimize.mjs reportage
 *   node scripts/optimize.mjs all          — все категории сразу
 *
 * Что делает:
 *   - Читает JPG/PNG/WEBP/TIFF из _incoming/<category>/
 *   - Ресайзит по длинной стороне до MAX_SIZE
 *   - Конвертирует в WebP (quality 82 — хороший баланс вес/качество)
 *   - Пишет в public/photos/<category>/
 *   - Выводит JSON-массив для portfolio.ts (id, src, width, height)
 */

import { readdir, mkdir } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const MAX_SIZE = 1920;
const QUALITY = 82;
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif"]);
const CATEGORIES = ["reportage", "product", "portrait", "video"];

const ROOT = new URL("..", import.meta.url).pathname;
const INCOMING = join(ROOT, "_incoming");
const OUTPUT = join(ROOT, "public", "photos");

async function optimizeCategory(category) {
  const inDir = join(INCOMING, category);
  const outDir = join(OUTPUT, category);

  let files;
  try {
    files = await readdir(inDir);
  } catch {
    console.log(`⏭  ${category}: папка _incoming/${category}/ не найдена, пропускаю`);
    return [];
  }

  const imageFiles = files
    .filter((f) => ALLOWED_EXT.has(extname(f).toLowerCase()))
    .sort();

  if (imageFiles.length === 0) {
    console.log(`⏭  ${category}: нет изображений в _incoming/${category}/`);
    return [];
  }

  await mkdir(outDir, { recursive: true });

  console.log(`\n📸 ${category}: ${imageFiles.length} файлов`);

  const results = [];

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const inPath = join(inDir, file);
    const idx = String(i + 1).padStart(3, "0");
    const outName = `${idx}.webp`;
    const outPath = join(outDir, outName);

    const image = sharp(inPath);
    const meta = await image.metadata();

    const resized = image.resize({
      width: meta.width > meta.height ? MAX_SIZE : undefined,
      height: meta.height >= meta.width ? MAX_SIZE : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });

    const buf = await resized.webp({ quality: QUALITY }).toBuffer();
    const outMeta = await sharp(buf).metadata();

    await sharp(buf).toFile(outPath);

    const entry = {
      id: `${category.charAt(0)}${idx}`,
      src: `/photos/${category}/${outName}`,
      alt: `${category} ${idx}`,
      category,
      width: outMeta.width,
      height: outMeta.height,
    };

    results.push(entry);
    const sizeKb = Math.round(buf.length / 1024);
    console.log(`  ✓ ${file} → ${outName}  (${outMeta.width}×${outMeta.height}, ${sizeKb}KB)`);
  }

  return results;
}

async function main() {
  const arg = process.argv[2];

  if (!arg) {
    console.error("Использование: node scripts/optimize.mjs <category|all>");
    console.error("Категории:", CATEGORIES.join(", "));
    process.exit(1);
  }

  const categoriesToProcess =
    arg === "all" ? CATEGORIES : [arg];

  const allResults = [];

  for (const cat of categoriesToProcess) {
    if (!CATEGORIES.includes(cat)) {
      console.error(`Неизвестная категория: ${cat}`);
      console.error("Доступные:", CATEGORIES.join(", "));
      process.exit(1);
    }
    const results = await optimizeCategory(cat);
    allResults.push(...results);
  }

  if (allResults.length > 0) {
    console.log("\n📋 Для portfolio.ts:\n");
    console.log(JSON.stringify(allResults, null, 2));
  }
}

main();
