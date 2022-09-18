import NextImage from "next/image";
import React from "react";
import { imageLoader } from "../../utils/contentful";
import Overlay from "../Overlay";
import type { Image as ImageType } from "../../utils/contentful";

type Props = {
  overlayDirection: "left" | "right";
  image: ImageType;
  priority?: boolean;
};

const StyledImage = ({ overlayDirection, priority, image }: Props) => (
  <Overlay direction={overlayDirection} type="image">
    <NextImage
      loader={imageLoader}
      priority={priority}
      alt={image.description}
      src={image.url}
      layout="responsive"
      width={image.width}
      height={image.height}
    />
  </Overlay>
);

export default StyledImage;
