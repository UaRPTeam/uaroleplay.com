"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type PostCatalogCardProps = {
  id: string;
  title: string;
  slug: string;
  categories?: string[];
  hashtags?: Array<{ tag: string; categoryKey: string }>;
  ratingHashtags?: string[];
  mainImage?: string;
  excerpt?: string;
  isFeatured?: boolean;
};

const categoryColors = [
  "text-blue-600",
  "text-fuchsia-600",
  "text-emerald-700",
  "text-orange-600",
];

const groupColorMap: Record<string, { text: string; bg: string }> = {
  profileType: { text: "#3366ff", bg: "#d6e0ff" },
  required: { text: "#ff0066", bg: "#ffd6e8" },
  fandomHashtags: { text: "#00cc66", bg: "#d6f7e8" },
  genre: { text: "#9966ff", bg: "#ebddff" },
  rating: { text: "#cc0000", bg: "#ffd9d9" },
  lineCount: { text: "#006666", bg: "#d6f0f0" },
  default: { text: "#1d4ed8", bg: "#dbeafe" },
};

export default function PostCatalogCard({
  id,
  title,
  slug,
  categories,
  hashtags,
  ratingHashtags,
  mainImage,
  excerpt,
  isFeatured = false,
}: PostCatalogCardProps) {
  const tagsRowRef = useRef<HTMLDivElement | null>(null);
  const measureTagRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [visibleTagCount, setVisibleTagCount] = useState(hashtags?.length ?? 0);

  useEffect(() => {
    if (!hashtags?.length) return;

    const measure = () => {
      const row = tagsRowRef.current;
      if (!row) return;

      const maxWidth = row.clientWidth;
      let count = 0;

      for (let i = 0; i < hashtags.length; i += 1) {
        const el = measureTagRefs.current[i];
        if (!el) continue;
        const rightEdge = el.offsetLeft + el.offsetWidth;
        if (rightEdge <= maxWidth) {
          count = i + 1;
        } else {
          break;
        }
      }

      setVisibleTagCount(count);
    };

    const frameId = requestAnimationFrame(measure);

    const observer = new ResizeObserver(measure);
    if (tagsRowRef.current) {
      observer.observe(tagsRowRef.current);
    }

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [hashtags]);

  return (
    <article className={`${isFeatured ? "lg:col-span-6" : "lg:col-span-4"}`}>
      <Link
        href={`/post/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col"
      >
        {mainImage ? (
          <div
            className={`relative block w-full overflow-hidden rounded-lg ${
              isFeatured ? "h-64 sm:h-72 lg:h-96" : "h-72 sm:h-80 lg:h-[430px]"
            }`}
          >
            {ratingHashtags?.length ? (
              <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1">
                {ratingHashtags.map((tag) => (
                  <span
                    key={`${id}-rating-${tag}`}
                    className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            <Image
              src={mainImage}
              alt={title}
              fill
              sizes={
                isFeatured
                  ? "(max-width: 1024px) 100vw, 700px"
                  : "(max-width: 1024px) 100vw, 450px"
              }
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        ) : null}

        <div className="mt-5 flex flex-1 flex-col">
          {categories?.length ? (
            <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              {categories.slice(0, 2).map((cat, i) => (
                <span
                  key={`${id}-cat-${cat}`}
                  className={`text-xs font-semibold uppercase tracking-[0.08em] ${
                    categoryColors[i % categoryColors.length]
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>
          ) : null}

          <h2 className="min-h-[60px] overflow-hidden text-[24px] font-bold leading-tight text-gray-800 [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
            {title}
          </h2>

          {excerpt ? (
            <p className="mt-4 overflow-hidden text-lg leading-relaxed text-gray-700 [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
              {excerpt}
            </p>
          ) : null}

          {hashtags?.length ? (
            <div className="relative mt-auto pt-5">
              <div ref={tagsRowRef} className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                {hashtags.slice(0, visibleTagCount).map(({ tag, categoryKey }) => (
                  <span
                    key={`${id}-tag-${tag}`}
                    className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{
                      color: (groupColorMap[categoryKey] ?? groupColorMap.default).text,
                      backgroundColor: (groupColorMap[categoryKey] ?? groupColorMap.default).bg,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="pointer-events-none absolute left-0 top-0 -z-10 invisible whitespace-nowrap">
                {hashtags.map(({ tag, categoryKey }, index) => (
                  <span
                    key={`${id}-measure-tag-${tag}`}
                    className="mr-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold last:mr-0"
                    ref={(el) => {
                      measureTagRefs.current[index] = el;
                    }}
                    style={{
                      color: (groupColorMap[categoryKey] ?? groupColorMap.default).text,
                      backgroundColor: (groupColorMap[categoryKey] ?? groupColorMap.default).bg,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
