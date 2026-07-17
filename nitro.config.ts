import { defineConfig } from "nitro/config";

export default defineConfig({
	awsAmplify: {
		catchAllStaticFallback: true,
		runtime: "nodejs24.x",
	},
});
