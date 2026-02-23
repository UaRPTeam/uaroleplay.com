"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import useEmblaCarousel from "embla-carousel-react";
import { client } from "../client";

type CarouselImageAsset = {
  _ref?: string;
  _type?: "reference";
  url?: string;
};

export type ImageGalleryCarouselItem = {
  _key?: string;
  alt?: string;
  asset?: CarouselImageAsset;
  imageUrl?: string;
};

export type ImageGalleryCarouselValue = {
  _type?: "imageGalleryCarousel";
  images?: ImageGalleryCarouselItem[];
  rounded?: boolean;
};

type Props = {
  images?: ImageGalleryCarouselItem[];
  rounded?: boolean;
  className?: string;
};

const imageBuilder = imageUrlBuilder(client);

function getImageUrl(image: ImageGalleryCarouselItem) {
  if (image.imageUrl) return image.imageUrl;
  if (image.asset?.url) return image.asset.url;
  if (!image.asset?._ref) return null;
  return imageBuilder
    .image({ _type: "image", asset: { _type: "reference", _ref: image.asset._ref } })
    .width(1400)
    .auto("format")
    .url();
}

export default function ImageGalleryCarousel({ images, rounded = true, className }: Props) {
  const items = useMemo(
    () =>
      (images ?? [])
        .map((image) => ({ image, url: getImageUrl(image) }))
        .filter((item): item is { image: ImageGalleryCarouselItem; url: string } => Boolean(item.url)),
    [images],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: items.length > 1,
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [snapCount, setSnapCount] = useState(0);

  const syncEmblaState = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSnapCount(emblaApi.scrollSnapList().length);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onReInit = () => syncEmblaState();
    const rafId = window.requestAnimationFrame(syncEmblaState);

    emblaApi.on("select", syncEmblaState);
    emblaApi.on("reInit", onReInit);

    return () => {
      window.cancelAnimationFrame(rafId);
      emblaApi.off("select", syncEmblaState);
      emblaApi.off("reInit", onReInit);
    };
  }, [emblaApi, syncEmblaState]);

  if (!items.length) return null;

  const itemRadius = rounded ? "rounded-xl" : "rounded-none";

  return (
    <section className={`my-6 w-full ${className ?? ""}`.trim()}>
      <div className="relative overflow-visible">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
              {items.map(({ image, url }, index) => (
                <div
                  key={image._key ?? `${index}-${url}`}
                  className="min-w-0 flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.3333%]"
                >
                  <div
                    className={`relative min-h-[420px] overflow-hidden sm:min-h-[500px] md:min-h-[560px] lg:min-h-[620px] ${itemRadius}`}
                  >
                    <Image
                      src={url}
                      alt={image.alt?.trim() || `Slide ${index + 1}`}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {items.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Попередні зображення"
              disabled={!canScrollPrev}
              className="absolute -left-5 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/55 bg-white/55 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-sm transition hover:bg-white/70 disabled:opacity-50"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Наступні зображення"
              disabled={!canScrollNext}
              className="absolute -right-5 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/55 bg-white/55 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-sm transition hover:bg-white/70 disabled:opacity-50"
            >
              →
            </button>
          </>
        ) : null}
      </div>

      {snapCount > 1 ? (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: snapCount }).map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Перейти до групи ${index + 1}`}
              aria-pressed={selectedIndex === index}
              className={`h-2.5 w-2.5 rounded-full transition ${
                selectedIndex === index ? "bg-[#0b1b2b]" : "bg-[#0b1b2b]/25 hover:bg-[#0b1b2b]/45"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
