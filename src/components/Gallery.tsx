"use client";

import { useState, useEffect } from "react";
import type { PortfolioImage } from "@/data/portfolio";
import { GalleryFilmstrip } from "./GalleryFilmstrip";
import { GalleryGrid } from "./GalleryGrid";

type GalleryMode = "filmstrip" | "grid";

interface GalleryProps {
  images: PortfolioImage[];
  onActiveChange?: (isActive: boolean) => void;
}

export function Gallery({ images, onActiveChange }: GalleryProps) {
  const [mode, setMode] = useState<GalleryMode>("filmstrip");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
    setMode("filmstrip");
  }, [images]);

  const handleSelectFromGrid = (index: number) => {
    setCurrentIndex(index);
    setMode("filmstrip");
  };

  if (images.length === 0) return null;

  // Оба компонента всегда в DOM — сетка сохраняет скролл-позицию.
  // Переключаем видимость через CSS.
  return (
    <div className="relative w-full h-full gallery-container">
      <div className={mode === "filmstrip" ? "w-full h-full" : "hidden"}>
        <GalleryFilmstrip
          images={images}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
          onShowGrid={() => setMode("grid")}
          onActiveChange={onActiveChange}
          isActive={mode === "filmstrip"}
        />
      </div>
      <div className={mode === "grid" ? "w-full h-full" : "hidden"}>
        <GalleryGrid
          images={images}
          onSelectImage={handleSelectFromGrid}
          onClose={() => setMode("filmstrip")}
        />
      </div>
    </div>
  );
}
