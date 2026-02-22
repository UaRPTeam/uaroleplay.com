import Image from "next/image";
import Link from "next/link";
import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import { Amatic_SC } from "next/font/google";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { CSSProperties } from "react";
import { client } from "../../../client";
import ImageGalleryCarousel, { type ImageGalleryCarouselValue } from "../../../components/ImageGalleryCarousel";

export const revalidate = 0;

type PostDetails = {
  title: string;
  categories?: string[];
  hashtags?: Array<string | { category?: string; tags?: string[] }>;
  hashtag?: string;
  postStyle?: "tips" | "catalog" | "about";
  mainImage?: string;
  body?: PortableTextNode[];
};

type PortableTextSpan = {
  _type: string;
  text?: string;
};

type PortableTextBlock = {
  _type: string;
  children?: PortableTextSpan[];
};

type PortableTextImage = {
  _type: "image";
  alt?: string;
  align?: "left" | "center" | "right";
  widthPercent?: number;
  offsetX?: number;
  offsetY?: number;
  asset?: {
    _ref?: string;
    _type?: "reference";
    url?: string;
  };
};

type PortableTextNode = PortableTextBlock | PortableTextImage;

const imageBuilder = imageUrlBuilder(client);
const headingFont = Amatic_SC({
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
      return <p className="mb-6 text-lg leading-9 text-gray-700" style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>{children}</p>;
    },
    h1: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return <h1 className={`${headingFont.className} mb-6 mt-10 text-6xl uppercase leading-[0.9] text-gray-900 sm:text-7xl`} style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>{children}</h1>;
    },
    h2: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return <h2 className={`${headingFont.className} mb-5 mt-9 text-5xl uppercase leading-[0.9] text-gray-900`} style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>{children}</h2>;
    },
    h3: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return <h3 className={`${headingFont.className} mb-4 mt-8 text-4xl uppercase leading-[0.9] text-gray-900`} style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>{children}</h3>;
    },
    h4: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return <h4 className={`${headingFont.className} mb-4 mt-7 text-3xl uppercase leading-[0.9] text-gray-900`} style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>{children}</h4>;
    },
    h5: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return <h5 className={`${headingFont.className} mb-3 mt-6 text-2xl uppercase leading-[0.9] text-gray-900`} style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>{children}</h5>;
    },
    h6: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return <h6 className={`${headingFont.className} mb-3 mt-6 text-xl uppercase leading-[0.9] text-gray-900`} style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>{children}</h6>;
    },
    blockquote: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return (
      <blockquote className="my-8 border-l-4 border-slate-400 pl-4 text-xl italic leading-9 text-slate-700" style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>
        {children}
      </blockquote>
    );
    },
  },
  list: {
    bullet: ({ children }) => <ul className="pt-list-bullet mb-6 space-y-2 text-lg leading-9 text-gray-700">{children}</ul>,
    number: ({ children }) => <ol className="mb-6 list-inside list-decimal space-y-2 text-lg leading-9 text-gray-700">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
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
      const imageValue = value as PortableTextImage;
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
        <figure className="my-8 overflow-hidden rounded-lg" style={wrapperStyle}>
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

export default async function PostDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await client.fetch<PostDetails | null>(
    groq`
      *[_type == "post" && slug.current == $slug][0]{
        title,
        "categories": categories[]->title,
        hashtags,
        hashtag,
        postStyle,
        "mainImage": mainImage.asset->url,
        body
      }
    `,
    { slug }
  );

  if (!post) {
    notFound();
  }

  const categoryTitles = post.categories?.map((category) => category.toLowerCase()) ?? [];
  const pageType =
    post.postStyle === "catalog" || categoryTitles.includes("каталог")
      ? "catalog"
      : post.postStyle === "about" ||
          categoryTitles.includes("що таке трі") ||
          categoryTitles.includes("що таке три")
        ? "about"
        : "tips";

  const groupColorMap: Record<string, { text: string; bg: string }> = {
    profileType: { text: "#3366ff", bg: "#d6e0ff" },
    required: { text: "#ff0066", bg: "#ffd6e8" },
    fandomHashtags: { text: "#00cc66", bg: "#d6f7e8" },
    genre: { text: "#9966ff", bg: "#ebddff" },
    rating: { text: "#cc0000", bg: "#ffd9d9" },
    lineCount: { text: "#006666", bg: "#d6f0f0" },
    default: { text: "#1d4ed8", bg: "#dbeafe" },
  };

  const categorizedTags = (post.hashtags ?? [])
    .map((item) => {
      if (typeof item === "string") {
        return [{ categoryKey: "default", tag: item }];
      }
      if (!item || typeof item !== "object") {
        return null;
      }
      const categoryKey = item.category ?? "default";
      const tags = (item.tags ?? []).map((tag) => tag.trim()).filter(Boolean);
      return tags.length ? tags.map((tag) => ({ categoryKey, tag })) : null;
    })
    .flat()
    .filter((item): item is { categoryKey: string; tag: string } => Boolean(item?.tag));

  const hashtags = Array.from(
    new Set(
      [
        ...categorizedTags.map((item) => item.tag),
        ...(post.hashtag ? [post.hashtag] : []),
      ]
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );
  const categoryByTag = new Map<string, string>();
  categorizedTags.forEach((item) => {
    if (!categoryByTag.has(item.tag)) {
      categoryByTag.set(item.tag, item.categoryKey);
    }
  });
  const backHref = pageType === "catalog" ? "/catalog" : pageType === "about" ? "/about" : "/tips";
  const backLabel = pageType === "catalog" ? "← До каталогу" : pageType === "about" ? "← До сторінки ТРІ" : "← До порад";
  const categoryAccent =
    pageType === "catalog" ? "text-blue-600" : pageType === "about" ? "text-sky-700" : "text-emerald-600";

  return (
    <>
      <div className="pt-2 md:pt-6">
        <Link
          href={backHref}
          aria-label={backLabel}
          className="text-base text-blue-600 transition-colors hover:text-blue-700 sm:text-lg"
        >
          <span aria-hidden="true">←</span>
          <span className="hidden sm:inline"> {backLabel.replace("← ", "")}</span>
        </Link>
      </div>

      <article className="mx-auto w-full max-w-[1100px] pb-14 pt-2 md:pt-4">

      {post.categories?.[0] ? (
        <p className={`text-center text-xs font-semibold uppercase tracking-[0.14em] ${categoryAccent}`}>
          {post.categories[0]}
        </p>
      ) : null}

      <h1 className="mx-auto mt-3 max-w-[900px] text-center text-4xl font-bold leading-tight text-gray-800 sm:text-5xl">
        {post.title}
      </h1>

      {hashtags.length ? (
        <div className="mx-auto mt-4 flex max-w-[900px] flex-wrap items-center justify-center gap-2">
          {hashtags.map((tag) => (
            <span
              key={`${post.title}-${tag}`}
              className="rounded-full px-3 py-1 text-xs font-semibold sm:text-sm"
              style={{
                color: (groupColorMap[categoryByTag.get(tag) ?? "default"] ?? groupColorMap.default).text,
                backgroundColor: (groupColorMap[categoryByTag.get(tag) ?? "default"] ?? groupColorMap.default).bg,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      {post.mainImage ? (
        <div className="relative mt-8 h-[340px] overflow-hidden rounded-lg sm:h-[520px]">
          <Image
            src={post.mainImage}
            alt={post.title}
            fill
            sizes="(max-width: 1200px) 100vw, 1100px"
            className="object-cover"
          />
        </div>
      ) : null}

        <div className="portable-richtext mx-auto mt-10 max-w-[780px]">
          <PortableText value={post.body ?? []} components={portableTextComponents} />
        </div>
      </article>
    </>
  );
}
