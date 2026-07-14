import { createFileRoute } from "@tanstack/react-router";
import { handleEmailRequest } from "@/utils/email.server";

export const postEmailRequest = ({ request }: { request: Request }) =>
	handleEmailRequest(request);

export const methodNotAllowedRequest = () =>
	new Response(null, {
		status: 405,
		headers: { Allow: "POST" },
	});

export const Route = createFileRoute("/api/email")({
	server: {
		handlers: {
			POST: postEmailRequest,
			ANY: methodNotAllowedRequest,
		},
	},
});
