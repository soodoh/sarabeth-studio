const deploymentUrl = process.env.LHCI_BASE_URL?.replace(/\/$/, "");
if (!deploymentUrl) {
	throw new Error("LHCI_BASE_URL is required");
}

const formFactor = process.env.LHCI_FORM_FACTOR ?? "mobile";
if (!new Set(["desktop", "mobile"]).has(formFactor)) {
	throw new Error("LHCI_FORM_FACTOR must be desktop or mobile");
}

const routes = [
	"/",
	"/about",
	"/contact",
	"/engagements",
	"/lessons",
	"/media",
];
const baselineMinimums = {
	desktop: {
		performance: 0.77,
		accessibility: 0.91,
		"best-practices": 0.92,
		seo: 1,
	},
	mobile: {
		performance: 0.74,
		accessibility: 0.91,
		"best-practices": 0.92,
		seo: 1,
	},
};
const allowedMeasurementVariance = 0.04;
const thresholds = Object.fromEntries(
	Object.entries(baselineMinimums[formFactor]).map(([category, baseline]) => [
		`categories:${category}`,
		["error", { minScore: Math.max(0, baseline - allowedMeasurementVariance) }],
	]),
);

module.exports = {
	ci: {
		collect: {
			url: routes.map((route) => `${deploymentUrl}${route}`),
			numberOfRuns: 1,
			settings: formFactor === "desktop" ? { preset: "desktop" } : {},
		},
		assert: {
			assertions: thresholds,
		},
		upload: {
			target: "filesystem",
			outputDir: `.lighthouseci/${formFactor}`,
		},
	},
};
