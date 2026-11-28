import "./utils/node-globals";
import React from "react";
import App from "./app";

/**
 * The entry point of the playground, rendered by `src/pages/play.astro`.
 * @returns {React.ReactElement} The playground application.
 */
export default function Playground() {
	return (
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
}
