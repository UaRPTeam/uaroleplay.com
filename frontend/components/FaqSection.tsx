import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";

export type FaqItem = {
  _key?: string;
  question?: string;
  answer?: TypedObject[];
  imageUrl?: string;
  imagePosition?: "top" | "bottom" | "left" | "right";
};

export type FaqSectionValue = {
  title?: string;
  items?: FaqItem[];
};

type Props = {
  value?: FaqSectionValue | null;
};

function FaqItemImage({ item }: { item: FaqItem }) {
  if (!item.imageUrl) return null;

  const isSide = item.imagePosition === "left" || item.imagePosition === "right";
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-white/35 ${
        isSide ? "h-28 w-28 sm:h-32 sm:w-32" : "mb-4 h-44 w-full sm:h-56"
      }`}
    >
      <Image
        src={item.imageUrl}
        alt={item.question?.trim() || "FAQ image"}
        fill
        sizes={isSide ? "128px" : "(max-width: 640px) 100vw, 720px"}
        className="object-contain"
      />
    </div>
  );
}

export default function FaqSection({ value }: Props) {
  const items = (value?.items ?? []).filter((item) => item?.question || (item?.answer?.length ?? 0) > 0);
  if (!items.length) return null;

  return (
    <section className="mt-10 sm:mt-12">
      <div className="mx-auto max-w-[1100px]">
        {value?.title ? (
          <h2 className="mb-5 text-2xl font-extrabold text-gray-950 sm:text-3xl">{value.title}</h2>
        ) : null}

        <div className="space-y-4">
          {items.map((item, index) => {
            const position = item.imagePosition ?? "top";
            const isSide = position === "left" || position === "right";

            return (
              <details
                key={item._key ?? `faq-${index}`}
                className="group rounded-2xl bg-white/45 p-4 backdrop-blur-sm open:bg-white/60 sm:p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                  <span>{item.question ?? "Питання"}</span>
                  <span className="text-lg leading-none text-slate-600 transition group-open:rotate-45">+</span>
                </summary>

                <div className="mt-4 text-slate-700">
                  {!isSide && position === "top" ? <FaqItemImage item={item} /> : null}

                  {isSide ? (
                    <div className={`flex flex-col gap-4 sm:flex-row ${position === "right" ? "sm:flex-row-reverse" : ""}`}>
                      <FaqItemImage item={item} />
                      <div className="min-w-0 flex-1">
                        {item.answer?.length ? (
                          <div className="portable-richtext text-sm leading-7 sm:text-base">
                            <PortableText value={item.answer} />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <>
                      {item.answer?.length ? (
                        <div className="portable-richtext text-sm leading-7 sm:text-base">
                          <PortableText value={item.answer} />
                        </div>
                      ) : null}
                      {position === "bottom" ? <FaqItemImage item={item} /> : null}
                    </>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
