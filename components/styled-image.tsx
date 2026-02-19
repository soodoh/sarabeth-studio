import ImageWrapper from "@/components/image-wrapper";
import OffsetShadow from "@/components/offset-shadow";
import React from "react";
import type { ImageType } from "@/utils/types";

type Props = {
  overlayDirection: "left" | "right";
  image: ImageType;
  priority?: boolean;
};

const StyledImage = ({
  overlayDirection,
  priority,
  image,
}: Props): JSX.Element => (
  <OffsetShadow direction={overlayDirection} type="image">
    <ImageWrapper image={image} priority={priority} sizes="100vw" />
  </OffsetShadow>
);

export default StyledImage;
