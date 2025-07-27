"use client";

import NextImage from "next/image";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./PhotoCarousel.module.css";
import type { ImageType } from "@/utils/types";

const PhotoCarousel = ({ images }: { images: ImageType[] }) => {
  return (
    <Swiper
      className={styles.carousel}
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
            className={styles.slide}
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
