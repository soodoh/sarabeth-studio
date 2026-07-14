import { fileURLToPath } from "node:url";
import { defineConfig, mergeConfig } from "vite";
import { sharedViteConfig } from "./vite.shared.config";

export default defineConfig(
	mergeConfig(sharedViteConfig, {
		envDir: false,
		resolve: {
			alias: {
				"@/utils/data-provider.server": fileURLToPath(
					new URL("./tests/support/data-provider.server.ts", import.meta.url),
				),
				"@/utils/get-current-date.server": fileURLToPath(
					new URL(
						"./tests/support/get-current-date.server.ts",
						import.meta.url,
					),
				),
			},
		},
	}),
);
