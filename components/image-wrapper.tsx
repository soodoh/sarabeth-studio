import { Image as BaseImage } from "@unpic/react/base";
import type { JSX } from "react";
import {
	getImageBreakpoints,
	getImageDimensions,
	transformImageUrl,
} from "@/utils/image";
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
	const { width } = getImageDimensions(image);
	return (
		<BaseImage
			alt={image.description}
			background={image.placeholder}
			breakpoints={getImageBreakpoints(width)}
			className="h-full w-full [background-position:center]"
			height={image.height}
			priority={priority}
			sizes={sizes}
			src={image.url}
			transformer={transformImageUrl}
			width={image.width}
		/>
	);
};

export default ImageWrapper;
