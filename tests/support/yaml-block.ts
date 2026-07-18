export const extractYamlBlock = (source: string, anchor: string): string => {
	const lines = source.split("\n");
	const start = lines.findIndex((line) => line.trim() === anchor);
	if (start < 0) throw new Error(`Missing YAML anchor: ${anchor}`);

	const indentation = lines[start].length - lines[start].trimStart().length;
	let end = start + 1;
	while (end < lines.length) {
		const line = lines[end];
		if (line.trim()) {
			const lineIndentation = line.length - line.trimStart().length;
			if (lineIndentation <= indentation) break;
		}
		end += 1;
	}
	return lines.slice(start, end).join("\n");
};
