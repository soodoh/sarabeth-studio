import React from "react";
import ImageWrapper from "../../components/ImageWrapper";
import Overlay from "../Overlay";
import type { Image as ImageType } from "../../utils/server/contentful";

type Props = {
  overlayDirection: "left" | "right";
  image: ImageType;
  maxWidth?: number;
  priority?: boolean;
};

const StyledImage = ({
  overlayDirection,
  priority,
  maxWidth,
  image,
}: Props) => (
  <Overlay direction={overlayDirection} type="image">
    <ImageWrapper image={image} maxWidth={maxWidth} priority={priority} />
  </Overlay>
);

export default StyledImage;
