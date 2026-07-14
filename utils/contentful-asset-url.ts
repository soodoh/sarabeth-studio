export type ContentfulAssetKind = "asset" | "image";

export const contentfulImageHost = "images.ctfassets.net";
export const contentfulAssetHost = "assets.ctfassets.net";
export const contentfulDownloadHost = "downloads.ctfassets.net";

export const isContentfulFileHost = (hostname: string): boolean =>
	hostname === contentfulAssetHost || hostname === contentfulDownloadHost;

export const validateContentfulAssetUrl = (
	source: string,
	kind: ContentfulAssetKind,
): URL => {
	let url: URL;
	try {
		url = new URL(source);
	} catch {
		throw new Error(`Unsupported Contentful ${kind} URL: ${source}`);
	}
	const allowedHost =
		kind === "image"
			? url.hostname === contentfulImageHost
			: isContentfulFileHost(url.hostname);
	if (
		url.protocol !== "https:" ||
		!allowedHost ||
		url.username !== "" ||
		url.password !== "" ||
		url.port !== ""
	) {
		throw new Error(`Unsupported Contentful ${kind} URL: ${source}`);
	}
	return url;
};
