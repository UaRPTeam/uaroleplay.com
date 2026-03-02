import groq from "groq";
import { unstable_cache } from "next/cache";
import type { TypedObject } from "@portabletext/types";
import { client } from "../client";
import type { FaqSectionValue } from "../components/FaqSection";

export type HomePageDocument = {
  body?: TypedObject[];
};

export type TipsPageFaqDocument = {
  faq?: FaqSectionValue | null;
};

export const getHomePageSingleton = unstable_cache(
  async () =>
    client.fetch<HomePageDocument | null>(groq`
      *[_type == "homePage" && _id == "homePage"][0]{
        body[]{
          ...,
          _type == "tilesSection" => {
            ...,
            items[]{
              ...,
              "imageUrl": image.asset->url
            }
          }
        }
      }
    `),
  ["home-page-singleton"],
  { revalidate: 300 },
);

export const getTipsPageFaqSingleton = unstable_cache(
  async () =>
    client.fetch<TipsPageFaqDocument | null>(groq`
      *[_type == "tipsPage" && _id == "tipsPage"][0]{
        faq{
          title,
          items[]{
            ...,
            "imageUrl": image.asset->url
          }
        }
      }
    `),
  ["tips-page-faq-singleton"],
  { revalidate: 300 },
);
