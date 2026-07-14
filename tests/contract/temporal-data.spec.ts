import { expect, test } from "@playwright/test";
import { createTestSnapshot } from "@/tests/support/snapshot-test-data";
import { getCurrentYear, partitionEngagements } from "@/utils/temporal-data";

const engagement = createTestSnapshot().engagements.engagements[0];

test("derives the displayed year from an explicit date", () => {
	expect(getCurrentYear(new Date("2025-06-30T12:00:00.000Z"))).toBe(2025);
});

test("partitions engagements at the UTC day boundary and sorts both groups", () => {
	const result = partitionEngagements(
		[
			{ ...engagement, id: "future", endDate: "2026-02-01" },
			{ ...engagement, id: "past", endDate: "2025-12-30" },
			{ ...engagement, id: "today", endDate: "2026-01-01" },
			{ ...engagement, id: "older", endDate: "2024-01-01" },
		],
		new Date("2026-01-01T12:00:00.000Z"),
	);

	expect(result.upcoming.map(({ id }) => id)).toEqual(["today", "future"]);
	expect(result.past.map(({ id }) => id)).toEqual(["past", "older"]);
});
