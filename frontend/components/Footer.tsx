export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row gap-4 sm:gap-0 items-start sm:items-center justify-between text-sm text-gray-500">
        <div>
          <div className="font-semibold text-gray-700">UaRP</div>
          <div className="text-xs sm:text-sm">
            Простір для українськомовних текстових рольових ігор.
          </div>
          <div className="mt-1 text-xs">
            © {new Date().getFullYear()} UaRP. Усі права захищені.
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm">
          {/* Підстав свої реальні посилання замість # */}
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            📣 TG-канал
          </a>
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            💬 Чат
          </a>
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            🎵 TikTok
          </a>
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            🐦 Twitter / X
          </a>
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            💖 Підтримати (Monobank)
          </a>
        </div>
      </div>
    </footer>
  );
}
