import groq from "groq";
import { client } from "../../client";
import PostCatalogCard from "../../components/PostCatalogCard";

export const revalidate = 0;

export const metadata = {
  title: "Каталог | UaRP Blog",
  description: "Каталог статей та матеріалів від UaRP Blog",
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  hashtags?: Array<string | { category?: string; tags?: string[] }>;
  hashtag?: string;
  author?: string;
  authorImage?: string;
  categories?: string[];
  postStyle?: "tips" | "catalog";
  mainImage?: string;
  body?: Array<{ _type?: string; children?: Array<{ text?: string }> }>;
};

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getPrimaryHashtag(post: Post) {
  if (Array.isArray(post.hashtags)) {
    for (const item of post.hashtags) {
      if (typeof item === "string") {
        const tag = item.trim();
        if (tag) return tag;
        continue;
      }

      if (item && Array.isArray(item.tags)) {
        const tag = item.tags.find((entry) => entry?.trim());
        if (tag) return tag.trim();
      }
    }
  }

  if (post.hashtag?.trim()) {
    return post.hashtag.trim();
  }

  return undefined;
}

function getRatingHashtags(post: Post) {
  if (!Array.isArray(post.hashtags)) return undefined;

  for (const item of post.hashtags) {
    if (
      item &&
      typeof item === "object" &&
      item.category === "rating" &&
      Array.isArray(item.tags)
    ) {
      const tags = item.tags.map((entry) => entry?.trim()).filter(Boolean) as string[];
      if (tags.length) {
        return Array.from(new Set(tags));
      }
    }
  }

  return undefined;
}

export default async function BlogPage() {
  const posts = await client.fetch<Post[]>(groq`
    *[
      _type == "post" &&
      defined(slug.current) &&
      (postStyle == "catalog" || "Каталог" in categories[]->title || "каталог" in categories[]->title)
    ]
      | order(publishedAt desc)
      {
        _id,
        title,
        slug,
        publishedAt,
        hashtags,
        hashtag,
        "author": author->name,
        "authorImage": author->image.asset->url,
        "categories": categories[]->title,
        postStyle,
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
        Каталог
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
              <PostCatalogCard
                key={post._id}
                id={post._id}
                title={post.title}
                slug={post.slug.current}
                categories={post.categories}
                primaryHashtag={getPrimaryHashtag(post)}
                ratingHashtags={getRatingHashtags(post)}
                author={post.author}
                authorImage={post.authorImage}
                mainImage={post.mainImage}
                excerpt={excerpt}
                publishedAtText={formatDate(post.publishedAt)}
                isFeatured={isFeatured}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
