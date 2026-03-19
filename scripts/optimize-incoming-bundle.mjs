/**
 * Импорт фотографий из _incoming/ФОТКИ ДЛЯ САЙТА/<раздел>/ (рекурсивно)
 * → public/photos/<category>/NNN.webp + генерация src/data/reportage.generated.ts
 *
 * Порядок разделов в галерее: Никола-Ленивец → Мероприятия → Бэкстейдж
 *
 * Использование: node scripts/optimize-incoming-bundle.mjs [category]
 *   category по умолчанию: reportage
 */

import { readdir, mkdir, writeFile } from "node:fs/promises";
import { join, relative, dirname, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const MAX_SIZE = 1920;
const QUALITY = 82;
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif"]);

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const BUNDLE = join(ROOT, "_incoming", "ФОТКИ ДЛЯ САЙТА");
const OUTPUT_BASE = join(ROOT, "public", "photos");

/** Порядок верхних папок внутри бандла (важен для последовательности в галерее) */
const TOP_ORDER = ["Никола-Ленивец", "Мероприятия", "Бэкстейдж"];

async function walkImages(dir, acc = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const ent of entries.sort((a, b) => a.name.localeCompare(b.name, "ru"))) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) {
      await walkImages(p, acc);
    } else if (ALLOWED_EXT.has(extname(ent.name).toLowerCase())) {
      acc.push(p);
    }
  }
  return acc;
}

/** Человекочитаемый alt: «Репортаж — …» из пути относительно бандла */
function altFromPath(absPath) {
  const rel = relative(BUNDLE, dirname(absPath));
  const normalized = rel.split(sep).filter(Boolean).join(" — ");
  return normalized ? `Репортаж — ${normalized}` : "Репортаж";
}

async function collectOrderedFiles() {
  const all = [];
  for (const top of TOP_ORDER) {
    const root = join(BUNDLE, top);
    const files = await walkImages(root);
    files.sort((a, b) => a.localeCompare(b, "ru"));
    all.push(...files);
  }
  return all;
}

async function optimizeFile(inPath, outPath) {
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
  return { width: outMeta.width ?? 0, height: outMeta.height ?? 0, sizeKb: Math.round(buf.length / 1024) };
}

function escapeTsString(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, " ");
}

async function main() {
  const category = process.argv[2] ?? "reportage";
  const outDir = join(OUTPUT_BASE, category);

  const files = await collectOrderedFiles();
  if (files.length === 0) {
    console.error("Нет изображений в", BUNDLE);
    console.error("Ожидаются папки:", TOP_ORDER.join(", "));
    process.exit(1);
  }

  await mkdir(outDir, { recursive: true });

  console.log(`\n📸 ${category}: ${files.length} файлов из бандла\n`);

  const entries = [];

  for (let i = 0; i < files.length; i++) {
    const inPath = files[i];
    const idx = String(i + 1).padStart(3, "0");
    const outName = `${idx}.webp`;
    const outPath = join(outDir, outName);

    const { width, height, sizeKb } = await optimizeFile(inPath, outPath);
    const alt = altFromPath(inPath);
    const id = `r${idx}`;

    entries.push({ id, src: `/photos/${category}/${outName}`, alt, category, width, height });
    console.log(`  ✓ ${relative(ROOT, inPath)} → ${outName} (${width}×${height}, ${sizeKb}KB)`);
  }

  const tsLines = [
    "/**",
    " * Автогенерация: node scripts/optimize-incoming-bundle.mjs",
    " * Не править вручную — перезапусти скрипт после смены исходников.",
    " */",
    "",
    'import type { PortfolioImage } from "./portfolioTypes";',
    "",
    "export const reportageImages: PortfolioImage[] = [",
  ];

  for (const e of entries) {
    tsLines.push(
      `  { id: "${e.id}", src: "${e.src}", alt: "${escapeTsString(e.alt)}", category: "reportage", width: ${e.width}, height: ${e.height} },`
    );
  }

  tsLines.push("];", "");

  const outTs = join(ROOT, "src", "data", "reportage.generated.ts");
  await writeFile(outTs, tsLines.join("\n"), "utf8");

  console.log(`\n✅ Записано: ${relative(ROOT, outTs)}`);
  console.log(`✅ WebP: ${relative(ROOT, outDir)}/ (${entries.length} файлов)\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
