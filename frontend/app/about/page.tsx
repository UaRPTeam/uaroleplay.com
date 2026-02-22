import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";
import type { CSSProperties } from "react";
import { Amatic_SC } from "next/font/google";
import { client } from "../../client";
import ImageGalleryCarousel, { type ImageGalleryCarouselValue } from "../../components/ImageGalleryCarousel";
import PostCustomCard from "../../components/PostCustomCard";
import WaterBubblesBackground from "../../components/WaterBubblesBackground";

export const revalidate = 0;

export const metadata = {
  title: "Що таке ТРІ | UaRP",
  description: "Сторінка, що редагується з Sanity.",
};

type PageImage = {
  _ref?: string;
  _type?: "reference";
  url?: string;
};

type PageBodyImage = {
  _type: "image";
  asset?: PageImage;
  assetUrl?: string;
  alt?: string;
};

type AboutPageDocument = {
  title?: string;
  backgroundImage?: string;
  body?: TypedObject[];
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  postStyle?: "tips" | "catalog" | "about";
  pinToTop?: boolean;
  mainImage?: string;
  body?: Array<{ _type: string; children?: Array<{ text?: string }> }>;
};

type PinnedPostsSettings = {
  aboutPinnedPosts?: Array<{ _ref?: string }>;
};

type PortableTextLikeBlock = TypedObject & {
  _type?: string;
  children?: Array<{ marks?: string[]; text?: string }>;
};

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
      return (
        <p className="mb-6 text-lg leading-9 text-[#0b1b2b]" style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>
          {children}
        </p>
      );
    },
    h1: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return (
        <h1
          className={`${headingFont.className} mb-6 mt-10 text-6xl uppercase leading-[0.9] text-[#081421] sm:text-7xl`}
          style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}
        >
          {children}
        </h1>
      );
    },
    h2: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return (
        <h2
          className={`${headingFont.className} mb-5 mt-9 text-5xl uppercase leading-[0.9] text-[#081421]`}
          style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return (
        <h3
          className={`${headingFont.className} mb-4 mt-8 text-4xl uppercase leading-[0.9] text-[#081421]`}
          style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}
        >
          {children}
        </h3>
      );
    },
    h4: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return (
        <h4
          className="mb-4 mt-7 text-2xl font-bold leading-tight text-[#081421] sm:text-3xl"
          style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}
        >
          {children}
        </h4>
      );
    },
    h5: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return (
        <h5
          className="mb-3 mt-6 text-xl font-semibold leading-tight text-[#081421] sm:text-2xl"
          style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}
        >
          {children}
        </h5>
      );
    },
    h6: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return (
        <h6
          className="mb-3 mt-5 text-lg font-semibold leading-tight text-[#081421] sm:text-xl"
          style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}
        >
          {children}
        </h6>
      );
    },
    blockquote: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[] }> });
      return (
        <blockquote
          className="my-8 border-l-4 border-slate-400 pl-4 text-lg italic leading-8 text-[#0b1b2b]"
          style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}
        >
          {children}
        </blockquote>
      );
    },
  },
  marks: {
    alignLeft: ({ children }) => <>{children}</>,
    alignCenter: ({ children }) => <>{children}</>,
    alignRight: ({ children }) => <>{children}</>,
    highlight: ({ children }) => <mark className="rounded bg-yellow-200 px-1 text-inherit">{children}</mark>,
  },
  types: {
    imageGalleryCarousel: ({ value }) => {
      const carousel = value as ImageGalleryCarouselValue;
      return <ImageGalleryCarousel images={carousel.images} rounded={carousel.rounded !== false} />;
    },
    image: ({ value }) => {
      const imageValue = value as PageBodyImage;
      const imageRef = imageValue?.asset?._ref;
      const imageUrlFromRef = imageRef
        ? imageBuilder
            .image({ _type: "image", asset: { _type: "reference", _ref: imageRef } })
            .width(1400)
            .auto("format")
            .url()
        : null;
      const imageUrl = imageValue?.assetUrl ?? imageValue?.asset?.url ?? imageUrlFromRef;

      if (!imageUrl) return null;

      return (
        <figure className="my-8 overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={imageValue?.alt ?? "Image"} className="h-auto w-full object-cover" />
        </figure>
      );
    },
  },
};

