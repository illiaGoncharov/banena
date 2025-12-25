"use client";

import { useState, useCallback } from "react";
import { Gallery } from "@/components/Gallery";
import { categories, getImagesByCategory, bioText, contacts, type Category } from "@/data/portfolio";

export default function Home() {
  // Какая категория сейчас выбрана (null = ничего)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  // Галерея активна (пользователь листает фото)
  const [isGalleryActive, setIsGalleryActive] = useState(false);

  // Переключение категории
  const toggleCategory = useCallback((category: Category) => {
    setActiveCategory((prev) => (prev === category ? null : category));
  }, []);

  // Получаем изображения для активной категории
  const activeImages = activeCategory ? getImagesByCategory(activeCategory) : [];

  // Прозрачность пунктов меню (как на референсе):
  // - Изначально все пункты очень бледные (0.15), только заголовок яркий
  // - При выборе категории — активный пункт ярко-чёрный
  // - При листании галереи — всё уходит в туман
  const getMenuItemOpacity = (categoryId: Category): number => {
    if (isGalleryActive) {
      // Когда листаем галерею — всё очень бледное
      return activeCategory === categoryId ? 0.25 : 0.08;
    }
    if (activeCategory) {
      // Активная категория — яркая, остальные почти невидимы
      return activeCategory === categoryId ? 1 : 0.15;
    }
    // Изначально — меню бледное, как на референсе
    return 0.15;
  };

  // Прозрачность заголовка — изначально яркий, при выборе категории сильно бледнеет
  const headerOpacity = isGalleryActive ? 0.08 : activeCategory ? 0.15 : 1;

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">
      {/* Галерея — позади меню, занимает правую часть экрана */}
      {activeCategory && activeCategory !== "bio" && activeImages.length > 0 && (
        <div 
          className="fixed inset-0 z-0 flex items-center justify-end"
          style={{ 
            paddingLeft: "42%",
            paddingRight: "32px",
            paddingTop: "32px",
            paddingBottom: "32px"
          }}
        >
          <Gallery 
            key={activeCategory} // Перемонтируем при смене категории для анимации
            images={activeImages} 
            onActiveChange={setIsGalleryActive}
          />
        </div>
      )}

      {/* Основной контент — меню поверх галереи */}
      <main className="relative z-10 min-h-screen px-8 py-16 md:px-16 lg:px-20">
        {/* Заголовок — крупный, жирнее чем меню */}
        <header 
          className="mb-12 transition-opacity duration-300"
          style={{ opacity: headerOpacity }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-tight">
            BANENA, Фотограф,
            <br />
            Москва
          </h1>
        </header>

        {/* Навигация — тонкий шрифт (light) */}
        <nav className="space-y-0">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            const opacity = getMenuItemOpacity(category.id);

            return (
              <div key={category.id}>
                {/* Пункт меню — font-light */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="block w-full text-left py-1 transition-opacity duration-300 cursor-pointer"
                  style={{ opacity }}
                >
                  <span className="text-5xl md:text-6xl lg:text-7xl font-light">
                    {category.title}
                  </span>
                </button>

                {/* Раскрытый контент для Bio */}
                {isActive && category.id === "bio" && (
                  <div 
                    className="py-6 transition-opacity duration-300"
                    style={{ opacity: isGalleryActive ? 0.2 : 1 }}
                  >
                    <p className="text-lg md:text-xl leading-relaxed whitespace-pre-line max-w-2xl text-neutral-700">
                      {bioText}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </main>

      {/* Футер — фиксированный справа внизу */}
      <footer 
        className="fixed bottom-8 right-8 flex gap-8 text-sm transition-opacity duration-300"
        style={{ 
          opacity: isGalleryActive ? 0.1 : activeCategory ? 0.3 : 0.5
        }}
      >
        <a 
          href={contacts.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-100 transition-opacity text-neutral-500"
        >
          TG
        </a>
        <a 
          href={contacts.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-100 transition-opacity text-neutral-500"
        >
          INST
        </a>
      </footer>
    </div>
  );
}
