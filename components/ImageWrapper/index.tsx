import NextImage from "next/image";
import React from "react";
import { imageLoader } from "../../utils/client/contentful";
import type { Image } from "../../utils/server/contentful";

type Props = {
  image: Image;
  priority?: boolean;
};

const ImageWrapper = ({ image, priority = false }: Props) => {
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
      sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
    />
  );
};

export default ImageWrapper;
