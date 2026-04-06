"use client";

import { useState, useCallback } from "react";
import { Gallery } from "@/components/Gallery";
import { VideoGallery } from "@/components/VideoGallery";
import { categories, getImagesByCategory, videos, bioSchool, bioBrands, contacts, type Category } from "@/data/portfolio";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [isGalleryActive, setIsGalleryActive] = useState(false);

  const toggleCategory = useCallback((category: Category) => {
    setActiveCategory((prev) => (prev === category ? null : category));
    setIsGalleryActive(false);
  }, []);

  const activeImages = activeCategory ? getImagesByCategory(activeCategory) : [];

  const getMenuItemOpacity = (categoryId: Category): number => {
    if (isGalleryActive) {
      return activeCategory === categoryId ? 0.25 : 0.08;
    }
    if (activeCategory) {
      return activeCategory === categoryId ? 1 : 0.15;
    }
    return 0.15;
  };

  const headerOpacity = isGalleryActive ? 0.08 : activeCategory ? 0.15 : 1;

  const showPhotoGallery = activeCategory && activeCategory !== "bio" && activeCategory !== "video" && activeImages.length > 0;
  const showVideoGallery = activeCategory === "video";

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">
      {/* ===== DESKTOP: галерея фиксирована справа ===== */}
      {showPhotoGallery && (
        <div
          className="hidden md:flex fixed inset-0 z-0 items-center justify-end"
          style={{
            paddingLeft: "42%",
            paddingRight: "32px",
            paddingTop: "32px",
            paddingBottom: "32px",
          }}
        >
          <Gallery
            key={`desktop-${activeCategory}`}
            images={activeImages}
            onActiveChange={setIsGalleryActive}
          />
        </div>
      )}

      {showVideoGallery && (
        <div
          className="hidden md:flex fixed inset-0 z-0 items-center justify-end"
          style={{
            paddingLeft: "42%",
            paddingRight: "32px",
            paddingTop: "32px",
            paddingBottom: "32px",
          }}
        >
          <VideoGallery videos={videos} />
        </div>
      )}

      {/* ===== ОСНОВНОЙ КОНТЕНТ =====
          Desktop: pointer-events-none чтобы не блокировать клики по галерее справа.
          Mobile: нормальный поток, pointer-events включены. */}
      <main className="relative z-10 min-h-screen px-5 py-10 md:px-16 lg:px-20 md:py-16 md:pointer-events-none">
        <header
          className="mb-8 md:mb-12 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: headerOpacity }}
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight">
            Сергей Захаров
          </h1>
        </header>

        <nav className="space-y-0">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            const opacity = getMenuItemOpacity(category.id);

            return (
              <div key={category.id}>
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="block w-full text-left py-0 transition-opacity duration-300 cursor-pointer pointer-events-auto"
                  style={{ opacity }}
                >
                  <span className="text-2xl md:text-4xl lg:text-5xl font-normal leading-none">
                    {category.title}
                  </span>
                </button>

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

        {/* ===== MOBILE: галерея inline под меню ===== */}
        {showPhotoGallery && (
          <div className="md:hidden mt-6 w-full" style={{ height: "60vh" }}>
            <Gallery
              key={`mobile-${activeCategory}`}
              images={activeImages}
              onActiveChange={setIsGalleryActive}
            />
          </div>
        )}

        {showVideoGallery && (
          <div className="md:hidden mt-6 w-full" style={{ height: "60vh" }}>
            <VideoGallery videos={videos} />
          </div>
        )}
      </main>

      {/* Футер — фиксированный слева внизу */}
      <footer
        className="fixed bottom-6 left-5 md:bottom-8 md:left-16 lg:left-20 flex gap-6 text-sm transition-opacity duration-300"
        style={{
          opacity: isGalleryActive ? 0.15 : activeCategory ? 0.4 : 0.5,
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
