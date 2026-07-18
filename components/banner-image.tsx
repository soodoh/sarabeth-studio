import { Image } from "@unpic/react/base";
import type { JSX } from "react";
import OffsetShadow from "@/components/offset-shadow";
import {
	getImageBreakpoints,
	getImageDimensions,
	transformImageUrl,
} from "@/utils/image";
import type { ImageType } from "@/utils/types";

type Props = {
	image: ImageType;
	title: string;
};

const BannerImage = ({ title, image }: Props): JSX.Element => {
	const { aspectRatio, width } = getImageDimensions(image);

	return (
		<div className="relative flex h-[500px] w-full items-center justify-center bg-foreground bg-cover bg-center">
			<Image
				alt={image.description}
				aspectRatio={aspectRatio}
				background={image.placeholder}
				breakpoints={getImageBreakpoints(width)}
				className="absolute inset-0 z-0 h-full w-full [background-position:center]"
				layout="fullWidth"
				objectFit="cover"
				priority
				sizes="100vw"
				src={image.url}
				transformer={transformImageUrl}
			/>
			<OffsetShadow type="bannerTitle" direction="left">
				<h1 className="m-0 bg-accent px-20 py-6 font-sans text-[1.7rem] font-thin uppercase tracking-wide text-background-light max-sm:bg-accent-dark max-sm:text-base">
					{title}
				</h1>
			</OffsetShadow>
		</div>
	);
};

export default BannerImage;
