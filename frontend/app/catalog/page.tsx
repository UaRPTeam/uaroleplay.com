import Link from "next/link";
import Image from "next/image";

export default function CatalogPage() {
  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-r from-amber-50 via-rose-50 to-sky-50 px-6 py-10 sm:px-10 sm:py-14">
        {/* Якщо є фонова картинка — поклади її в /public/hero-bg.png і додай як background-image */}
        <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-gray-500 mb-3">
              Нумо розвивати простір українськомовних ролівок разом
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
              UaRP — пошук рольових і співролів
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-xl">
              Текстові рольові ігри українською: місце, де можна знайти гру під
              настрій, знайти співролів і поділитися власним всесвітом.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/post"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                Читати гіди та статті
              </Link>
              <Link
                href="/contacts"
                className="inline-flex items-center justify-center rounded-full border border-blue-300 bg-white/70 px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
              >
                Долучитися до спільноти
              </Link>
            </div>
          </div>

          {/* Місце під котика / ілюстрацію */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              {/* Заміни на свою картинку */}
              {/* <img src="/hero-cat.png" alt="Котик-рольовик" className="h-56 sm:h-64 lg:h-72 w-auto drop-shadow-xl" /> */}
              <div className="h-48 w-48 sm:h-56 sm:w-56 lg:h-64 lg:w-64">
                <Image
                  src="/logo.png"
                  alt="UaRP logo"
                  width={256}
                  height={256}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-full bg-white/80 px-3 py-1 text-xs shadow">
                перший каталог укр. ТРІ
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ТРИ БЛОКИ */}
      <section className="space-y-12">
        {/* 1: Що таке текстові рольові ігри */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center">
          <div className="flex justify-center lg:justify-start">
            <div className="w-[170px] sm:w-[210px] md:w-[240px] lg:w-[260px] max-w-full">
              <Image
                src="/images/catalog-01.png"
                alt="Іконка: текстові рольові ігри"
                width={422}
                height={568}
                sizes="(max-width: 640px) 170px, (max-width: 768px) 210px, (max-width: 1024px) 240px, 260px"
                className="h-auto w-full"
              />
            </div>
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold mb-2">
              Що таке текстові рольові ігри?
            </h2>
            <p className="text-gray-700 mb-3">
              Текстова рольова — це гра, де ти береш на себе роль вигаданого
              персонажа й описуєш його дії, думки та мову. Це як спільне письмо
              історії, сцена за сценою, але з елементом гри й імпровізації.
            </p>
            <p className="text-gray-700 mb-4">
              На UaRP ми хочемо зібрати пояснення, приклади, поради та живі
              історії з українських ролівок, щоб новачкам було легше зробити
              перший крок.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Link
                href="/about"
                className="inline-flex rounded-full border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
              >
                Детальніше
              </Link>
            </div>
          </div>
        </div>

        {/* 2: Каталог рольових груп */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <h2 className="text-2xl font-bold mb-2">Каталог рольових груп</h2>
            <p className="text-gray-700 mb-3">
              Перший каталог українськомовних діючих ролівок. Тут ви зможете
              знайти гру за власним смаком: від побутового сучасного до епічного
              фентезі чи наукової фантастики.
            </p>
            <p className="text-gray-700 mb-4">
              У майбутньому тут буде зручний фільтр за жанром, тоном гри,
              платформою та віковими обмеженнями.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Link
                href="/catalog"
                className="inline-flex rounded-full border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
              >
                Перейти до каталогу
              </Link>
            </div>
          </div>
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="w-[190px] sm:w-[240px] md:w-[280px] lg:w-[430px] max-w-full">
              <Image
                src="/images/catalog-02.png"
                alt="Іконка: каталог рольових груп"
                width={622}
                height={512}
                sizes="(max-width: 640px) 190px, (max-width: 768px) 240px, (max-width: 1024px) 280px, 430px"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>

        {/* 3: Поради для рольовиків */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center">
          <div className="flex justify-center lg:justify-start">
            <div className="w-[170px] sm:w-[210px] md:w-[240px] lg:w-[330px] max-w-full">
              <Image
                src="/images/catalog-03.png"
                alt="Іконка: поради для рольовиків"
                width={474}
                height={513}
                sizes="(max-width: 640px) 170px, (max-width: 768px) 210px, (max-width: 1024px) 240px, 330px"
                className="h-auto w-full"
              />
            </div>
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold mb-2">Поради для рольовиків</h2>
            <p className="text-gray-700 mb-3">
              Корисні гайди, відповіді на часті питання, матеріали як для
              новачків, так і для досвідчених рольовиків.
            </p>
            <p className="text-gray-700 mb-4">
              Ми плануємо публікувати статті від організаторів і гравців, а
              також перекладати корисні матеріали українською.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Link
                href="/post"
                className="inline-flex rounded-full border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
              >
                Читати поради
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
