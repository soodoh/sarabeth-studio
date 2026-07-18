import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
let rolloverTimer: ReturnType<typeof setTimeout> | undefined;

const getCurrentDateKey = (): string => {
	const date = new Date();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
};

const scheduleRollover = (): void => {
	if (rolloverTimer !== undefined || listeners.size === 0) return;

	const now = new Date();
	const nextDay = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() + 1,
	).getTime();
	rolloverTimer = setTimeout(
		() => {
			rolloverTimer = undefined;
			for (const listener of listeners) listener();
			scheduleRollover();
		},
		nextDay - now.getTime() + 100,
	);
};

const subscribe = (listener: () => void): (() => void) => {
	listeners.add(listener);
	scheduleRollover();
	return () => {
		listeners.delete(listener);
		if (listeners.size === 0 && rolloverTimer !== undefined) {
			clearTimeout(rolloverTimer);
			rolloverTimer = undefined;
		}
	};
};

export const useCurrentDateKey = (renderedAt: string): string =>
	useSyncExternalStore(subscribe, getCurrentDateKey, () =>
		renderedAt.slice(0, 10),
	);
