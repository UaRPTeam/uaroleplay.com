import groq from "groq";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";
import type { CSSProperties } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { client } from "../client";
import CtaTilesSection, { type TilesSectionValue } from "../components/CtaTilesSection";

const heroHeadingFont = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700"],
});

const heroBodyFont = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

type HomePageDocument = {
  body?: TypedObject[];
};

const getBlockAlign = (value: { children?: Array<{ marks?: string[]; text?: string }> } | undefined): CSSProperties["textAlign"] | undefined => {
  const children = (value?.children ?? []).filter((child) => (child?.text ?? "").trim().length > 0);
  if (!children.length) return undefined;

  const hasMark = (mark: string) => children.every((child) => Array.isArray(child.marks) && child.marks.includes(mark));
  if (hasMark("alignRight")) return "right";
  if (hasMark("alignCenter")) return "center";
  if (hasMark("alignLeft")) return "left";
  return undefined;
};

const homeBodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[]; text?: string }> });
      return (
        <p className={`${heroBodyFont.className} mb-4 text-base font-medium leading-relaxed text-slate-700 sm:text-lg`} style={textAlign ? { textAlign } : undefined}>
          {children}
        </p>
      );
    },
    h2: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[]; text?: string }> });
      return (
        <h2 className={`${heroHeadingFont.className} mb-4 text-3xl font-bold text-slate-950 sm:text-4xl`} style={textAlign ? { textAlign } : undefined}>
          {children}
        </h2>
      );
    },
    h3: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[]; text?: string }> });
      return (
        <h3 className={`${heroHeadingFont.className} mb-4 text-2xl font-bold text-slate-950 sm:text-3xl`} style={textAlign ? { textAlign } : undefined}>
          {children}
        </h3>
      );
    },
    h4: ({ children, value }) => {
      const textAlign = getBlockAlign(value as { children?: Array<{ marks?: string[]; text?: string }> });
      return (
        <h4 className={`${heroBodyFont.className} mb-4 text-2xl font-extrabold text-slate-950 sm:text-3xl`} style={textAlign ? { textAlign } : undefined}>
          {children}
        </h4>
      );
    },
  },
  marks: {
    alignLeft: ({ children }) => <>{children}</>,
    alignCenter: ({ children }) => <>{children}</>,
    alignRight: ({ children }) => <>{children}</>,
  },
  types: {
    tilesSection: ({ value }) => <CtaTilesSection value={value as TilesSectionValue} />,
  },
};

export default async function Home() {
  const page = await client.fetch<HomePageDocument | null>(groq`
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
  `);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/vecteezy_rainbow_pastel_blurred_background.svg')" }}
      />

      <section className="relative min-h-[70vh] w-full overflow-hidden rounded-none bg-transparent md:rounded-3xl">
        <div className="relative z-10 flex min-h-[70vh] items-center justify-center px-6 py-10 text-center sm:px-10 sm:py-14">
          <div className="-translate-y-8 max-w-xl sm:-translate-y-10">
            <p
              className={`${heroBodyFont.className} -mt-6 mb-3 text-xs uppercase tracking-[0.24em] text-slate-600 sm:-mt-8 sm:text-sm`}
            >
              Нумо розвивати простір українськомовних ролівок разом
            </p>
            <h1
              className={`${heroHeadingFont.className} mb-4 text-4xl font-bold leading-[0.95] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl`}
            >
              UaRP — пошук рольових і співролів
            </h1>
            <p
              className={`${heroBodyFont.className} mt-8 mb-6 max-w-xl text-base font-medium leading-relaxed text-slate-700 sm:mt-10 sm:text-lg`}
            >
              Текстові рольові ігри українською: місце, де можна знайти гру під
              настрій, знайти співролів і поділитися власним всесвітом.
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-6 flex flex-col items-stretch gap-3 px-4 sm:bottom-8 sm:flex-row sm:items-end sm:justify-between sm:px-10">
            <Link
              href="/tips"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Читати гіди та статті
            </Link>
          </div>
        </div>
      </section>

      {page?.body?.length ? (
        <section className="relative z-10 mt-4 pb-8 sm:pb-10">
          <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-4 md:px-6 lg:px-12">
            <PortableText value={page.body} components={homeBodyComponents} />
          </div>
        </section>
      ) : null}
    </>
  );
}
