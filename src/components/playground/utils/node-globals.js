/**
 * @fileoverview Defines the Node.js globals that ESLint and the TypeScript
 * parser expect to exist. This must be imported before either of them.
 */

import process from "process";

globalThis.global ??= globalThis;
globalThis.process ??= process;

// some dependencies check the version of Node.js they are running in
globalThis.process.versions = {
	...globalThis.process.versions,
	node: "16.0.0",
};
