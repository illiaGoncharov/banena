/**
 * Импорт фотографий из _incoming/<бандл категории>/ (рекурсивно)
 * → public/photos/<category>/NNN.webp + генерация src/data/<category>.generated.ts
 *
 * Репортаж (nested) — 2 уровня: раздел (Никола-Ленивец/Мероприятия/Бэкстейдж) → проект.
 * Портрет/Предметка (flat) — 1 уровень: подпапка = проект напрямую.
 *
 * Использование: node scripts/optimize-incoming-bundle.mjs [category]
 *   category по умолчанию: reportage
 *   доступные: reportage, portrait, product
 */

import { readdir, mkdir, writeFile, rm } from "node:fs/promises";
import { join, relative, dirname, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const MAX_SIZE = 1920;
const QUALITY = 82;
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif"]);

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const INCOMING = join(ROOT, "_incoming");
const OUTPUT_BASE = join(ROOT, "public", "photos");
const DATA_DIR = join(ROOT, "src", "data");

// ============================================================
// Репортаж — nested-бандл (раздел → проект)
// ============================================================

const REPORTAGE_BUNDLE = join(INCOMING, "ФОТКИ ДЛЯ САЙТА");

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
 *  Масленица сюда не входит — у неё свои подпапки-годы (см. projectFromPath).
 *  Бэкстейдж сюда не входит — это плоская лента без под-проектов. */
const PROJECT_BY_SUBFOLDER = {
  // Никола-Ленивец
  "2023": "nikola-lenivets-2023",
  "2024": "nikola-lenivets-2024",
  "2025": "nikola-lenivets-2025",
  // Мероприятия
  "4 ceramics": "events-4-ceramics",
  "Выставка от обьединения Septemas": "events-septemas",
  "Презентация машины Omoda": "events-omoda",
  "Сила ветра & Билайн": "events-sila-vetra",
  "Фестиваль Крутояк": "events-krutoyak",
  "Lupine": "events-lupine",
  "Streetbeat": "events-streetbeat",
};

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
  const rel = relative(REPORTAGE_BUNDLE, dirname(absPath));
  const normalized = rel.split(sep).filter(Boolean).join(" — ");
  return normalized ? `Репортаж — ${normalized}` : "Репортаж";
}

/** project id из пути к файлу: верхняя папка → section, подпапка → project.
 *  Масленица — особый случай: под-подпапка-год даёт отдельный проект
 *  (nikola-lenivets-maslenitsa-2024/2026), т.к. на новом диске так разложено.
 *  Бэкстейдж — особый случай: плоская лента, все файлы в одном "backstage". */
function projectFromPath(absPath) {
  const rel = relative(REPORTAGE_BUNDLE, dirname(absPath));
  // macOS хранит имена в NFD (напр. "й" = "и" + ◌̆). Нормализуем в NFC,
  // иначе ключи маппинга (NFC) не совпадут по байтам с именами папок.
  const parts = rel.split(sep).map((p) => p.normalize("NFC")).filter(Boolean);
  const [top, sub, subsub] = parts;
  const section = SECTION_BY_TOP[top];
  if (!section) return "misc";
  if (section === "backstage") return "backstage";
  if (!sub) return `${section}-other`;
  if (sub === "Масленица" && subsub) return `nikola-lenivets-maslenitsa-${subsub}`;
  return PROJECT_BY_SUBFOLDER[sub] ?? `${section}-other`;
}

/** Бэкстейдж — плоская лента: все файлы прямо из папки "Бэкстейдж",
 *  без под-проектов (подпапок в новой раскладке диска больше нет). */
async function collectBackstageFiles(root) {
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((ent) => ent.isFile() && ALLOWED_EXT.has(extname(ent.name).toLowerCase()))
    .map((ent) => ent.name)
    .sort((a, b) => a.localeCompare(b, "ru"))
    .map((name) => join(root, name));
}

