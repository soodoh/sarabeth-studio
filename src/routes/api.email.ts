import { createFileRoute } from "@tanstack/react-router";
import {
	type EmailDependencies,
	handleEmailRequest,
} from "@/utils/email.server";

export const postEmailRequest = (
	{ request }: { request: Request },
	dependencies?: EmailDependencies,
) => handleEmailRequest(request, dependencies);

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
