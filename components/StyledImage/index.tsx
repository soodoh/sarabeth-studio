import ImageWrapper from "@/components/ImageWrapper";
import OffsetShadow from "@/components/OffsetShadow";
import React from "react";
import type { ImageType } from "@/utils/types";

type Props = {
  overlayDirection: "left" | "right";
  image: ImageType;
  priority?: boolean;
};

const StyledImage = ({ overlayDirection, priority, image }: Props) => (
  <OffsetShadow direction={overlayDirection} type="image">
    <ImageWrapper image={image} priority={priority} />
  </OffsetShadow>
);

export default StyledImage;
