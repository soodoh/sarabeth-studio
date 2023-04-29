import NextImage from "next/image";
import React from "react";
import styles from "./ImageWrapper.module.scss";
import { imageLoader } from "../../utils/client/contentful";
import type { Image } from "../../utils/types";

type Props = {
  image: Image;
  priority?: boolean;
};

const ImageWrapper = ({ image, priority = false }: Props) => {
  const sizes = [
    "(max-width: 399px) 184px",
    "(max-width: 519px) 244px",
    "(max-width: 639px) 200px",
    "(max-width: 767px) 156px",
    "(max-width: 1023px) 220px",
    "(max-width: 1279px) 280px",
    "280px",
  ].join(", ");
  return (
    <NextImage
      alt={image.description}
      className={styles.image}
      blurDataURL={image.blurDataUrl}
      height={image.height}
      loader={imageLoader}
      placeholder="blur"
      priority={priority}
      sizes={sizes}
      src={image.url}
      width={image.width}
    />
  );
};

export default ImageWrapper;
