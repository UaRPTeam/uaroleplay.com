export default function Footer() {
  const linkClass =
    "inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors";

  return (
    <footer className="border-t border-gray-200 bg-white mt-8">
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
          <a
            href="mailto:team@uaroleplay.com"
            className={linkClass}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M3 7.5h18v9H3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M3 8l9 7 9-7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            team@uaroleplay.com
          </a>
          <a
            href="https://t.me/poshuk_ukrroleplay"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M21 4L3 11l6 2 2 6 10-15z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M9 13l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            TG-канал
          </a>
          <a
            href="https://t.me/ukrroleplay_chat"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M20 4H4a2 2 0 00-2 2v9a2 2 0 002 2h3l3 3 3-3h7a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            Чат
          </a>
          <a
            href="https://www.tiktok.com/@poshuk_ukrroleplay?_t=ZN-90LxszgauHa&_r=1"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M14 4v8.5a3.5 3.5 0 11-2-3.15V4h2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M14 6c1 1.8 2.3 2.9 4 3.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            TikTok
          </a>
          <a
            href="https://x.com/poshukroleplay"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M5 4l14 16M19 4L5 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Twitter / X
          </a>
          <a
            href="https://send.monobank.ua/jar/3euvoXJAfu"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M12 20s-7-4.4-7-10a4 4 0 017-2.8A4 4 0 0119 10c0 5.6-7 10-7 10z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            Підтримати (Monobank)
          </a>
        </div>
      </div>
    </footer>
  );
}
