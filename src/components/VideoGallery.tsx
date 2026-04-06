"use client";

import { useState, useEffect, useCallback } from "react";
import type { PortfolioVideo } from "@/data/portfolio";

interface VideoGalleryProps {
  videos: PortfolioVideo[];
}

export function VideoGallery({ videos }: VideoGalleryProps) {
  const [activeVideo, setActiveVideo] = useState<PortfolioVideo | null>(null);

  // Закрываем по Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setActiveVideo(null);
  }, []);

  useEffect(() => {
    if (activeVideo) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [activeVideo, handleKeyDown]);

  return (
    <>
      {/* Сетка превью — скроллируется внутри правой панели */}
      <div className="w-full h-full overflow-y-auto">
        <div className="grid grid-cols-2 gap-2 p-1">
          {videos.map((video) => (
            <button
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="relative group overflow-hidden rounded-sm bg-neutral-100"
              style={{ aspectRatio: video.isShort ? "9/16" : "16/9" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                alt={video.title || "Видео"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (!img.src.includes("hqdefault")) {
                    img.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                  }
                }}
              />
              {/* Иконка воспроизведения при наведении */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-10 h-10 rounded-full bg-white/85 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-neutral-900 translate-x-0.5"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Лайтбокс — фиксированный поверх всего */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
          onClick={() => setActiveVideo(null)}
        >
          {/* Контейнер плеера с нужным соотношением сторон */}
          <div
            className={
              activeVideo.isShort
                ? "relative h-[85vh] aspect-[9/16]"
                : "relative w-[85vw] max-h-[85vh] aspect-[16/9]"
            }
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              title={activeVideo.title || "Видео"}
            />
          </div>

          {/* Кнопка закрытия */}
          <button
            onClick={() => setActiveVideo(null)}
            className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors text-4xl leading-none"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
