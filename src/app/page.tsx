"use client";

import { useState, useCallback } from "react";
import { Gallery } from "@/components/Gallery";
import { VideoGallery } from "@/components/VideoGallery";
import { categories, getImagesByCategory, videos, bioSchool, bioBrands, contacts, type Category } from "@/data/portfolio";

export default function Home() {
  // Какая категория сейчас выбрана (null = ничего)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  // Галерея активна (пользователь листает фото)
  const [isGalleryActive, setIsGalleryActive] = useState(false);

  // Переключение категории
  const toggleCategory = useCallback((category: Category) => {
    setActiveCategory((prev) => (prev === category ? null : category));
    // Сбрасываем состояние галереи при смене категории
    setIsGalleryActive(false);
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
      {/* Галерея фото — позади меню, занимает правую часть экрана */}
      {activeCategory && activeCategory !== "bio" && activeCategory !== "video" && activeImages.length > 0 && (
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
            key={activeCategory}
            images={activeImages} 
            onActiveChange={setIsGalleryActive}
          />
        </div>
      )}

      {/* Видеогалерея — аналогичная позиция, но показывает YouTube-превью */}
      {activeCategory === "video" && (
        <div 
          className="fixed inset-0 z-0 flex items-center justify-end"
          style={{ 
            paddingLeft: "42%",
            paddingRight: "32px",
            paddingTop: "32px",
            paddingBottom: "32px"
          }}
        >
          <VideoGallery videos={videos} />
        </div>
      )}

      {/* Основной контент — меню поверх галереи.
          pointer-events-none на main: элемент занимает всю ширину экрана и без этого
          блокировал бы клики на правую часть (галерея). Интерактивность возвращена
          дочерним элементам через pointer-events-auto. */}
      <main className="relative z-10 min-h-screen px-8 py-16 md:px-16 lg:px-20 pointer-events-none">
        {/* Заголовок — крупный, жирнее чем меню */}
        <header 
          className="mb-12 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: headerOpacity }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight">
            Сергей Захаров
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
                  className="block w-full text-left py-0 transition-opacity duration-300 cursor-pointer pointer-events-auto"
                  style={{ opacity }}
                >
                  <span className="text-3xl md:text-4xl lg:text-5xl font-normal leading-none">
                    {category.title}
                  </span>
                </button>

                {/* Раскрытый контент для Bio */}
                {isActive && category.id === "bio" && (
                  <div
                    className="py-6 transition-opacity duration-300 pointer-events-auto"
                    style={{ opacity: isGalleryActive ? 0.2 : 1 }}
                  >
                    <div className="text-base md:text-lg leading-relaxed max-w-xl text-neutral-600 space-y-3">
                      <p>Сергей — фотограф из Москвы.</p>
                      <p>
                        Обучение:{" "}
                        <a
                          href={bioSchool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 hover:text-neutral-900 transition-colors"
                        >
                          {bioSchool.name}
                        </a>
                        .
                      </p>
                      <p>
                        Работал с:{" "}
                        {bioBrands.map((brand, i) => (
                          <span key={brand.name}>
                            {brand.url ? (
                              <a
                                href={brand.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-2 hover:text-neutral-900 transition-colors"
                              >
                                {brand.name}
                              </a>
                            ) : (
                              brand.name
                            )}
                            {i < bioBrands.length - 1 ? ", " : "."}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </main>

      {/* Футер — фиксированный слева внизу (не на фотке) */}
      <footer 
        className="fixed bottom-8 left-8 md:left-16 lg:left-20 flex gap-6 text-sm transition-opacity duration-300"
        style={{ 
          opacity: isGalleryActive ? 0.15 : activeCategory ? 0.4 : 0.5
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
        <a
          href={`mailto:${contacts.email}`}
          className="hover:opacity-100 transition-opacity text-neutral-500"
        >
          MAIL
        </a>
      </footer>
    </div>
  );
}
