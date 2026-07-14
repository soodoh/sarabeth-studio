import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import type { UserConfig } from "vite";

export const sharedViteConfig = {
	server: {
		host: "127.0.0.1",
		port: 3000,
	},
	preview: {
		host: process.env.HOST ?? "127.0.0.1",
		port: Number(process.env.PORT ?? 3000),
		strictPort: true,
	},
	resolve: {
		tsconfigPaths: true,
	},
	build: {
		sourcemap: true,
	},
	plugins: [
		tanstackStart({
			pages: [{ path: "/" }],
			prerender: {
				enabled: true,
				crawlLinks: true,
				failOnError: true,
			},
		}),
		nitro(),
		viteReact(),
		tailwindcss(),
	],
} satisfies UserConfig;
