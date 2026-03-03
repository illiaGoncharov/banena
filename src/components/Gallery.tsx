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

  // При смене набора изображений сбрасываем в начало и в filmstrip
  useEffect(() => {
    setCurrentIndex(0);
    setMode("filmstrip");
  }, [images]);

  const handleSelectFromGrid = (index: number) => {
    setCurrentIndex(index);
    setMode("filmstrip");
  };

  if (images.length === 0) return null;

  return (
    <div className="relative w-full h-full gallery-container">
      {mode === "filmstrip" ? (
        <GalleryFilmstrip
          images={images}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
          onShowGrid={() => setMode("grid")}
          onActiveChange={onActiveChange}
        />
      ) : (
        <GalleryGrid
          images={images}
          onSelectImage={handleSelectFromGrid}
          onClose={() => setMode("filmstrip")}
        />
      )}
    </div>
  );
}
