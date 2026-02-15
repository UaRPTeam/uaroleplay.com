import Image from "next/image";
import Link from "next/link";
import { Amatic_SC } from "next/font/google";

type PostCustomCardProps = {
  id: string;
  title: string;
  slug: string;
  paragraphs?: string[];
  mainImage?: string;
  metaText?: string;
  imageSide?: "left" | "right";
};

const titleFont = Amatic_SC({
  subsets: ["latin"],
  weight: ["700"],
});

export default function PostCustomCard({
  id,
  title,
  slug,
  paragraphs,
  mainImage,
  metaText,
  imageSide = "right",
}: PostCustomCardProps) {
  const textOrderClass = imageSide === "left" ? "lg:order-2" : "lg:order-1";
  const imageOrderClass = imageSide === "left" ? "lg:order-1" : "lg:order-2";

  return (
    <article data-post-template="custom" data-post-id={id} className="py-8 sm:py-10">
      <div className="grid items-center gap-6 md:gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
        <div className={textOrderClass}>
          <h2 className={`${titleFont.className} text-center text-5xl uppercase leading-[0.9] text-gray-950 sm:text-6xl lg:text-left`}>
            <Link href={`/post/${slug}`} className="transition-opacity hover:opacity-75">
              {title}
            </Link>
          </h2>

          <div className="mt-6 space-y-4 sm:space-y-5">
            {(paragraphs ?? []).slice(0, 3).map((paragraph, index) => (
              <p key={`${id}-paragraph-${index}`} className="text-lg leading-relaxed text-gray-900 sm:text-xl">
                {paragraph}
              </p>
            ))}
          </div>

          {metaText ? <p className="mt-6 text-sm text-gray-600">{metaText}</p> : null}
        </div>

        {mainImage ? (
          <div className={`${imageOrderClass} mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px]`}>
            <div className="relative aspect-square w-full">
              <Image
                src={mainImage}
                alt={title}
                fill
                sizes="(max-width: 1024px) 60vw, 360px"
                className="object-contain"
              />
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
