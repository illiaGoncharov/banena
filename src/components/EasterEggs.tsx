"use client";

import { useEffect, useState, useCallback } from "react";

// Малозаметные пасхалки в тему названия проекта (banana).
// 1) ASCII-банан + сообщение в консоли — увидят только любопытные, кто открыл DevTools.
// 2) Konami-код (↑↑↓↓←→←→ B A) запускает короткий «дождь» из бананов.

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

// Псевдослучайные параметры для банана в «дожде»
function makeBananas(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100, // vw
    delay: Math.random() * 0.6, // s
    duration: 2.4 + Math.random() * 1.6, // s
    size: 20 + Math.random() * 28, // px
  }));
}

export function EasterEggs() {
  const [raining, setRaining] = useState(false);
  const bananas = raining ? makeBananas(24) : [];

  // Пасхалка №1 — консоль
  useEffect(() => {
    const art = [
      "",
      "        __",
      "   ___ / /",
      "  (   / /   banena",
      "   \\_/_/",
      "",
    ].join("\n");
    console.log(
      `%c${art}`,
      "color:#e8b400;font-family:monospace;font-size:12px;line-height:1.2;"
    );
    console.log(
      "%cI am a banana. 🍌  Подсказка: ↑↑↓↓←→←→ B A",
      "color:#999;font-size:11px;"
    );
  }, []);

  // Пасхалка №2 — Konami-код
  const triggerRain = useCallback(() => {
    setRaining(true);
    window.setTimeout(() => setRaining(false), 4200);
  }, []);

  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === KONAMI[pos] ? pos + 1 : key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        triggerRain();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [triggerRain]);

  if (!raining) return null;

  return (
    <div className="banana-rain" aria-hidden>
      {bananas.map((b) => (
        <span
          key={b.id}
          className="banana-drop"
          style={{
            left: `${b.left}vw`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            fontSize: `${b.size}px`,
          }}
        >
          🍌
        </span>
      ))}
    </div>
  );
}
