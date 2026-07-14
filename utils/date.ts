export const getCurrentDate = (): Date =>
	new Date(process.env.PLAYWRIGHT_TEST_DATE ?? new Date().toISOString());
