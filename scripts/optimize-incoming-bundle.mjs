/**
 * Импорт фотографий из _incoming/ФОТКИ ДЛЯ САЙТА/<раздел>/ (рекурсивно)
 * → public/photos/<category>/NNN.webp + генерация src/data/reportage.generated.ts
 *
 * Порядок разделов в галерее: Никола-Ленивец → Мероприятия → Бэкстейдж
 *
 * Использование: node scripts/optimize-incoming-bundle.mjs [category]
 *   category по умолчанию: reportage
 */

import { readdir, mkdir, writeFile, rm } from "node:fs/promises";
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

/** Верхняя папка → section id (совпадает с sections[] в portfolio.ts) */
const SECTION_BY_TOP = {
  "Никола-Ленивец": "nikola-lenivets",
  "Мероприятия": "events",
  "Бэкстейдж": "backstage",
};

/** Имя подпапки → project id (совпадает с projects[] в portfolio.ts).
 *  Ключи — русские названия папок, поэтому маппинг явный, а не транслитерация.
 *  Бэкстейдж сюда не входит — там все подпапки сливаются в один общий проект
 *  "backstage" (см. projectFromPath), без разбивки по под-проектам. */
const PROJECT_BY_SUBFOLDER = {
  // Никола-Ленивец
  "2023": "nikola-lenivets-2023",
  "2024": "nikola-lenivets-2024",
  "2025": "nikola-lenivets-2025",
  "Масленица": "nikola-lenivets-maslenitsa",
  // Мероприятия
  "4 ceramics": "events-4-ceramics",
  "Выставка от обьединения Septemas": "events-septemas",
  "Презентация машины Omoda": "events-omoda",
  "Сила ветра & Билайн": "events-sila-vetra",
  "Фестиваль Крутояк": "events-krutoyak",
  "Lupine": "events-lupine",
  "Streetbeat": "events-streetbeat",
};

/** Бэкстейдж — общая лента без под-проектов: по BACKSTAGE_LIMIT фото
 *  из каждой подпапки, в этом фиксированном порядке (не алфавитном). */
const BACKSTAGE_LIMIT = 2;
const BACKSTAGE_SUBFOLDER_ORDER = [
  "Подкаст Solomon Talks",
  "Проект На шуме",
  "Яндекс диск",
  "Jughead - мозг выкл",
];

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

/** project id из пути к файлу: верхняя папка → section, подпапка → project.
 *  Файлы прямо в верхней папке (без подпапки) идут в "<section>-other".
 *  Бэкстейдж — особый случай: все подпапки сливаются в один "backstage". */
function projectFromPath(absPath) {
  const rel = relative(BUNDLE, dirname(absPath));
  // macOS хранит имена в NFD (напр. "й" = "и" + ◌̆). Нормализуем в NFC,
  // иначе ключи маппинга (NFC) не совпадут по байтам с именами папок.
  const parts = rel.split(sep).map((p) => p.normalize("NFC")).filter(Boolean);
  const [top, sub] = parts;
  const section = SECTION_BY_TOP[top];
  if (!section) return "misc";
  if (section === "backstage") return "backstage";
  if (!sub) return `${section}-other`;
  return PROJECT_BY_SUBFOLDER[sub] ?? `${section}-other`;
}

/** Бэкстейдж: по BACKSTAGE_LIMIT первых (по имени файла) фото из каждой
 *  подпапки, в фиксированном порядке BACKSTAGE_SUBFOLDER_ORDER — чтобы
 *  в общей ленте кадры шли группами по проекту в заданной последовательности. */
async function collectBackstageFiles(root) {
  const files = [];
  for (const subfolder of BACKSTAGE_SUBFOLDER_ORDER) {
    const dir = join(root, subfolder);
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    const picked = entries
      .filter((ent) => ent.isFile() && ALLOWED_EXT.has(extname(ent.name).toLowerCase()))
      .map((ent) => ent.name)
      .sort((a, b) => a.localeCompare(b, "ru"))
      .slice(0, BACKSTAGE_LIMIT);
    files.push(...picked.map((name) => join(dir, name)));
  }
  return files;
}

async function collectOrderedFiles() {
  const all = [];
  for (const top of TOP_ORDER) {
    const root = join(BUNDLE, top);
    if (top === "Бэкстейдж") {
      all.push(...(await collectBackstageFiles(root)));
      continue;
    }
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

  // Чистим старые webp перед пересборкой — иначе при уменьшении числа
  // кадров (напр. слияние бэкстейджа) в папке остаются "осиротевшие" файлы.
  await rm(outDir, { recursive: true, force: true });
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
    const project = projectFromPath(inPath);
    const id = `r${idx}`;

    entries.push({ id, src: `/photos/${category}/${outName}`, alt, project, category, width, height });
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
      `  { id: "${e.id}", src: "${e.src}", alt: "${escapeTsString(e.alt)}", category: "reportage", project: "${e.project}", width: ${e.width}, height: ${e.height} },`
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
