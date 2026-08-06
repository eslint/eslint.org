if (!globalThis.process) {
	globalThis.process = {};
}

if (!globalThis.process.cwd) {
	globalThis.process.cwd = () => "/";
}

if (!globalThis.process.env) {
	globalThis.process.env = {};
}

if (!globalThis.process.versions) {
	globalThis.process.versions = { node: "22.0.0" };
}
