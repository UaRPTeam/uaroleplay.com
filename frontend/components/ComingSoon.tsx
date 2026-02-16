import Link from "next/link";

type ComingSoonProps = {
  title?: string;
  subtitle?: string;
};

export default function ComingSoon({
  title = "Coming soon",
  subtitle = "Сторінка тимчасово недоступна.",
}: ComingSoonProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-[900px] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
        UaRP
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-base text-gray-600 sm:text-lg">
        {subtitle}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-lg border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
      >
        На головну
      </Link>
    </main>
  );
}
