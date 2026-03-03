import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 font-sans">
      <div className="flex items-center gap-4">
        <span className="text-6xl md:text-7xl font-medium text-[var(--text)]">404</span>
        <span className="w-px h-12 md:h-14 bg-[var(--border)]" aria-hidden />
        <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-xs">
          Эта страница не найдена.
        </p>
      </div>
      <Link
        href="/"
        className="mt-8 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
      >
        ← На главную
      </Link>
    </div>
  );
}
