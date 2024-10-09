#!/usr/bin/env node

import { latest } from "./index.js";

const packages = process?.argv.slice(2);

const versions = new Map<string, string>();
let code = 0;

async function main() {
	for (const pkg of packages) {
		const { value, error } = await latest(pkg);

		if (error) {
			code++;
			console.error(`Error fetching latest version for ${pkg}: ${error}`);
			continue;
		}

		if (value !== null || value !== undefined) {
			versions.set(pkg, value);
		}
	}
}

main().catch((err) => {
	console.error(`Fatal error: ${err.message}`);
	process.exit(1);
});

process.on("exit", async () => {
	for (const pkg of packages) {
		if (versions.has(pkg)) console.log("%s: %s", pkg, versions.get(pkg));
	}
	process.exit(code);
});
