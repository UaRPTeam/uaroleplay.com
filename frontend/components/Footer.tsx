"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const linkClass =
    "inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors";
  const [copied, setCopied] = useState(false);
  const email = "team@uaroleplay.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <footer className="relative mt-auto shrink-0 border-t border-gray-200 bg-white">
      <div className="max-w-[1440px] mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-12 py-6 md:py-7 lg:py-8 flex flex-col md:flex-row gap-4 md:gap-0 items-start md:items-center justify-between text-sm text-gray-500">
        <div>
          <div className="font-semibold text-gray-700">UaRP</div>
          <div className="text-xs md:text-sm">
            Простір для українськомовних текстових рольових ігор.
          </div>
          <div className="mt-1 text-xs">
            © {new Date().getFullYear()} UaRP. Усі права захищені.
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs md:text-sm">
          {/* Підстав свої реальні посилання замість # */}
          <button
            type="button"
            onClick={handleCopyEmail}
            className={linkClass}
            aria-label="Скопіювати пошту"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M3 7.5h18v9H3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M3 8l9 7 9-7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            <span className="hidden lg:inline">{email}</span>
          </button>
          <a
            href="https://t.me/poshuk_ukrroleplay"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
            aria-label="TG-канал"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M21 4L3 11l6 2 2 6 10-15z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M9 13l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="hidden lg:inline">TG-канал</span>
          </a>
          <a
            href="https://t.me/ukrroleplay_chat"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
            aria-label="Чат"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M20 4H4a2 2 0 00-2 2v9a2 2 0 002 2h3l3 3 3-3h7a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            <span className="hidden lg:inline">Чат</span>
          </a>
          <a
            href="https://www.tiktok.com/@poshuk_ukrroleplay?_t=ZN-90LxszgauHa&_r=1"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
            aria-label="TikTok"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M14 4v8.5a3.5 3.5 0 11-2-3.15V4h2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M14 6c1 1.8 2.3 2.9 4 3.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="hidden lg:inline">TikTok</span>
          </a>
          <a
            href="https://x.com/poshukroleplay"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
            aria-label="Twitter / X"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M5 4l14 16M19 4L5 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="hidden lg:inline">Twitter / X</span>
          </a>
          <a
            href="https://send.monobank.ua/jar/3euvoXJAfu"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
            aria-label="Підтримати (Monobank)"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M12 20s-7-4.4-7-10a4 4 0 017-2.8A4 4 0 0119 10c0 5.6-7 10-7 10z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            <span className="hidden lg:inline">Підтримати (Monobank)</span>
          </a>
        </div>
      </div>

      {copied ? (
        <div className="absolute left-1/2 top-0 z-[70] -translate-x-1/2 -translate-y-[calc(100%+0.75rem)] rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
          Пошту скопійовано
        </div>
      ) : null}
    </footer>
  );
}
