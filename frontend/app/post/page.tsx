import Link from "next/link";
import Image from "next/image";
import groq from "groq";
import { client } from "../../client";

export const metadata = {
  title: "Наші поради | UaRP Blog",
  description: "Корисні поради та статті від UaRP Blog",
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  author?: string;
  authorImage?: string;
  categories?: string[];
  mainImage?: string;
  body?: Array<{ _type?: string; children?: Array<{ text?: string }> }>;
};

const categoryColors = [
  "text-blue-600",
  "text-fuchsia-600",
  "text-emerald-700",
  "text-orange-600",
];

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await client.fetch<Post[]>(groq`
    *[_type == "post" && defined(slug.current)]
      | order(publishedAt desc)
      {
        _id,
        title,
        slug,
        publishedAt,
        "author": author->name,
        "authorImage": author->image.asset->url,
        "categories": categories[]->title,
        "mainImage": mainImage.asset->url,
        body[] {
          ...,
          children[]{
            text
          }
        }
      }
  `);

  return (
    <main className="max-w-[1440px] mx-auto px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-10 text-center text-4xl font-bold text-gray-900">
        Наші поради
      </h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts published yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-12">
          {posts.map((post, index) => {
            const isFeatured = index < 2;
            const excerpt =
              post.body
                ?.filter((block) => block._type === "block")
                .map((block) =>
                  (block.children ?? []).map((child) => child.text ?? "").join(" ")
                )
                .join(" ")
                .slice(0, 140) || "";

            return (
              <article
                key={post._id}
                className={`${
                  isFeatured ? "lg:col-span-6" : "lg:col-span-4"
                }`}
              >
                <Link
                  href={`/post/${post.slug.current}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col"
                >
                  {post.mainImage && (
                    <div
                      className={`relative block w-full overflow-hidden rounded-lg ${
                        isFeatured ? "h-64 sm:h-72 lg:h-96" : "h-72 sm:h-80 lg:h-[430px]"
                      }`}
                    >
                      <Image
                        src={post.mainImage}
                        alt={post.title}
                        fill
                        sizes={
                          isFeatured
                            ? "(max-width: 1024px) 100vw, 700px"
                            : "(max-width: 1024px) 100vw, 450px"
                        }
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  )}

                  <div className="mt-5 flex flex-col">
                    {post.categories?.length ? (
                      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        {post.categories.slice(0, 2).map((cat, i) => (
                          <span
                            key={`${post._id}-cat-${cat}`}
                            className={`text-xs font-semibold uppercase tracking-[0.08em] ${
                              categoryColors[i % categoryColors.length]
                            }`}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <h2 className="min-h-[60px] text-[24px] font-bold leading-tight text-gray-800 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                      {post.title}
                    </h2>

                    {excerpt && (
                      <p className="mt-4 text-lg leading-relaxed text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">
                        {excerpt}
                      </p>
                    )}

                    <div className="mt-5 flex items-center gap-3 text-sm text-gray-500">
                      {post.authorImage ? (
                        <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={post.authorImage}
                            alt={post.author ?? "author"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-300 text-[10px] font-semibold text-gray-700">
                          {(post.author ?? "A").slice(0, 1).toUpperCase()}
                        </span>
                      )}
                      <span className="font-medium text-gray-600">
                        {post.author ?? "Author"}
                      </span>
                      {post.publishedAt ? (
                        <>
                          <span className="text-gray-400">•</span>
                          <span>{formatDate(post.publishedAt)}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
