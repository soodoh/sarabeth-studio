import { expect, test } from "@playwright/test";
import { getGalleryImageAlt } from "@/components/photo-carousel";
import type { ImageType } from "@/utils/types";

const image = {
	id: "image",
	title: "Flight performance",
	description: "",
	url: "https://images.ctfassets.net/example/image.jpg",
	width: 1200,
	height: 800,
	placeholder:
		"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
} satisfies ImageType;

test("uses the gallery image title when its Contentful description is empty", () => {
	expect(getGalleryImageAlt(image)).toBe("Flight performance");
});

test("prefers the authored gallery image description", () => {
	expect(
		getGalleryImageAlt({
			...image,
			description: "Sarabeth performing on stage",
		}),
	).toBe("Sarabeth performing on stage");
});
