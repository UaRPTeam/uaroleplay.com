import Image from "next/image";
import Link from "next/link";

type PostCatalogCardProps = {
  id: string;
  title: string;
  slug: string;
  categories?: string[];
  primaryHashtag?: string;
  ratingHashtags?: string[];
  author?: string;
  authorImage?: string;
  mainImage?: string;
  excerpt?: string;
  publishedAtText?: string;
  isFeatured?: boolean;
};

const categoryColors = [
  "text-blue-600",
  "text-fuchsia-600",
  "text-emerald-700",
  "text-orange-600",
];

export default function PostCatalogCard({
  id,
  title,
  slug,
  categories,
  primaryHashtag,
  ratingHashtags,
  author,
  authorImage,
  mainImage,
  excerpt,
  publishedAtText,
  isFeatured = false,
}: PostCatalogCardProps) {
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

        <div className="mt-5 flex flex-col">
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
            <p className="mt-4 overflow-hidden text-ellipsis whitespace-nowrap text-lg leading-relaxed text-gray-700">
              {excerpt}
            </p>
          ) : null}

          <div className="mt-5 flex items-center gap-3 text-sm text-gray-500">
            {authorImage ? (
              <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
                <Image src={authorImage} alt={author ?? "author"} fill className="object-cover" />
              </div>
            ) : (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-300 text-[10px] font-semibold text-gray-700">
                {(author ?? "A").slice(0, 1).toUpperCase()}
              </span>
            )}
            <span className="font-medium text-gray-600">{author ?? "Author"}</span>
            {primaryHashtag ? (
              <>
                <span className="text-gray-400">•</span>
                <span className="font-semibold text-blue-600">{primaryHashtag}</span>
              </>
            ) : null}
            {publishedAtText ? (
              <>
                <span className="text-gray-400">•</span>
                <span>{publishedAtText}</span>
              </>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
