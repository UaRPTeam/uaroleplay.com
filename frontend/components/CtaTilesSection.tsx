"use client";

import Image from "next/image";
import Link from "next/link";

export type CtaTile = {
  _key?: string;
  title?: string;
  ctaLabel?: string;
  href?: string;
  accent?: "blue" | "yellow" | "pink" | "mint" | string;
  image?: {
    asset?: {
      url?: string;
    };
  };
  imageUrl?: string;
};

export type TilesSectionValue = {
  _type?: "tilesSection";
  items?: CtaTile[];
  columnsDesktop?: number;
  rounded?: boolean;
  background?: boolean;
};

type Props = {
  value: TilesSectionValue;
};

const accentStyles: Record<string, string> = {
  blue: "bg-blue-600 text-white hover:bg-blue-700",
  yellow: "bg-yellow-300 text-slate-900 hover:bg-yellow-400",
  pink: "bg-pink-400 text-white hover:bg-pink-500",
  mint: "bg-[#33ffad] text-slate-900 hover:bg-[#27e79b]",
};

function normalizeTileHref(rawHref: string | undefined) {
  const href = rawHref?.trim();
  if (!href) return "#";

  // Keep absolute and special protocols untouched.
  if (/^(https?:\/\/|mailto:|tel:|#)/i.test(href)) return href;

  // Sanity can store "catalog" or "/catalog" - both should become internal root-relative URLs.
  return href.startsWith("/") ? href : `/${href}`;
}

function TileCard({
  item,
  index,
  roundedClass,
  withBackground,
  className,
}: {
  item: CtaTile;
  index: number;
  roundedClass: string;
  withBackground: boolean;
  className?: string;
}) {
  const href = normalizeTileHref(item.href);
  const imageUrl = item.imageUrl ?? item.image?.asset?.url;
  const accent = accentStyles[item.accent ?? "blue"] ?? accentStyles.blue;

  return (
    <Link
      key={item._key ?? `${item.title ?? "tile"}-${index}`}
      href={href}
      className={`group relative overflow-hidden p-5 sm:p-6 transition-transform hover:-translate-y-0.5 ${
        withBackground ? "bg-white/55 backdrop-blur-sm" : "bg-transparent"
      } ${roundedClass} ${className ?? ""}`}
    >
      <div className="relative z-10 flex h-full min-h-[180px] flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
            {item.title ?? "CTA"}
          </h3>
          {imageUrl ? (
            <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
              <Image
                src={imageUrl}
                alt={item.title?.trim() || "CTA image"}
                fill
                sizes="96px"
                className="object-contain"
              />
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3">
          <span
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors ${accent}`}
          >
            {item.ctaLabel ?? "Відкрити"}
          </span>
          <span className="text-sm font-medium text-slate-600 transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function CtaTilesSection({ value }: Props) {
  const items = (value.items ?? []).filter((item) => item?.title || item?.ctaLabel || item?.href);
  if (!items.length) return null;

  const roundedClass = value.rounded === false ? "rounded-none" : "rounded-2xl";
  const withBackground = value.background !== false;
  const columns = Math.max(1, Math.min(4, value.columnsDesktop ?? 2));
  const desktopColsClass =
    columns >= 4 ? "xl:grid-cols-4 lg:grid-cols-4" : columns === 3 ? "xl:grid-cols-3 lg:grid-cols-3" : "xl:grid-cols-2 lg:grid-cols-2";
  const useFeaturedLeftLayout = items.length === 3;

  return (
    <section className="mt-8 sm:mt-10">
      {useFeaturedLeftLayout ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:auto-rows-fr">
          <TileCard
            item={items[0]}
            index={0}
            roundedClass={roundedClass}
            withBackground={withBackground}
            className="md:row-span-2"
          />
          <TileCard item={items[1]} index={1} roundedClass={roundedClass} withBackground={withBackground} />
          <TileCard item={items[2]} index={2} roundedClass={roundedClass} withBackground={withBackground} />
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${desktopColsClass}`}>
          {items.map((item, index) => (
            <TileCard
              key={item._key ?? `${item.title ?? "tile"}-${index}`}
              item={item}
              index={index}
              roundedClass={roundedClass}
              withBackground={withBackground}
            />
          ))}
        </div>
      )}
    </section>
  );
}
