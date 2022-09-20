import NextImage from "next/image";
import React from "react";
import { imageLoader } from "../../utils/client/contentful";
import type { Image } from "../../utils/server/contentful";

type Props = {
  image: Image;
  maxWidth?: number;
  priority?: boolean;
};

const getImageSizes = (maxWidth: number) => {
  const allSizes = [256, 384, 640, 750, 828, 1020, 1200, 1920, 2048, 3840];
  const sizes = allSizes.filter((width) => width <= maxWidth);
  return sizes.reduce((sizeString, width, index) => {
    if (index < sizes.length - 1) {
      return `${sizeString}(max-width: ${width}px) ${width}px, `;
    }
    return `${sizeString}${width}px`;
  }, "");
};

const ImageWrapper = ({ image, maxWidth = 900, priority = false }: Props) => {
  return (
    <NextImage
      layout="responsive"
      placeholder="blur"
      blurDataURL={image.blurDataUrl}
      loader={imageLoader}
      priority={priority}
      alt={image.description}
      src={image.url}
      width={image.width}
      height={image.height}
      sizes={getImageSizes(maxWidth)}
    />
  );
};

export default ImageWrapper;
