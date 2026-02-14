import Image from "next/image";
import Link from "next/link";
import groq from "groq";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { client } from "../../../client";

type PostDetails = {
  title: string;
  publishedAt?: string;
  author?: string;
  authorImage?: string;
  categories?: string[];
  mainImage?: string;
  body?: Array<Record<string, unknown>>;
};

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-lg leading-9 text-gray-700">{children}</p>
    ),
  },
};

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function estimateReadTime(body?: Array<Record<string, unknown>>) {
  const text =
    body
      ?.filter((block) => block?._type === "block")
      .flatMap((block) => block.children ?? [])
      .map((child) => child.text ?? "")
      .join(" ") ?? "";

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

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
        publishedAt,
        "author": author->name,
        "authorImage": author->image.asset->url,
        "categories": categories[]->title,
        "mainImage": mainImage.asset->url,
        body
      }
    `,
    { slug }
  );

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-[1100px] px-4 pb-14 pt-4 sm:px-6 sm:pt-8">
      {post.categories?.[0] ? (
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
          {post.categories[0]}
        </p>
      ) : null}

      <h1 className="mx-auto mt-3 max-w-[900px] text-center text-4xl font-bold leading-tight text-gray-800 sm:text-5xl">
        {post.title}
      </h1>

      <div className="mt-5 flex items-center justify-center gap-3 text-gray-600">
        {post.authorImage ? (
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image src={post.authorImage} alt={post.author ?? "author"} fill className="object-cover" />
          </div>
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-gray-700">
            {(post.author ?? "A").slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="leading-tight">
          <p className="text-xl font-medium text-gray-800">{post.author ?? "Author"}</p>
          <p className="text-sm text-gray-500">
            {formatDate(post.publishedAt)}
            {" • "}
            {estimateReadTime(post.body)}
          </p>
        </div>
      </div>

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

      <div className="mx-auto mt-12 max-w-[780px]">
        <Link href="/post" className="text-lg text-blue-600 transition-colors hover:text-blue-700">
          ← View all posts
        </Link>
      </div>
    </article>
  );
}