export default async function AboutPage() {
  const [page, pinnedSettings, posts] = await Promise.all([
    client.fetch<AboutPageDocument | null>(groq`
      *[_type == "aboutPage" && _id == "aboutPage"][0]{
        title,
        "backgroundImage": backgroundImage.asset->url,
        body[]{
          ...,
          _type == "image" => {
            ...,
            "assetUrl": asset->url
          }
        }
      }
    `),
    client.fetch<PinnedPostsSettings | null>(groq`
      *[_type == "pinnedPostsSettings" && _id == "pinnedPostsSettings"][0]{
        aboutPinnedPosts
      }
    `),
    client.fetch<Post[]>(groq`
      *[
        _type == "post" &&
        defined(slug.current) &&
        (
          postStyle == "about" ||
          "Що таке ТРІ" in categories[]->title ||
          "що таке трі" in categories[]->title
        )
      ]
        | order(publishedAt desc)
        {
          _id,
          title,
          slug,
          publishedAt,
          postStyle,
          pinToTop,
          "mainImage": mainImage.asset->url,
          body[] {
            ...,
          }
      }
    `),
  ]);

  const pinnedOrder = (pinnedSettings?.aboutPinnedPosts ?? [])
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
  const pageBody = Array.isArray(page?.body) ? page.body : [];
  const bodyWithoutCarousels: TypedObject[] = [];
  const bottomCarouselGroups: Array<{
    leadBlocks: TypedObject[];
    carousel: TypedObject & ImageGalleryCarouselValue;
  }> = [];

  for (const block of pageBody) {
    if (block?._type !== "imageGalleryCarousel") {
      bodyWithoutCarousels.push(block);
      continue;
    }

    const leadBlocks: TypedObject[] = [];
    const lastKept = bodyWithoutCarousels[bodyWithoutCarousels.length - 1] as PortableTextLikeBlock | undefined;
    const lastAlign = getBlockAlign(lastKept);
    const hasVisibleText = Boolean(
      (lastKept?.children ?? []).some((child) => (child?.text ?? "").trim().length > 0),
    );

    if (lastKept?._type === "block" && lastAlign === "center" && hasVisibleText) {
      const movedLead = bodyWithoutCarousels.pop();
      if (movedLead) leadBlocks.push(movedLead);
    }

    bottomCarouselGroups.push({
      leadBlocks,
      carousel: block as TypedObject & ImageGalleryCarouselValue,
    });
  }

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-30 bg-[#d7eaf8]" />
      {page?.backgroundImage ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-20 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('${page.backgroundImage}')` }}
        />
      ) : null}
      <WaterBubblesBackground />
      <main className="about-page relative z-10 py-10 text-[#0b1b2b] sm:py-14">
      <section className="mx-auto w-full max-w-[1100px] px-3 sm:px-4 md:px-6">
        <h1
          className={`${headingFont.className} mb-10 text-center text-6xl uppercase leading-[0.9] text-[#081421] sm:mb-12 sm:text-7xl`}
        >
          {page?.title ?? "Що таке ТРІ"}
        </h1>

        <div className="mx-auto w-full max-w-[1100px]">
          {bodyWithoutCarousels.length ? (
            <PortableText value={bodyWithoutCarousels} components={portableTextComponents} />
          ) : null}
        </div>

        {sortedPosts.length ? (
          <section className="mt-14 border-t border-white/30 pt-10 sm:pt-12">
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
          </section>
        ) : null}

      </section>
      {bottomCarouselGroups.length ? (
        <section className="mt-14 border-t border-white/30 pt-10 sm:pt-12">
          <div className="w-full">
            {bottomCarouselGroups.map((group, index) => (
              <div key={(group.carousel as { _key?: string })._key ?? `about-carousel-${index}`}>
                {group.leadBlocks.length ? (
                  <div className="mx-auto w-full max-w-[1100px]">
                    <PortableText value={group.leadBlocks} components={portableTextComponents} />
                  </div>
                ) : null}
                <ImageGalleryCarousel images={group.carousel.images} rounded={group.carousel.rounded !== false} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
      </main>
    </>
  );
}
