import { expect, test } from "@playwright/test";
import {
	createProductionRoutes,
	resolveRouteTarget,
} from "@/scripts/amplify-routing";
import publicRoutes from "@/scripts/public-routes.json" with { type: "json" };

const productionRoutes = createProductionRoutes(
	[
		{
			path: "/*.*",
			target: { kind: "Static" },
			fallback: { kind: "Compute", src: "default" },
		},
		{
			path: "/*",
			target: { kind: "Compute", src: "default" },
			fallback: { kind: "Static" },
		},
	],
	publicRoutes,
);

test("routes only the approved API endpoints to production compute", () => {
	for (const path of ["/api/email", "/api/youtube-playlist"]) {
		expect(resolveRouteTarget(path, productionRoutes)).toEqual({
			kind: "Compute",
			src: "default",
		});
	}
	const publicPaths = publicRoutes.flatMap((route) =>
		route === "/" ? [route] : [route, `${route}/`],
	);
	for (const path of [...publicPaths, "/assets/app.js"]) {
		expect(resolveRouteTarget(path, productionRoutes)?.kind).toBe("Static");
	}
	expect(resolveRouteTarget("/media", productionRoutes)?.kind).toBe("Static");
});

test("requests an unknown route through the static 404 policy without Contentful credentials", () => {
	const spaceId = process.env.CONTENTFUL_SPACE_ID;
	const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
	delete process.env.CONTENTFUL_SPACE_ID;
	delete process.env.CONTENTFUL_ACCESS_TOKEN;
	try {
		expect(
			resolveRouteTarget("/deployment-smoke-404", productionRoutes),
		).toEqual({ kind: "Static" });
	} finally {
		if (spaceId !== undefined) process.env.CONTENTFUL_SPACE_ID = spaceId;
		if (accessToken !== undefined) {
			process.env.CONTENTFUL_ACCESS_TOKEN = accessToken;
		}
	}
});
