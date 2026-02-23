import Link from "next/link";
import { Amatic_SC } from "next/font/google";

const headingFont = Amatic_SC({
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata = {
  title: "Приєднатись | UaRP",
  description: "Сторінка приєднання до спільноти UaRP.",
};

export default function JoinPage() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-40 bg-[#cfe0ec]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/vecteezy_rainbow_pastel_blurred_background.svg')" }}
      />

      <main className="relative z-10 py-10 sm:py-14">
        <section className="mx-auto w-full max-w-[1100px] px-3 sm:px-4 md:px-6">
          <h1
            className={`${headingFont.className} mb-8 text-center text-6xl uppercase leading-[0.9] text-gray-950 sm:mb-10 sm:text-7xl`}
          >
            Приєднатись
          </h1>

          <div className="mx-auto max-w-[760px] rounded-2xl bg-white/55 p-6 text-center backdrop-blur-sm sm:p-8">
            <p className="text-base leading-8 text-slate-800 sm:text-lg">
              Долучайся до українськомовної спільноти текстових рольових ігор:
              знайди співролів, переглянь поради, публікуй анкети та відкривай
              нові історії.
            </p>

            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
              <a
                href="https://t.me/ukrroleplay_chat"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#33ffad] px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-[#27e79b]"
              >
                Перейти в чат
              </a>
              <a
                href="https://t.me/poshuk_ukrroleplay"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                TG-канал
              </a>
              <Link
                href="/tips"
                className="inline-flex items-center justify-center rounded-full bg-pink-400 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-500"
              >
                Поради для старту
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
