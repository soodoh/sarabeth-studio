import NextImage from "next/image";
import React from "react";
import styles from "./ImageWrapper.module.css";
import type { ImageType } from "@/utils/types";

type Props = {
  image: ImageType;
  priority?: boolean;
};

const ImageWrapper = ({ image, priority = false }: Props) => {
  const sizes = [
    "(max-width: 639px) 100vw",
    "(max-width: 767px) 400px",
    "(max-width: 1023px) 600px",
    "(max-width: 1279px) 800px",
    "400px",
  ].join(", ");
  return (
    <NextImage
      alt={image.description}
      className={styles.image}
      blurDataURL={image.placeholder}
      height={image.height}
      placeholder="blur"
      priority={priority}
      sizes={sizes}
      src={image.url}
      width={image.width}
    />
  );
};

export default ImageWrapper;
