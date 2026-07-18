import { Image } from "@unpic/react/base";
import { type JSX, useCallback, useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import {
	getBlurStyle,
	getImageBreakpoints,
	getImageDimensions,
	transformImageUrl,
} from "@/utils/image";
import type { ImageType } from "@/utils/types";

export const getGalleryImageAlt = (image: ImageType): string =>
	image.description.trim() ||
	image.title.trim() ||
	"Sarabeth Belón performance";

const CarouselImage = ({
	image,
	priority,
}: {
	image: ImageType;
	priority: boolean;
}): JSX.Element => {
	const { aspectRatio, height, width } = getImageDimensions(image);
	const displayWidth = Math.max(
		1,
		Math.min(width, 1200, Math.round(aspectRatio * 560)),
	);
	const candidateWidth = Math.min(width, displayWidth * 2);
	const breakpoints = [
		...new Set([displayWidth, ...getImageBreakpoints(candidateWidth)]),
	].sort((first, second) => first - second);

	return (
		<div
			className="h-full max-w-full"
			style={{
				...getBlurStyle(image.placeholder, "contain"),
				aspectRatio,
			}}
		>
			<Image
				priority={priority}
				alt={getGalleryImageAlt(image)}
				breakpoints={breakpoints}
				className="h-full w-full object-contain"
				height={height}
				layout="fixed"
				sizes={`(max-width: ${displayWidth}px) 100vw, ${displayWidth}px`}
				src={image.url}
				transformer={transformImageUrl}
				unstyled
				width={width}
			/>
		</div>
	);
};

const PhotoCarousel = ({ images }: { images: ImageType[] }): JSX.Element => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(1);

	const onSelect = useCallback(() => {
		if (!api) {
			return;
		}
		setCurrent(api.selectedScrollSnap() + 1);
	}, [api]);

	useEffect(() => {
		if (!api) {
			return;
		}
		onSelect();
		api.on("select", onSelect);
		return () => {
			api.off("select", onSelect);
		};
	}, [api, onSelect]);

	return (
		<Carousel
			aria-label="Photo gallery"
			className="relative mx-auto my-8 h-[35rem] w-screen max-w-[1200px] bg-black"
			setApi={setApi}
		>
			<CarouselContent className="h-full">
				{images.map((image, index) => (
					<CarouselItem
						key={image.id}
						className="flex items-center justify-center"
						aria-label={`${index + 1} of ${images.length}`}
						aria-hidden={current !== index + 1}
					>
						{Math.abs(index - (current - 1)) <= 1 ? (
							<CarouselImage image={image} priority={index === 0} />
						) : null}
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious
				variant="unstyled"
				size="unstyled"
				className="left-2 text-background"
			/>
			<CarouselNext
				variant="unstyled"
				size="unstyled"
				className="right-2 text-background"
			/>
			<div
				className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-background/80"
				role="status"
				aria-live="polite"
			>
				{current} / {images.length}
			</div>
		</Carousel>
	);
};

export default PhotoCarousel;
