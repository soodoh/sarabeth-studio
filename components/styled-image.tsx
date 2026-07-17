import type { JSX } from "react";
import ImageWrapper from "@/components/image-wrapper";
import OffsetShadow from "@/components/offset-shadow";
import type { ImageType } from "@/utils/types";

type Props = {
	overlayDirection: "left" | "right";
	image: ImageType;
	priority?: boolean;
	sizes?: string;
};

const StyledImage = ({
	overlayDirection,
	priority,
	image,
	sizes,
}: Props): JSX.Element => (
	<OffsetShadow direction={overlayDirection} type="image">
		<ImageWrapper image={image} priority={priority} sizes={sizes} />
	</OffsetShadow>
);

export default StyledImage;
