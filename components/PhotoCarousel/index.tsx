"use client";

import NextImage from "next/image";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { ImageType } from "@/utils/types";

const PhotoCarousel = ({ images }: { images: ImageType[] }) => {
  return (
    <Swiper
      className="relative mx-auto my-8 h-[35rem] w-screen max-w-[1200px] bg-black px-[2.5rem]"
      modules={[Navigation]}
      navigation
      slidesPerView="auto"
    >
      {images.map((image, index) => (
        <SwiperSlide key={image.id}>
          <NextImage
            priority={index < 2}
            alt={image.description}
            blurDataURL={image.placeholder}
            className="h-full w-auto"
            height={image.height}
            placeholder="blur"
            sizes="50vw"
            src={image.url}
            width={image.width}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default PhotoCarousel;
