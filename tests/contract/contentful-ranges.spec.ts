import { expect, test } from "@playwright/test";
import { parseAudioRange } from "@/tests/support/contentful-routes";

const cases = [
	{
		name: "full",
		range: undefined,
		expected: { status: 200, start: 0, end: 99 },
	},
	{
		name: "bounded",
		range: "bytes=10-19",
		expected: { status: 206, start: 10, end: 19 },
	},
	{
		name: "open-ended",
		range: "bytes=90-",
		expected: { status: 206, start: 90, end: 99 },
	},
	{
		name: "suffix",
		range: "bytes=-10",
		expected: { status: 206, start: 90, end: 99 },
	},
	{
		name: "large suffix",
		range: "bytes=-200",
		expected: { status: 206, start: 0, end: 99 },
	},
	{ name: "malformed", range: "bytes=abc", expected: { status: 416 } },
	{ name: "multiple", range: "bytes=0-1,4-5", expected: { status: 416 } },
	{ name: "unsatisfiable", range: "bytes=100-", expected: { status: 416 } },
	{ name: "reversed", range: "bytes=20-10", expected: { status: 416 } },
] as const;

for (const rangeCase of cases) {
	test(`parses ${rangeCase.name} audio ranges`, () => {
		expect(parseAudioRange(rangeCase.range, 100)).toEqual(rangeCase.expected);
	});
}
