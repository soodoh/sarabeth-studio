import { fileURLToPath } from "node:url";
import { defineConfig, mergeConfig } from "vite";
import { sharedViteConfig } from "./vite.shared.config";

export default defineConfig(
	mergeConfig(sharedViteConfig, {
		envDir: false,
		resolve: {
			alias: {
				"@/utils/contentful-entry-source.server": fileURLToPath(
					new URL(
						"./tests/support/contentful-entry-source.server.ts",
						import.meta.url,
					),
				),
				"@/utils/image.server": fileURLToPath(
					new URL("./tests/support/image.server.ts", import.meta.url),
				),
			},
		},
	}),
);
