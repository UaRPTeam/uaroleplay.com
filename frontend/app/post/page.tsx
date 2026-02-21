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
  hashtags?: Array<string | { category?: string; tags?: string[] }>;
  hashtag?: string;
  categories?: string[];
  postStyle?: "tips" | "catalog" | "about";
  pinToTop?: boolean;
  mainImage?: string;
  body?: Array<{ _type?: string; children?: Array<{ text?: string }> }>;
};

type PinnedPostsSettings = {
  catalogPinnedPosts?: Array<{ _ref?: string }>;
};

type CatalogHashtag = {
  tag: string;
  categoryKey: string;
};

function getCatalogHashtags(post: Post) {
  const collected: Array<CatalogHashtag & { priority: number; order: number }> = [];
  let order = 0;

  const addTag = (value: string | undefined, categoryKey: string, priority: number) => {
    const tag = value?.trim();
    if (!tag) return;
    collected.push({ tag, categoryKey, priority, order });
    order += 1;
  };

  if (Array.isArray(post.hashtags)) {
    for (const item of post.hashtags) {
      if (typeof item === "string") {
        addTag(item, "default", 1);
        continue;
      }

      if (item && Array.isArray(item.tags)) {
        const categoryKey = item.category ?? "default";
        const priority = categoryKey === "required" ? 0 : 1;
        item.tags.forEach((tag) => addTag(tag, categoryKey, priority));
      }
    }
  }

  addTag(post.hashtag, "default", 1);

  const bestByTag = new Map<string, CatalogHashtag & { priority: number; order: number }>();
  collected.forEach((entry) => {
    const existing = bestByTag.get(entry.tag);
    if (!existing || entry.priority < existing.priority || (entry.priority === existing.priority && entry.order < existing.order)) {
      bestByTag.set(entry.tag, entry);
    }
  });

  return Array.from(bestByTag.values())
    .sort((a, b) => a.priority - b.priority || a.order - b.order)
    .map(({ tag, categoryKey }) => ({ tag, categoryKey }));
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
  const [pinnedSettings, posts] = await Promise.all([
    client.fetch<PinnedPostsSettings | null>(groq`
      *[_type == "pinnedPostsSettings" && _id == "pinnedPostsSettings"][0]{
        catalogPinnedPosts
      }
    `),
    client.fetch<Post[]>(groq`
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
          hashtags,
          hashtag,
          "categories": categories[]->title,
          postStyle,
          pinToTop,
          "mainImage": mainImage.asset->url,
          body[] {
            ...,
            children[]{
              text
            }
          }
        }
    `),
  ]);

  const pinnedOrder = (pinnedSettings?.catalogPinnedPosts ?? [])
    .map((item) => item?._ref)
    .filter((id): id is string => Boolean(id));
  const postsById = new Map(posts.map((post) => [post._id, post]));
  const orderedPinnedPosts = pinnedOrder
    .map((id) => postsById.get(id))
    .filter((post): post is Post => Boolean(post && post.pinToTop));
  const orderedPinnedIds = new Set(orderedPinnedPosts.map((post) => post._id));
  const remainingPinnedPosts = posts.filter((post) => post.pinToTop && !orderedPinnedIds.has(post._id));
  const regularPosts = posts.filter((post) => !post.pinToTop);
  const sortedPosts = [...orderedPinnedPosts, ...remainingPinnedPosts, ...regularPosts];

  return (
    <main className="max-w-[1440px] mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-12 py-8 md:py-10">
      <h1 className="mb-10 text-center text-4xl font-bold text-gray-900">
        Каталог
      </h1>

      {sortedPosts.length === 0 ? (
        <p className="text-center text-gray-500">No posts published yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-12">
          {sortedPosts.map((post, index) => {
            const isFeatured = index < 2;
            const excerptLimit = isFeatured ? 240 : 140;
            const excerpt =
              post.body
                ?.filter((block) => block._type === "block")
                .map((block) =>
                  (block.children ?? []).map((child) => child.text ?? "").join(" ")
                )
                .join(" ")
                .slice(0, excerptLimit) || "";

            return (
              <PostCatalogCard
                key={post._id}
                id={post._id}
                title={post.title}
                slug={post.slug.current}
                categories={post.categories}
                hashtags={getCatalogHashtags(post)}
                ratingHashtags={getRatingHashtags(post)}
                mainImage={post.mainImage}
                excerpt={excerpt}
                isFeatured={isFeatured}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
