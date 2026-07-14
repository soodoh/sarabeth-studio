import { readFile } from "node:fs/promises";
import path from "node:path";

const cacheFilenamePattern = /^[a-f0-9]{40}\.json$/;

export const serveStaticServerFunctionCache = async (
	filename: string,
): Promise<Response> => {
	if (!cacheFilenamePattern.test(filename)) {
		return new Response(null, { status: 404 });
	}

	try {
		const body = await readFile(
			path.join(
				process.cwd(),
				".output",
				"public",
				"__tsr",
				"staticServerFnCache",
				filename,
			),
		);
		return new Response(body, {
			headers: {
				"Cache-Control": "public, max-age=31536000, immutable",
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			error.code === "ENOENT"
		) {
			return new Response(null, { status: 404 });
		}
		throw error;
	}
};
