import Image from "next/image";
import Link from "next/link";
import groq from "groq";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { client } from "../../../client";

export const revalidate = 0;

type PostDetails = {
  title: string;
  categories?: string[];
  hashtags?: Array<string | { category?: string; tags?: string[] }>;
  hashtag?: string;
  postStyle?: "tips" | "catalog";
  mainImage?: string;
  body?: PortableTextBlock[];
};

type PortableTextSpan = {
  _type: string;
  text?: string;
};

type PortableTextBlock = {
  _type: string;
  children?: PortableTextSpan[];
};

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-lg leading-9 text-gray-700">{children}</p>
    ),
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

  const isTipsStyle =
    post.postStyle === "tips" ||
    Boolean(post.categories?.some((c) => c.toLowerCase() === "поради"));

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
  const backHref = isTipsStyle ? "/catalog" : "/post";
  const backLabel = isTipsStyle ? "← До порад" : "← До каталогу";
  const categoryAccent = isTipsStyle ? "text-emerald-600" : "text-blue-600";

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

        <div className="mx-auto mt-10 max-w-[780px]">
          <PortableText value={post.body ?? []} components={portableTextComponents} />
        </div>
      </article>
    </>
  );
}
