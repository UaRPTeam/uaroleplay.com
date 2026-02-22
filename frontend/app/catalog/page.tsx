import groq from "groq";
import { Amatic_SC } from "next/font/google";
import { client } from "../../client";
import PostCustomCard from "../../components/PostCustomCard";

export const revalidate = 0;

export const metadata = {
  title: "Поради | UaRP Blog",
  description: "Пости з категорії Поради.",
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  categories?: string[];
  postStyle?: "tips" | "catalog" | "about";
  pinToTop?: boolean;
  mainImage?: string;
  body?: Array<{ _type: string; children?: Array<{ text?: string }> }>;
};

type PinnedPostsSettings = {
  tipsPinnedPosts?: Array<{ _ref?: string }>;
};

const headingFont = Amatic_SC({
  subsets: ["latin"],
  weight: ["700"],
});

export default async function TipsPage() {
  const [pinnedSettings, posts] = await Promise.all([
    client.fetch<PinnedPostsSettings | null>(groq`
      *[_type == "pinnedPostsSettings" && _id == "pinnedPostsSettings"][0]{
        tipsPinnedPosts
      }
    `),
    client.fetch<Post[]>(groq`
      *[
              _type == "post" &&
        defined(slug.current) &&
        (postStyle == "tips" || "Поради" in categories[]->title || "поради" in categories[]->title)
      ]
        | order(publishedAt desc)
        {
          _id,
          title,
          slug,
          publishedAt,
          "categories": categories[]->title,
          postStyle,
          pinToTop,
          "mainImage": mainImage.asset->url,
              body[] {
                ...
              }
            }
    `),
  ]);

  const pinnedOrder = (pinnedSettings?.tipsPinnedPosts ?? [])
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
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-30 bg-[#cfe0ec]" />
      <main className="relative z-10 py-10 sm:py-14">
        <section className="mx-auto w-full max-w-[1100px] px-3 sm:px-4 md:px-6">
        <h1 className={`${headingFont.className} mb-10 text-center text-6xl uppercase leading-[0.9] text-gray-950 sm:mb-12 sm:text-7xl`}>
          Поради
        </h1>

        {sortedPosts.length === 0 ? (
          <p className="text-center text-gray-600">
            У категорії «Поради» поки немає постів.
          </p>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {sortedPosts.map((post) => {
              return (
                <PostCustomCard
                  key={post._id}
                  id={post._id}
                  title={post.title}
                  slug={post.slug.current}
                  mainImage={post.mainImage}
                  body={post.body}
                  metaText={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("uk-UA") : undefined}
                />
              );
            })}
          </div>
        )}
        </section>
      </main>
    </>
  );
}
