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
      sizes={[
        "(max-width: 399px) 184px",
        "(max-width: 519px) 244px",
        "(max-width: 639px) 200px",
        "(max-width: 767px) 156px",
        "(max-width: 1023px) 220px",
        "(max-width: 1279px) 280px",
        "280px",
      ].join(", ")}
    />
  );
};

export default ImageWrapper;
