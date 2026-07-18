import type { Locator } from "@playwright/test";

export const getContrastRatio = (locator: Locator): Promise<number> =>
	locator.evaluate((element) => {
		type Rgba = readonly [number, number, number, number];

		const canvas = document.createElement("canvas");
		canvas.width = 1;
		canvas.height = 1;
		const context = canvas.getContext("2d", { willReadFrequently: true });
		if (!context) throw new Error("Unable to create a color conversion canvas");

		const parseColor = (color: string): Rgba => {
			if (!CSS.supports("color", color)) {
				throw new Error(`Unsupported CSS color: ${color}`);
			}
			context.clearRect(0, 0, 1, 1);
			context.fillStyle = color;
			context.fillRect(0, 0, 1, 1);
			const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
			return [red, green, blue, alpha / 255];
		};

		const composite = (foreground: Rgba, background: Rgba): Rgba => {
			const alpha = foreground[3] + background[3] * (1 - foreground[3]);
			if (alpha === 0) return [0, 0, 0, 0];
			return [
				(foreground[0] * foreground[3] +
					background[0] * background[3] * (1 - foreground[3])) /
					alpha,
				(foreground[1] * foreground[3] +
					background[1] * background[3] * (1 - foreground[3])) /
					alpha,
				(foreground[2] * foreground[3] +
					background[2] * background[3] * (1 - foreground[3])) /
					alpha,
				alpha,
			];
		};

		const chain: Element[] = [];
		for (
			let current: Element | null = element;
			current;
			current = current.parentElement
		) {
			chain.unshift(current);
		}

		let background: Rgba = [0, 0, 0, 0];
		for (const current of chain) {
			const styles = getComputedStyle(current);
			if (styles.backgroundImage !== "none") {
				throw new Error("Contrast helper does not support background images");
			}
			if (Number(styles.opacity) !== 1) {
				throw new Error("Contrast helper does not support element opacity");
			}
			background = composite(parseColor(styles.backgroundColor), background);
		}
		if (background[3] < 0.999) {
			throw new Error("Contrast helper requires an opaque page background");
		}

		const foreground = composite(
			parseColor(getComputedStyle(element).color),
			background,
		);
		const luminance = (color: Rgba): number => {
			const [red, green, blue] = color.slice(0, 3).map((channel) => {
				const normalized = channel / 255;
				return normalized <= 0.04045
					? normalized / 12.92
					: ((normalized + 0.055) / 1.055) ** 2.4;
			});
			return red * 0.2126 + green * 0.7152 + blue * 0.0722;
		};
		const foregroundLuminance = luminance(foreground);
		const backgroundLuminance = luminance(background);
		return (
			(Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
			(Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
		);
	});
