"use client";

import { useState, useEffect, useCallback } from "react";
import type { PortfolioImage } from "@/data/portfolio";
import { GalleryFilmstrip } from "./GalleryFilmstrip";
import { GalleryGrid } from "./GalleryGrid";
import { Lightbox } from "./Lightbox";

type GalleryMode = "filmstrip" | "grid";

interface GalleryProps {
  images: PortfolioImage[];
  onActiveChange?: (isActive: boolean) => void;
}

export function Gallery({ images, onActiveChange }: GalleryProps) {
  const [mode, setMode] = useState<GalleryMode>("filmstrip");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    setMode(isMobile ? "grid" : "filmstrip");
  }, [images, isMobile]);

  const handleSelectFromGrid = useCallback((index: number) => {
    if (isMobile) {
      setLightboxIndex(index);
    } else {
      setCurrentIndex(index);
      setMode("filmstrip");
    }
  }, [isMobile]);

  const handleOpenLightbox = useCallback(() => {
    setLightboxIndex(currentIndex);
  }, [currentIndex]);

  const closeLightbox = useCallback(() => {
    if (lightboxIndex !== null) {
      setCurrentIndex(lightboxIndex);
    }
    setLightboxIndex(null);
  }, [lightboxIndex]);

  if (images.length === 0) return null;

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
          onOpenLightbox={handleOpenLightbox}
        />
      </div>
      <div className={mode === "grid" ? "w-full h-full" : "hidden"}>
        <GalleryGrid
          images={images}
          onSelectImage={handleSelectFromGrid}
          onClose={() => setMode("filmstrip")}
        />
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}
