import { createFileRoute } from "@tanstack/react-router";
import {
	handleYouTubePlaylistRequest,
	type YouTubePlaylistDependencies,
	youtubePlaylistErrorCacheControl,
} from "@/utils/youtube-playlist.server";

export const getYouTubePlaylistRequest = (
	{ request }: { request: Request },
	dependencies?: YouTubePlaylistDependencies,
) => {
	if (new URL(request.url).search) {
		return Response.json(
			{ error: "Query parameters are not supported" },
			{
				status: 400,
				headers: { "Cache-Control": youtubePlaylistErrorCacheControl },
			},
		);
	}
	return handleYouTubePlaylistRequest(dependencies);
};

export const methodNotAllowedRequest = () =>
	Response.json(
		{ error: "Method not allowed" },
		{
			status: 405,
			headers: { Allow: "GET", "Cache-Control": "no-store" },
		},
	);

export const Route = createFileRoute("/api/youtube-playlist")({
	server: {
		handlers: {
			GET: getYouTubePlaylistRequest,
			ANY: methodNotAllowedRequest,
		},
	},
});
