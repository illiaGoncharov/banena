"use client";

import type { PortfolioImage } from "@/data/portfolio";
import { assetPath } from "@/lib/assetPath";

interface GalleryGridProps {
  images: PortfolioImage[];
  onSelectImage: (index: number) => void;
  onClose: () => void;
}

export function GalleryGrid({ images, onSelectImage, onClose }: GalleryGridProps) {
  return (
    <div className="w-full h-full flex flex-col gallery-grid-enter">
      {/* Хедер: кнопка «закрыть сетку» */}
      <div
        className="flex items-center justify-between px-2 pb-3 flex-shrink-0 text-xs tracking-widest uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        <span className="tabular-nums font-mono">
          {String(images.length).padStart(2, "0")} фото
        </span>
        <button
          onClick={onClose}
          className="opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Закрыть сетку"
        >
          ← НАЗАД
        </button>
      </div>

      {/* Сетка миниатюр — скроллится если много фото */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ minHeight: 0 }}
      >
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => onSelectImage(i)}
              className="relative aspect-square overflow-hidden group"
              aria-label={img.alt}
              style={{ background: "var(--border)" }}
            >
              <img
                src={assetPath(img.src)}
                alt={img.alt}
                className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-70"
                loading={i < 15 ? "eager" : "lazy"}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
