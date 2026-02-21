import groq from "groq";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import type { CSSProperties } from "react";
import { client } from "../../client";

export const revalidate = 0;

export const metadata = {
  title: "Долучитись | UaRP",
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

type JoinPageDocument = {
  title?: string;
  backgroundImage?: string;
  body?: Array<Record<string, unknown>>;
};

const imageBuilder = imageUrlBuilder(client);

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
        <p className="mb-6 text-lg leading-9 text-gray-900" style={textAlign ? { textAlign, clear: textAlign !== "left" ? "both" : undefined } : undefined}>
          {children}
        </p>
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

export default async function ContactsPage() {
  const page = await client.fetch<JoinPageDocument | null>(groq`
    *[_type == "joinPage" && _id == "joinPage"][0]{
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
  `);

  return (
    <main
      className="bg-[#cfe0ec] py-10 sm:py-14"
      style={
        page?.backgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(207, 224, 236, 0.9), rgba(207, 224, 236, 0.9)), url('${page.backgroundImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <section className="mx-auto w-full max-w-[1100px] px-3 sm:px-4 md:px-6">
        <h1 className="mb-10 text-center text-4xl font-bold text-gray-900 sm:mb-12 sm:text-5xl">
          {page?.title ?? "Долучитись"}
        </h1>

        <div className="mx-auto max-w-[780px]">
          {page?.body?.length ? (
            <PortableText value={page.body} components={portableTextComponents} />
          ) : (
            <p className="text-center text-gray-600">
              Додайте контент у Sanity для сторінки «Долучитись».
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
