import NextImage from "next/image";
import React from "react";
import type { Image as ImageType } from "../../utils/contentful";
import Overlay from "../Overlay";

interface Props {
  type: "left" | "right";
  image: ImageType;
  priority?: boolean;
}

const StyledImage = ({ type, priority, image }: Props) => (
  <Overlay type={type}>
    <NextImage
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
