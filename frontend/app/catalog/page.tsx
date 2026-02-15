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
  postStyle?: "tips" | "catalog";
  mainImage?: string;
  body?: Array<{ _type?: string; children?: Array<{ text?: string }> }>;
};

const headingFont = Amatic_SC({
  subsets: ["latin"],
  weight: ["700"],
});

export default async function TipsPage() {
  const posts = await client.fetch<Post[]>(groq`
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
        "mainImage": mainImage.asset->url,
        body[] {
          ...,
          children[] {
            text
          }
        }
      }
  `);

  return (
    <main className="bg-[#cfe0ec] py-10 sm:py-14">
      <section className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <h1 className={`${headingFont.className} mb-10 text-center text-6xl uppercase leading-[0.9] text-gray-950 sm:mb-12 sm:text-7xl`}>
          Поради
        </h1>

        {posts.length === 0 ? (
          <p className="text-center text-gray-600">
            У категорії «Поради» поки немає постів.
          </p>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {posts.map((post, index) => {
              const paragraphs =
                post.body
                  ?.filter((block) => block._type === "block")
                  .map((block) =>
                    (block.children ?? [])
                      .map((child) => child.text ?? "")
                      .join(" ")
                      .trim()
                  )
                  .filter(Boolean)
                  .slice(0, 3) ?? [];

              return (
                <PostCustomCard
                  key={post._id}
                  id={post._id}
                  title={post.title}
                  slug={post.slug.current}
                  mainImage={post.mainImage}
                  paragraphs={paragraphs}
                  metaText={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("uk-UA") : undefined}
                  imageSide={index % 2 === 0 ? "right" : "left"}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
