"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import type { PortfolioImage } from "@/data/portfolio";
import { assetPath } from "@/lib/assetPath";
import { useSwipe } from "@/lib/useSwipe";

interface LightboxProps {
  images: PortfolioImage[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export function Lightbox({ images, currentIndex, onIndexChange, onClose }: LightboxProps) {
  const total = images.length;
  const [loaded, setLoaded] = useState(false);
  // Портал монтируем только на клиенте — до этого document.body недоступен
  const [mounted, setMounted] = useState(false);

  const goNext = useCallback(() => {
    setLoaded(false);
    onIndexChange((currentIndex + 1) % total);
  }, [currentIndex, total, onIndexChange]);

  const goPrev = useCallback(() => {
    setLoaded(false);
    onIndexChange((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onIndexChange]);

  const swipeRef = useSwipe<HTMLDivElement>({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Блокируем скролл body и ловим клавиши
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, goNext, goPrev]);

  // Предзагрузка соседних кадров
  useEffect(() => {
    const neighbors = [
      (currentIndex + 1) % total,
      (currentIndex - 1 + total) % total,
    ];
    neighbors.forEach((i) => {
      const img = new window.Image();
      img.src = assetPath(images[i].src);
    });
  }, [currentIndex, images, total]);

  const current = images[currentIndex];

  // Не рендерим на сервере/до маунта — document.body ещё недоступен
  if (!mounted) return null;

  return createPortal(
    <div
      ref={swipeRef}
      className="fixed inset-0 z-50 flex items-center justify-center lightbox-enter"
      style={{ background: "rgba(0, 0, 0, 0.92)" }}
      onClick={onClose}
    >
      {/* Кнопка закрытия */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-opacity text-2xl leading-none p-2"
        aria-label="Закрыть"
      >
        ✕
      </button>

      {/* Фото — небольшой сдвиг влево от центра */}
      <img
        src={assetPath(current.src)}
        alt={current.alt}
        className="max-w-[92vw] max-h-[88vh] w-auto h-auto object-contain select-none"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 200ms ease",
          transform: "translateX(-3vw)",
        }}
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        onLoad={() => setLoaded(true)}
      />

      {/* Навигация — стрелки по бокам (скрыты на тач-устройствах) */}
      <button
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-opacity text-3xl p-2 hidden md:block"
        aria-label="Предыдущее фото"
      >
        ‹
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-opacity text-3xl p-2 hidden md:block"
        aria-label="Следующее фото"
      >
        ›
      </button>

      {/* Счётчик внизу */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest font-mono tabular-nums"
        onClick={(e) => e.stopPropagation()}
      >
        {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>,
    document.body
  );
}
