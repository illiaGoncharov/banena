"use client";

import { useState, useCallback } from "react";
import { Gallery } from "@/components/Gallery";
import { VideoGallery } from "@/components/VideoGallery";
import {
  categories,
  getImagesByCategory,
  getSectionsByCategory,
  getProjectsBySection,
  getImagesByProject,
  getImagesBySection,
  videos,
  bioSchool,
  bioBrands,
  contacts,
  type Category,
} from "@/data/portfolio";

// Спец-значение activeProject: показать все фото жанра без разбивки
const ALL_PROJECTS = "__all__";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  // Раскрытая секция (2-й уровень) и выбранный проект (3-й уровень)
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [isGalleryActive, setIsGalleryActive] = useState(false);

  // Смена жанра — сбрасываем секцию, проект и состояние галереи
  const toggleCategory = useCallback((category: Category) => {
    setActiveCategory((prev) => (prev === category ? null : category));
    setActiveSection(null);
    setActiveProject(null);
    setIsGalleryActive(false);
  }, []);

  // Смена секции — сбрасываем выбранный проект
  const toggleSection = useCallback((sectionId: string) => {
    setActiveSection((prev) => (prev === sectionId ? null : sectionId));
    setActiveProject(null);
    setIsGalleryActive(false);
  }, []);

  const selectProject = useCallback((projectId: string) => {
    setActiveProject(projectId);
    setIsGalleryActive(false);
  }, []);

  // Секции текущего жанра (пусто → жанр без группировки)
  const sectionsForCategory = activeCategory ? getSectionsByCategory(activeCategory) : [];
  const hasSections = sectionsForCategory.length > 0;

  // Секция без под-проектов (напр. "Бэкстейдж") — фото показываются
  // сразу по клику на секцию, без промежуточного меню проектов.
  const sectionHasProjects = activeSection ? getProjectsBySection(activeSection).length > 0 : false;

  // Какие фото показывать в галерее:
  // - выбран проект → фото проекта
  // - выбрано "Все" → все фото жанра
  // - выбрана секция без проектов → все фото секции сразу
  // - жанр без секций → все фото жанра сразу
  const activeImages =
    activeCategory && activeCategory !== "bio" && activeCategory !== "video"
      ? activeProject === ALL_PROJECTS
        ? getImagesByCategory(activeCategory)
        : activeProject
        ? getImagesByProject(activeProject)
        : activeSection && !sectionHasProjects
        ? getImagesBySection(activeSection)
        : !hasSections
        ? getImagesByCategory(activeCategory)
        : []
      : [];

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
            key={`desktop-${activeCategory}-${activeSection}-${activeProject}`}
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
                  className="block w-fit text-left py-0 transition-opacity duration-300 cursor-pointer pointer-events-auto"
                  style={{ opacity }}
                >
                  <span className="text-2xl md:text-4xl lg:text-5xl font-normal leading-none">
                    {category.title}
                  </span>
                </button>

                {/* Подменю секций и проектов (напр. Репортаж) */}
                {isActive && hasSections && (
                  <div
                    className="py-3 pl-1 md:pl-2 transition-opacity duration-300"
                    style={{ opacity: isGalleryActive ? 0.2 : 1 }}
                  >
                    {sectionsForCategory.map((section) => {
                      const sectionActive = activeSection === section.id;
                      const sectionProjects = getProjectsBySection(section.id);

                      return (
                        <div key={section.id}>
                          {/* Секция (2-й уровень) */}
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="block w-fit text-left py-1 transition-opacity duration-200 cursor-pointer pointer-events-auto"
                            style={{ opacity: sectionActive ? 1 : 0.5 }}
                          >
                            <span className="text-base md:text-lg font-light leading-snug">
                              {section.title}
                            </span>
                          </button>

                          {/* Проекты внутри секции (3-й уровень).
                              Если у секции нет проектов (напр. "Бэкстейдж"),
                              подсписок не рендерим — фото уже показаны по клику на секцию. */}
                          {sectionActive && sectionProjects.length > 0 && (
                            <div className="pl-3 md:pl-4 pb-2">
                              {sectionProjects.map((project) => {
                                const projectActive = activeProject === project.id;
                                return (
                                  <button
                                    key={project.id}
                                    onClick={() => selectProject(project.id)}
                                    className="block w-fit text-left py-0.5 transition-opacity duration-200 cursor-pointer pointer-events-auto"
                                    style={{ opacity: projectActive ? 1 : 0.4 }}
                                  >
                                    <span className="text-sm md:text-base font-light leading-snug">
                                      {project.title}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Кнопка "Все фото" — неприметная, внизу списка */}
                    <button
                      onClick={() => selectProject(ALL_PROJECTS)}
                      className="block w-fit text-left pt-3 transition-opacity duration-200 cursor-pointer pointer-events-auto"
                      style={{ opacity: activeProject === ALL_PROJECTS ? 0.8 : 0.25 }}
                    >
                      <span className="text-xs md:text-sm font-light tracking-widest uppercase">
                        Все фото
                      </span>
                    </button>
                  </div>
                )}

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
              key={`mobile-${activeCategory}-${activeSection}-${activeProject}`}
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