async function collectReportageFiles() {
  const all = [];
  for (const top of TOP_ORDER) {
    const root = join(REPORTAGE_BUNDLE, top);
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

async function processReportage() {
  const category = "reportage";
  const outDir = join(OUTPUT_BASE, category);

  const files = await collectReportageFiles();
  if (files.length === 0) {
    console.error("Нет изображений в", REPORTAGE_BUNDLE);
    console.error("Ожидаются папки:", TOP_ORDER.join(", "));
    process.exit(1);
  }

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
    const entry = {
      id: `r${idx}`,
      src: `/photos/${category}/${outName}`,
      alt: altFromPath(inPath),
      project: projectFromPath(inPath),
      category,
      width,
      height,
    };
    entries.push(entry);
    console.log(`  ✓ ${relative(ROOT, inPath)} → ${outName} (${width}×${height}, ${sizeKb}KB)`);
  }

  await writeGeneratedFile("reportage", "reportageImages", entries);
}

// ============================================================
// Портрет / Предметка — flat-бандл (подпапка = проект напрямую)
// ============================================================

/** category → { bundleDir (папка в _incoming/), altPrefix, projectOrder }
 *  projectOrder — [имя подпапки на диске, project id] в порядке отображения
 *  в галерее (совпадает с projects[] в portfolio.ts). "Разное"/"Разные"
 *  (смешанные кадры) — специально в конце, как общий "прочее"-раздел. */
const FLAT_CATEGORIES = {
  portrait: {
    bundleDir: "Люди",
    altPrefix: "Портрет",
    idPrefix: "pt",
    projectOrder: [
      ["Анита", "portrait-anita"],
      ["Аня", "portrait-anya"],
      ["Илья", "portrait-ilya"],
      ["Лиза", "portrait-liza"],
      ["Лэйла", "portrait-leyla"],
      ["Настя инверсия", "portrait-nastya-inversion"],
      ["Шура и Саша", "portrait-shura-sasha"],
      ["Разные", "portrait-various"],
    ],
  },
  product: {
    bundleDir: "Предметка",
    altPrefix: "Предметная",
    idPrefix: "pd",
    projectOrder: [
      ["Carely", "product-carely"],
      ["Nav.jwlry", "product-navjwlry"],
      ["Otomoshi", "product-otomoshi"],
      ["Мебель Partisan", "product-partisan"],
      ["На белом фоне", "product-white-bg"],
      ["Сумки Anya", "product-anya-bags"],
      ["Разное", "product-misc"],
    ],
  },
};

async function processFlatCategory(category) {
  const config = FLAT_CATEGORIES[category];
  const bundleRoot = join(INCOMING, config.bundleDir);
  const outDir = join(OUTPUT_BASE, category);

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const entries = [];
  let i = 0;

  for (const [subfolder, projectId] of config.projectOrder) {
    const dir = join(bundleRoot, subfolder);
    let dirEntries;
    try {
      dirEntries = await readdir(dir, { withFileTypes: true });
    } catch {
      console.log(`  ⏭  "${subfolder}" не найдена в _incoming/${config.bundleDir}/, пропускаю`);
      continue;
    }

    const files = dirEntries
      .filter((ent) => ent.isFile() && ALLOWED_EXT.has(extname(ent.name).toLowerCase()))
      .map((ent) => ent.name)
      .sort((a, b) => a.localeCompare(b, "ru"));

    for (const file of files) {
      i++;
      const idx = String(i).padStart(3, "0");
      const outName = `${idx}.webp`;
      const inPath = join(dir, file);
      const outPath = join(outDir, outName);

      const { width, height, sizeKb } = await optimizeFile(inPath, outPath);
      const entry = {
        id: `${config.idPrefix}${idx}`,
        src: `/photos/${category}/${outName}`,
        alt: `${config.altPrefix} — ${subfolder}`,
        project: projectId,
        category,
        width,
        height,
      };
      entries.push(entry);
      console.log(`  ✓ ${relative(ROOT, inPath)} → ${outName} (${width}×${height}, ${sizeKb}KB)`);
    }
  }

  if (entries.length === 0) {
    console.error(`Нет изображений в _incoming/${config.bundleDir}/`);
    process.exit(1);
  }

  console.log(`\n📸 ${category}: ${entries.length} файлов из бандла\n`);
  await writeGeneratedFile(category, `${category}Images`, entries);
}

// ============================================================
// Общее
// ============================================================

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

async function writeGeneratedFile(category, exportName, entries) {
  const tsLines = [
    "/**",
    " * Автогенерация: node scripts/optimize-incoming-bundle.mjs " + category,
    " * Не править вручную — перезапусти скрипт после смены исходников.",
    " */",
    "",
    'import type { PortfolioImage } from "./portfolioTypes";',
    "",
    `export const ${exportName}: PortfolioImage[] = [`,
  ];

  for (const e of entries) {
    tsLines.push(
      `  { id: "${e.id}", src: "${e.src}", alt: "${escapeTsString(e.alt)}", category: "${category}", project: "${e.project}", width: ${e.width}, height: ${e.height} },`
    );
  }

  tsLines.push("];", "");

  const outTs = join(DATA_DIR, `${category}.generated.ts`);
  await writeFile(outTs, tsLines.join("\n"), "utf8");

  console.log(`\n✅ Записано: ${relative(ROOT, outTs)}`);
  console.log(`✅ WebP: ${relative(ROOT, join(OUTPUT_BASE, category))}/ (${entries.length} файлов)\n`);
}

async function main() {
  const category = process.argv[2] ?? "reportage";

  if (category === "reportage") {
    await processReportage();
  } else if (category in FLAT_CATEGORIES) {
    await processFlatCategory(category);
  } else {
    console.error(`Неизвестная категория: ${category}`);
    console.error("Доступные: reportage, portrait, product");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
