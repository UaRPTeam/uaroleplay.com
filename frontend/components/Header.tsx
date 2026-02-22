"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Головна" },
    { href: "/tips", label: "Поради" },
    { href: "/catalog", label: "Каталог" },
    { href: "/about", label: "Що таке ТРІ?" },
  ];

  const linkClass = (href: string) => {
    const isHome = href === "/";
    const isActive = isHome ? pathname === "/" : pathname.startsWith(href);

    return `transition-colors hover:text-blue-600 focus:text-blue-600 ${
      isActive ? "text-blue-600" : ""
    }`;
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white">
      <div className="pointer-events-none absolute inset-0 bg-white/75 backdrop-blur-md" />
      <div className="relative max-w-[1440px] mx-auto w-full flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-12 py-3 md:py-4">
        <Link href="/" className="flex items-center gap-2">
          {/* Якщо є лого-котик, поклади його в /public/logo.png і розкоментуй */}
          <Image src="/logo.png" alt="UaRP" width={32} height={32} className="h-8 w-8 rounded-full" />
          <span className="text-2xl font-extrabold tracking-tight text-blue-600">
            UaRP
          </span>
          <span className="hidden lg:block text-xs text-gray-500 italic">
            простір українськомовних ролівок
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 lg:gap-7 text-base text-gray-700 font-medium">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass(item.href)}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Відкрити меню"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation-modal"
          onClick={() => setIsMenuOpen(true)}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {isMenuOpen ? (
        <div
          className="lg:hidden fixed inset-0 z-[60] bg-black/45 px-3 sm:px-4 pt-3 pb-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            id="mobile-navigation-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Мобільне меню"
            className="ml-auto mr-0 mt-16 w-[280px] max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Меню
              </p>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                aria-label="Закрити меню"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1 text-base font-medium text-gray-800">
              {navLinks.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={`mobile-${item.href}`}
                    href={item.href}
                    className={`rounded-md px-3 py-2 transition-colors hover:bg-blue-50 hover:text-blue-700 ${
                      isActive ? "bg-blue-50 text-blue-700" : ""
                    }`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
