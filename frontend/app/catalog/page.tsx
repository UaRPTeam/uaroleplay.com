import groq from "groq";
import { unstable_cache } from "next/cache";
import { client } from "../../client";
import PostCatalogCard from "../../components/PostCatalogCard";

export const revalidate = 300;

export const metadata = {
  title: "Каталог | UaRP Blog",
  description: "Каталог статей та матеріалів від UaRP Blog",
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  body?: Array<{
    _type?: string;
    style?: string;
    children?: Array<{ _type?: string; text?: string }>;
  }>;
  hashtags?: Array<string | { category?: string; tags?: string[] }>;
  hashtag?: string;
  categories?: string[];
  postStyle?: "tips" | "catalog" | "about";
  pinToTop?: boolean;
  mainImage?: string;
};

type PinnedPostsSettings = {
  catalogPinnedPosts?: Array<{ _ref?: string }>;
};

type CatalogHashtag = {
  tag: string;
  categoryKey: string;
};

type PostBodyBlock = NonNullable<Post["body"]>[number];

const getCatalogPageData = unstable_cache(
  async () =>
    client.fetch<{ pinnedSettings: PinnedPostsSettings | null; posts: Post[] }>(groq`
      {
        "pinnedSettings": *[_type == "pinnedPostsSettings" && _id == "pinnedPostsSettings"][0]{
          catalogPinnedPosts
        },
        "posts": *[
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
            }
          }
      }
    `),
  ["catalog-page-data"],
  { revalidate: 300 },
);

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

function getPostExcerpt(post: Post) {
  const blocks = Array.isArray(post.body) ? post.body : [];
  if (!blocks.length) return "";

  const blockToText = (block: PostBodyBlock) =>
    (block?.children ?? [])
      .map((child) => child?.text ?? "")
      .filter((text) => text.trim().length > 0)
      .join("")
      .trim();

  const normalText = blocks
    .filter((block) => block?._type === "block" && block?.style === "normal")
    .map(blockToText)
    .find((text) => text.length > 0);
  if (normalText) return normalText;

  const firstNonEmpty = blocks.map(blockToText).find((text) => text.length > 0);
  return firstNonEmpty ?? "";
}

export default async function BlogPage() {
  const data = await getCatalogPageData();
  const pinnedSettings = data?.pinnedSettings ?? null;
  const posts = data?.posts ?? [];

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
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/vecteezy_rainbow_pastel_blurred_background.svg')" }}
      />
      <main className="relative z-10 max-w-[1440px] mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-12 py-8 md:py-10">
        <h1 className="mb-10 text-center text-6xl uppercase leading-[0.9] text-gray-900 sm:mb-12 sm:text-7xl">
          Каталог
        </h1>

        {sortedPosts.length === 0 ? (
          <p className="text-center text-gray-500">No posts published yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-12">
            {sortedPosts.map((post, index) => {
              const isFeatured = index < 2;
              const excerpt = getPostExcerpt(post);

              return (
                <PostCatalogCard
                  key={post._id}
                  id={post._id}
                  title={post.title}
                  slug={post.slug.current}
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
    </>
  );
}
