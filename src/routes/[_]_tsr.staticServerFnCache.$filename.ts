import { createFileRoute } from "@tanstack/react-router";
import { serveStaticServerFunctionCache } from "@/utils/static-server-function-cache.server";

export const Route = createFileRoute("/__tsr/staticServerFnCache/$filename")({
	server: {
		handlers: {
			GET: ({ params }) => serveStaticServerFunctionCache(params.filename),
			ANY: () =>
				new Response(null, {
					status: 405,
					headers: { Allow: "GET, HEAD" },
				}),
		},
	},
});
