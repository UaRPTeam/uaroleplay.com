import Image from "next/image";
import Link from "next/link";
import { Amatic_SC } from "next/font/google";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { CSSProperties } from "react";
import { client } from "../client";
import ImageGalleryCarousel, { type ImageGalleryCarouselValue } from "./ImageGalleryCarousel";

type PortableTextNode = {
  _type: string;
  children?: Array<{ text?: string }>;
  align?: "left" | "center" | "right";
  widthPercent?: number;
  offsetX?: number;
  offsetY?: number;
  asset?: {
    _ref?: string;
    _type?: "reference";
    url?: string;
  };
  alt?: string;
};

type PostCustomCardProps = {
  id: string;
  title: string;
  slug: string;
  body?: PortableTextNode[];
  mainImage?: string;
  metaText?: string;
  imageSide?: "left" | "right";
};

const imageBuilder = imageUrlBuilder(client);

const titleFont = Amatic_SC({
  subsets: ["latin"],
  weight: ["700"],
});

const getBlockAlign = (value: { children?: Array<{ marks?: string[]; text?: string }> } | undefined): CSSProperties["textAlign"] | undefined => {
  const children = (value?.children ?? []).filter((child) => (child?.text ?? "").trim().length > 0);
  if (!children.length) return undefined;

  const hasMark = (mark: string) => children.every((child) => Array.isArray(child.marks) && child.marks.includes(mark));

  if (hasMark("alignRight")) return "right";
  if (hasMark("alignCenter")) return "center";
  if (hasMark("alignLeft")) return "left";
  return undefined;
};

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return <p className="mb-4 text-lg leading-relaxed text-gray-900 sm:text-xl" style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>{children}</p>;
    },
    h1: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return <h1 className={`${titleFont.className} mb-4 mt-8 text-6xl uppercase leading-[0.9] text-gray-950`} style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>{children}</h1>;
    },
    h2: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return <h2 className={`${titleFont.className} mb-4 mt-7 text-5xl uppercase leading-[0.9] text-gray-950`} style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>{children}</h2>;
    },
    h3: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return <h3 className={`${titleFont.className} mb-4 mt-6 text-4xl uppercase leading-[0.9] text-gray-950`} style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>{children}</h3>;
    },
    h4: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return <h4 className={`${titleFont.className} mb-3 mt-6 text-3xl uppercase leading-[0.9] text-gray-950`} style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>{children}</h4>;
    },
    h5: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return <h5 className={`${titleFont.className} mb-3 mt-5 text-2xl uppercase leading-[0.9] text-gray-950`} style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>{children}</h5>;
    },
    h6: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return <h6 className={`${titleFont.className} mb-3 mt-5 text-xl uppercase leading-[0.9] text-gray-950`} style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>{children}</h6>;
    },
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-slate-400 pl-4 text-lg italic leading-relaxed text-slate-800">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="pt-list-bullet mb-4 space-y-2 text-lg leading-relaxed text-gray-900 sm:text-xl">{children}</ul>,
    number: ({ children }) => <ol className="mb-4 list-inside list-decimal space-y-2 text-lg leading-relaxed text-gray-900 sm:text-xl">{children}</ol>,
  },
  marks: {
    alignLeft: ({ children }) => <>{children}</>,
    alignCenter: ({ children }) => <>{children}</>,
    alignRight: ({ children }) => <>{children}</>,
    highlight: ({ children }) => <mark className="rounded bg-yellow-200 px-1 text-inherit">{children}</mark>,
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : undefined;
      if (!href) return <>{children}</>;
      const isBlank = Boolean(value?.blank);
      return (
        <a
          href={href}
          className="font-medium text-blue-700 underline decoration-blue-400 underline-offset-2 transition-colors hover:text-blue-800"
          target={isBlank ? "_blank" : undefined}
          rel={isBlank ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    imageGalleryCarousel: ({ value }) => {
      const carousel = value as ImageGalleryCarouselValue;
      return <ImageGalleryCarousel images={carousel.images} rounded={carousel.rounded !== false} />;
    },
    image: ({ value }) => {
      const imageValue = value as PortableTextNode;
      const imageRef = imageValue?.asset?._ref;
      const imageUrlFromRef = imageRef
        ? imageBuilder
            .image({ _type: "image", asset: { _type: "reference", _ref: imageRef } })
            .width(1600)
            .auto("format")
            .url()
        : null;
      const imageUrl = imageValue?.asset?.url ?? imageUrlFromRef;
      if (!imageUrl) return null;
      const align = imageValue?.align ?? "center";
      const rawWidthPercent = imageValue?.widthPercent;
      const widthPercent = typeof rawWidthPercent === "number" ? Math.min(100, Math.max(20, rawWidthPercent)) : 100;
      const rawOffsetX = imageValue?.offsetX;
      const rawOffsetY = imageValue?.offsetY;
      const offsetX = typeof rawOffsetX === "number" ? Math.min(400, Math.max(-400, rawOffsetX)) : 0;
      const offsetY = typeof rawOffsetY === "number" ? Math.min(300, Math.max(0, rawOffsetY)) : 0;
      const wrapperStyle: CSSProperties = {
        width: `${widthPercent}%`,
        maxWidth: "100%",
        transform: `translateX(${offsetX}px)`,
        marginTop: `${offsetY}px`,
        marginBottom: "1rem",
      };

      if (align === "center") {
        wrapperStyle.marginLeft = "auto";
        wrapperStyle.marginRight = "auto";
      } else if (align === "right") {
        wrapperStyle.float = "right";
        wrapperStyle.marginLeft = "1rem";
        wrapperStyle.marginRight = 0;
      } else {
        wrapperStyle.float = "left";
        wrapperStyle.marginRight = "1rem";
        wrapperStyle.marginLeft = 0;
      }

      return (
        <figure className="my-6 overflow-hidden rounded-lg" style={wrapperStyle}>
          <Image
            src={imageUrl}
            alt={imageValue?.alt?.trim() || "Зображення у пості"}
            width={1600}
            height={1200}
            className="h-auto w-full object-cover"
          />
        </figure>
      );
    },
  },
};

export default function PostCustomCard({
  id,
  title,
  slug,
  body,
  mainImage,
  metaText,
  imageSide = "right",
}: PostCustomCardProps) {
  const textOrderClass = imageSide === "left" ? "lg:order-2" : "lg:order-1";
  const imageOrderClass = imageSide === "left" ? "lg:order-1" : "lg:order-2";
  const gridColumnsClass = mainImage ? "lg:grid-cols-[1.2fr_0.8fr]" : "lg:grid-cols-1";

  return (
    <article data-post-template="custom" data-post-id={id} className="py-8 sm:py-10">
      <div className={`w-full grid items-center gap-6 md:gap-8 ${gridColumnsClass} lg:gap-10`}>
        <div className={textOrderClass}>
          <h2 className={`${titleFont.className} text-center text-5xl uppercase leading-[0.9] text-gray-950 sm:text-6xl lg:text-left`}>
            <Link href={`/post/${slug}`} className="transition-opacity hover:opacity-75">
              {title}
            </Link>
          </h2>

          <div className="mt-6 portable-richtext">
            {body?.length ? <PortableText value={body} components={portableTextComponents} /> : null}
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
