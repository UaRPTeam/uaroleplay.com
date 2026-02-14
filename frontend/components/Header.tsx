"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const isHome = href === "/";
    const isActive = isHome ? pathname === "/" : pathname.startsWith(href);

    return `transition-colors hover:text-blue-600 focus:text-blue-600 ${
      isActive ? "text-blue-600" : ""
    }`;
  };

  return (
    <header className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
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
          <Link href="/" className={linkClass("/")} aria-current={pathname === "/" ? "page" : undefined}>
            Головна
          </Link>
          <Link href="/post" className={linkClass("/post")} aria-current={pathname.startsWith("/post") ? "page" : undefined}>
            Поради
          </Link>
          <Link href="/catalog" className={linkClass("/catalog")} aria-current={pathname.startsWith("/catalog") ? "page" : undefined}>
            Каталог
          </Link>
          <Link href="/about" className={linkClass("/about")} aria-current={pathname.startsWith("/about") ? "page" : undefined}>
            Що таке ТРІ?
          </Link>
        </nav>
      </div>
    </header>
  );
}
