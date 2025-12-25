"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { PortfolioImage } from "@/data/portfolio";

interface GalleryProps {
  images: PortfolioImage[];
  // Колбэк когда галерея активна (пользователь взаимодействует)
  onActiveChange?: (isActive: boolean) => void;
}

export function Gallery({ images, onActiveChange }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageKey, setImageKey] = useState(0); // Для анимации смены
  
  // Ref для отслеживания смонтированности
  const isMounted = useRef(true);

  const currentImage = images[currentIndex];
  const total = images.length;

  // Сбрасываем состояние загрузки при смене картинки
  useEffect(() => {
    setIsImageLoaded(false);
    setImageKey((prev) => prev + 1);
  }, [currentIndex]);

  // При смене категории сбрасываем индекс
  useEffect(() => {
    setCurrentIndex(0);
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, [images]);

  // Навигация: следующее фото
  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
    setIsInteracting(true);
  }, [total]);

  // Навигация: предыдущее фото
  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setIsInteracting(true);
  }, [total]);

  // Слушаем клавиши стрелок
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  // Уведомляем родителя об активности
  useEffect(() => {
    onActiveChange?.(isInteracting);
    
    // Сбрасываем состояние через некоторое время
    if (isInteracting) {
      const timer = setTimeout(() => {
        if (isMounted.current) {
          setIsInteracting(false);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isInteracting, onActiveChange]);

  // === Предзагрузка соседних изображений ===
  useEffect(() => {
    const preloadImages = () => {
      // Загружаем следующие 2 и предыдущее 1 изображение
      const indicesToPreload = [
        (currentIndex + 1) % total,
        (currentIndex + 2) % total,
        (currentIndex - 1 + total) % total,
      ];

      indicesToPreload.forEach((index) => {
        const img = images[index];
        if (img) {
          const preloader = new window.Image();
          preloader.src = img.src;
        }
      });
    };

    if (total > 1) {
      preloadImages();
    }
  }, [currentIndex, images, total]);

  if (!currentImage || total === 0) {
    return null;
  }

  // Callback когда изображение загрузилось
  const handleImageLoad = () => {
    if (isMounted.current) {
      setIsImageLoaded(true);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center gallery-container">
      {/* Основное изображение */}
      <div 
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        onClick={goNext}
      >
        {/* Placeholder — мягкий серый фон пока грузится */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isImageLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{ backgroundColor: "var(--border)" }}
        />
        
        {/* Используем обычный img — обходит ограничения next/image */}
        <img
          key={imageKey}
          src={currentImage.src}
          alt={currentImage.alt}
          className={`max-w-full max-h-full w-auto h-auto object-contain gallery-image-enter ${
            isImageLoaded ? "gallery-image-loaded" : "gallery-image-loading"
          }`}
          onLoad={handleImageLoad}
          loading={currentIndex < 2 ? "eager" : "lazy"}
        />
      </div>

      {/* Счётчик */}
      <div 
        className="absolute bottom-4 left-4 text-sm font-light tracking-wide"
        style={{ color: "var(--text-muted)" }}
      >
        {currentIndex + 1}/{total}
      </div>

      {/* Невидимые зоны клика слева/справа */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        className="absolute left-0 top-0 bottom-0 w-1/3 cursor-w-resize opacity-0"
        aria-label="Предыдущее фото"
      />
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        className="absolute right-0 top-0 bottom-0 w-2/3 cursor-e-resize opacity-0"
        aria-label="Следующее фото"
      />
    </div>
  );
}
