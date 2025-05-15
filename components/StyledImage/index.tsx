import ImageWrapper from "@/components/ImageWrapper";
import Overlay from "@/components/Overlay";
import React from "react";
import type { ImageType } from "@/utils/types";

type Props = {
  overlayDirection: "left" | "right";
  image: ImageType;
  priority?: boolean;
};

const StyledImage = ({ overlayDirection, priority, image }: Props) => (
  <Overlay direction={overlayDirection} type="image">
    <ImageWrapper image={image} priority={priority} />
  </Overlay>
);

export default StyledImage;
