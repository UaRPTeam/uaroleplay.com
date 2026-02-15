import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";

const heroHeadingFont = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700"],
});

const heroBodyFont = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

export default function Home() {
  return (
    <section
      className="relative min-h-[70vh] w-full overflow-hidden rounded-none md:rounded-3xl bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('/images/hero.jpeg')",
      }}
    >
      <div className="relative z-10 flex min-h-[70vh] items-center justify-center px-6 py-10 text-center sm:px-10 sm:py-14">
        <div className="-translate-y-8 max-w-xl sm:-translate-y-10">
          <p
            className={`${heroBodyFont.className} -mt-6 mb-3 text-xs uppercase tracking-[0.24em] text-slate-600 sm:-mt-8 sm:text-sm`}
          >
            Нумо розвивати простір українськомовних ролівок разом
          </p>
          <h1
            className={`${heroHeadingFont.className} mb-4 text-4xl font-bold leading-[0.95] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl`}
          >
            UaRP — пошук рольових і співролів
          </h1>
          <p
            className={`${heroBodyFont.className} mt-8 mb-6 max-w-xl text-base font-medium leading-relaxed text-slate-700 sm:mt-10 sm:text-lg`}
          >
            Текстові рольові ігри українською: місце, де можна знайти гру під
            настрій, знайти співролів і поділитися власним всесвітом.
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-6 flex flex-col items-stretch gap-3 px-4 sm:bottom-8 sm:flex-row sm:items-end sm:justify-between sm:px-10">
          <Link
            href="/post"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Читати гіди та статті
          </Link>
          <Link
            href="/contacts"
            className="inline-flex items-center justify-center rounded-lg border border-blue-300 bg-white/70 px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            Долучитися до спільноти
          </Link>
        </div>
      </div>
    </section>
  );
}
