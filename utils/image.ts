import type { CSSProperties } from "react";
import { transform as transformContentfulUrl } from "unpic/providers/contentful";
import type { Operations } from "unpic/types";
import type { ImageType } from "@/utils/types";

const maximumContentfulDimension = 3840;
const responsiveWidths = [
	640, 750, 828, 960, 1080, 1280, 1668, 1920, 2048, 2560, 3200, 3840,
];

type ImageDimensions = Pick<ImageType, "width" | "height">;

export const getImageDimensions = ({ width, height }: ImageDimensions) => {
	if (width <= 0 || height <= 0) {
		throw new Error("Images require positive width and height metadata");
	}

	const scale = Math.min(
		1,
		maximumContentfulDimension / width,
		maximumContentfulDimension / height,
	);

	return {
		width: Math.round(width * scale),
		height: Math.round(height * scale),
		aspectRatio: width / height,
	};
};

export const getImageBreakpoints = (width: number): number[] => {
	const breakpoints = responsiveWidths.filter(
		(responsiveWidth) => responsiveWidth < width,
	);
	return [...breakpoints, width];
};

export const getBlurStyle = (
	placeholder: string,
	backgroundSize: "cover" | "contain" = "cover",
): CSSProperties => ({
	backgroundImage: `url(${placeholder})`,
	backgroundPosition: "center",
	backgroundRepeat: "no-repeat",
	backgroundSize,
});

const parseImageOperation = (
	value: number | string | undefined,
): number | undefined => {
	if (typeof value === "string") {
		return Number.parseInt(value, 10);
	}
	return value;
};

export const transformImageUrl = (
	source: string | URL,
	operations: Operations,
): string => {
	const url = source.toString();
	const requestedWidth = parseImageOperation(operations.width);
	const requestedHeight = parseImageOperation(operations.height);
	const scale = Math.min(
		1,
		requestedWidth
			? maximumContentfulDimension / requestedWidth
			: Number.POSITIVE_INFINITY,
		requestedHeight
			? maximumContentfulDimension / requestedHeight
			: Number.POSITIVE_INFINITY,
	);
	const width = requestedWidth ? Math.round(requestedWidth * scale) : undefined;
	const height = requestedHeight
		? Math.round(requestedHeight * scale)
		: undefined;
	return transformContentfulUrl(url, {
		width,
		height,
		quality: parseImageOperation(operations.quality),
		format: operations.format,
	});
};
