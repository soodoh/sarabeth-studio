import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import type { JSX } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import globalStyles from "@/styles/globals.css?url";
import { fetchCommonData } from "@/utils/server-functions";

const title = "Sarabeth Belón: Portfolio";
const description =
	"Sarabeth Belon, a young female opera singer, captivates audiences with her tessitura and repertoire versatility. Learn more about this artist!";

export const Route = createRootRoute({
	loader: () => fetchCommonData(),
	staleTime: Number.POSITIVE_INFINITY,
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{ title },
			{ name: "description", content: description },
			{
				name: "keywords",
				content: "young female opera singer, opera singer los angeles",
			},
			{ name: "geo.region", content: "US-CA" },
			{ name: "geo.placename", content: "Altadena" },
			{
				name: "google-site-verification",
				content: "recDsrmbMWYOcfMC0vEE0asXttST_2d-4VZs1EVtSps",
			},
			{ name: "GOOGLEBOT", content: "index, follow" },
			{ name: "ROBOTS", content: "index, follow" },
			{ name: "robots", content: "index, follow" },
			{ name: "msapplication-TileColor", content: "#da532c" },
			{ name: "theme-color", content: "#ffffff" },
		],
		links: [
			{ rel: "stylesheet", href: globalStyles },
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/favicon/apple-touch-icon.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon/favicon-16x16.png",
			},
			{ rel: "icon", href: "/favicon.png" },
			{ rel: "manifest", href: "/favicon/site.webmanifest" },
			{
				rel: "mask-icon",
				href: "/favicon/safari-pinned-tab.svg",
				color: "#5bbad5",
			},
		],
	}),
	notFoundComponent: () => <h1>Page not found</h1>,
	component: RootComponent,
});

function RootComponent(): JSX.Element {
	const { brandName, currentYear, location, socialMediaLinks } =
		Route.useLoaderData();

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<Header brandName={brandName} />
				<main>
					<Outlet />
				</main>
				<Footer
					currentYear={currentYear}
					location={location}
					socialMediaLinks={socialMediaLinks}
				/>
				<Scripts />
			</body>
		</html>
	);
}
