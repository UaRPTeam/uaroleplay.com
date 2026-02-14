import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <Link href="/" className="flex items-center gap-2">
          {/* Якщо є лого-котик, поклади його в /public/logo.png і розкоментуй */}
          <img src="/logo.png" alt="UaRP" className="h-8 w-8 rounded-full" />
          <span className="text-2xl font-extrabold tracking-tight text-blue-600">
            UaRP
          </span>
          <span className="hidden sm:block text-xs text-gray-500 italic">
            простір українськомовних ролівок
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-700 font-medium">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Головна
          </Link>
          <Link href="/post" className="hover:text-blue-600 transition-colors">
            Поради
          </Link>
          <Link
            href="/catalog" // коли зʼявиться сторінка каталогу, підлаштуєш маршрут
            className="hover:text-blue-600 transition-colors"
          >
            Каталог
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">
            Що таке ТРІ?
          </Link>
        </nav>
      </div>
    </header>
  );
}
