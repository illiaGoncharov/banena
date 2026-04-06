"use client";

import { useRef, useEffect, type RefObject } from "react";

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

/**
 * Хук для горизонтальных свайпов на touch-устройствах.
 * Возвращает ref — его нужно повесить на элемент-контейнер.
 */
export function useSwipe<T extends HTMLElement = HTMLDivElement>(
  options: UseSwipeOptions
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const startX = useRef(0);
  const startY = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const threshold = options.threshold ?? 50;

    const onTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX.current;
      const dy = e.changedTouches[0].clientY - startY.current;

      // Горизонтальный свайп должен быть длиннее вертикального
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;

      if (dx < 0) options.onSwipeLeft?.();
      else options.onSwipeRight?.();
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [options]);

  return ref;
}
