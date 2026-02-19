import NextImage from "next/image";
import React from "react";
import type { ImageType } from "@/utils/types";

type Props = {
  image: ImageType;
  priority?: boolean;
  sizes?: string;
};

const ImageWrapper = ({
  image,
  priority = false,
  sizes = [
    "(max-width: 639px) 100vw",
    "(max-width: 767px) 400px",
    "(max-width: 1023px) 600px",
    "(max-width: 1279px) 800px",
    "400px",
  ].join(", "),
}: Props): JSX.Element => {
  return (
    <NextImage
      alt={image.description}
      className="h-full w-full"
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
