"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { PortfolioImage } from "@/data/portfolio";
import { assetPath } from "@/lib/assetPath";

interface GalleryFilmstripProps {
  images: PortfolioImage[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onShowGrid: () => void;
  onActiveChange?: (isActive: boolean) => void;
}

export function GalleryFilmstrip({
  images,
  currentIndex,
  onIndexChange,
  onShowGrid,
  onActiveChange,
}: GalleryFilmstripProps) {
  const total = images.length;
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set());
  const interactTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const notifyActive = useCallback(() => {
    onActiveChange?.(true);
    if (interactTimer.current) clearTimeout(interactTimer.current);
    interactTimer.current = setTimeout(() => {
      if (isMounted.current) onActiveChange?.(false);
    }, 2000);
  }, [onActiveChange]);

  const goNext = useCallback(() => {
    onIndexChange((currentIndex + 1) % total);
    notifyActive();
  }, [currentIndex, total, onIndexChange, notifyActive]);

  const goPrev = useCallback(() => {
    onIndexChange((currentIndex - 1 + total) % total);
    notifyActive();
  }, [currentIndex, total, onIndexChange, notifyActive]);

  // Клавиши ← →
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // Предзагрузка соседних кадров
  useEffect(() => {
    const toLoad = [
      currentIndex,
      (currentIndex + 1) % total,
      (currentIndex + 2) % total,
      (currentIndex - 1 + total) % total,
    ];
    toLoad.forEach((i) => {
      const img = images[i];
      if (img && !loadedIndices.has(i)) {
        const el = new window.Image();
        el.src = assetPath(img.src);
        el.onload = () => {
          if (isMounted.current) {
            setLoadedIndices((prev) => new Set(prev).add(i));
          }
        };
      }
    });
  }, [currentIndex, images, total, loadedIndices]);

  if (total === 0) return null;

  // Индексы трёх видимых слайдов
  const prevIdx = (currentIndex - 1 + total) % total;
  const nextIdx = (currentIndex + 1) % total;

  // Ширина текущего слайда — 70% контейнера.
  // Оставшиеся 15% с каждой стороны — peek-зона для соседних фото.
  // Соседние фото позиционируются абсолютно, выходя за эти 15% —
  // маска (filmstrip-mask) плавно растворяет их к краям.
  const SLIDE_W = 70;   // % от ширины контейнера
  const CENTER_L = (100 - SLIDE_W) / 2; // 15% — отступ слева для центрирования
  const GAP = 20;       // px — зазор между слайдами

  const slidePositions = {
    prev: { left: `calc(${CENTER_L}% - ${SLIDE_W}% - ${GAP}px)` },
    current: { left: `${CENTER_L}%` },
    next: { left: `calc(${CENTER_L + SLIDE_W}% + ${GAP}px)` },
  };

  const slideData = [
    { idx: prevIdx,      position: "prev"    as const },
    { idx: currentIndex, position: "current" as const },
    { idx: nextIdx,      position: "next"    as const },
  ];

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Область filmstrip */}
      <div
        className="relative flex-1 overflow-hidden filmstrip-mask"
        style={{ minHeight: 0 }}
      >
        {slideData.map(({ idx, position }) => {
          const img = images[idx];
          const isCurrent = position === "current";
          const isLoaded = loadedIndices.has(idx);

          return (
            <div
              key={position}
              className="absolute top-0 bottom-0 flex items-center justify-center"
              style={{
                width: `${SLIDE_W}%`,
                left: slidePositions[position].left,
                opacity: isCurrent ? 1 : 0.35,
                transition: "opacity 350ms ease",
                padding: "0 8px",
              }}
            >
              {/* Placeholder пока грузится */}
              {!isLoaded && (
                <div
                  className="absolute inset-2"
                  style={{ background: "var(--border)" }}
                />
              )}
              <img
                src={assetPath(img.src)}
                alt={img.alt}
                className="max-w-full max-h-full w-auto h-auto object-contain select-none"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transition: "opacity 300ms ease",
                  userSelect: "none",
                } as React.CSSProperties}
                draggable={false}
              />
            </div>
          );
        })}

        {/* Зоны клика: левая половина → назад, правая → вперёд */}
        <button
          onClick={goPrev}
          className="absolute left-0 top-0 bottom-0 w-1/2 cursor-w-resize z-10"
          aria-label="Предыдущее фото"
        />
        <button
          onClick={goNext}
          className="absolute right-0 top-0 bottom-0 w-1/2 cursor-e-resize z-10"
          aria-label="Следующее фото"
        />
      </div>

      {/* Счётчик и кнопка «все фото» */}
      <div
        className="flex items-center justify-between px-2 pt-3 pb-1 text-xs tracking-widest uppercase flex-shrink-0"
        style={{ color: "var(--text-muted)" }}
      >
        <button
          onClick={goPrev}
          className="opacity-40 hover:opacity-80 transition-opacity"
          aria-label="Предыдущее"
        >
          ←
        </button>

        <div className="flex items-center gap-4">
          <span className="font-mono tabular-nums">
            {String(currentIndex + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
          <button
            onClick={onShowGrid}
            className="opacity-50 hover:opacity-100 transition-opacity tracking-widest"
          >
            ВСЕ
          </button>
        </div>

        <button
          onClick={goNext}
          className="opacity-40 hover:opacity-80 transition-opacity"
          aria-label="Следующее"
        >
          →
        </button>
      </div>
    </div>
  );
}
