import type { BrowserContext } from "@playwright/test";
import youtubePlaylistJson from "@/tests/fixtures/youtube-playlist.json" with {
	type: "json",
};
import { decodeYouTubePlaylist } from "@/utils/youtube-playlist-data";

export const youtubePlaylistFixture = decodeYouTubePlaylist(
	youtubePlaylistJson,
	"youtubePlaylistFixture",
);

export const installYouTubePlaylistRoute = async (
	context: BrowserContext,
): Promise<void> => {
	await context.route("**/api/youtube-playlist", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify(youtubePlaylistFixture),
		});
	});
	await context.route("https://i.ytimg.com/**", async (route) => {
		await route.fulfill({
			body: '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#1e1d1d"/></svg>',
			contentType: "image/svg+xml",
		});
	});
	await context.route("https://www.youtube-nocookie.com/**", async (route) => {
		await route.fulfill({ body: "", contentType: "text/html" });
	});
};
