"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import NextImage from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { ImageType } from "@/utils/types";

const PhotoCarousel = ({ images }: { images: ImageType[] }): JSX.Element => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);

  const onSelect = useCallback(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <Carousel
      className="relative mx-auto my-8 h-[35rem] w-screen max-w-[1200px] bg-black"
      setApi={setApi}
    >
      <CarouselContent className="h-full">
        {images.map((image, index) => (
          <CarouselItem
            key={image.id}
            className="flex items-center justify-center"
          >
            <NextImage
              priority={index < 2}
              alt={image.description}
              blurDataURL={image.placeholder}
              className="h-full w-auto object-contain"
              height={image.height}
              placeholder="blur"
              sizes="100vw"
              src={image.url}
              width={image.width}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        variant="unstyled"
        size="unstyled"
        className="left-2 text-background"
      />
      <CarouselNext
        variant="unstyled"
        size="unstyled"
        className="right-2 text-background"
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-background/80">
        {current} / {images.length}
      </div>
    </Carousel>
  );
};

export default PhotoCarousel;
